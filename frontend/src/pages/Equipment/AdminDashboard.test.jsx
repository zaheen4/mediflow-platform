import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AdminDashboard from "./AdminDashboard";

vi.mock("sonner", () => ({
    toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() },
}));

const mockApi = vi.hoisted(() => ({
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
}));

vi.mock("../../services/api", () => ({ default: mockApi }));

const stats = {
    revenue: "250000.00",
    orders: 12,
    pendingOrders: 3,
    users: 45,
    equipment: 20,
    lowStock: 2,
    monthlyRevenue: [
        { month: "Mar", total: "50000.00" },
        { month: "Apr", total: "75000.00" },
    ],
    recentOrders: [
        {
            order_id: 5,
            username: "alice",
            total_amount: "1200.00",
            status: "Pending",
            created_at: "2026-01-10T10:00:00Z",
        },
    ],
};

const equipmentList = [
    {
        equipment_id: 1,
        name: "Stethoscope",
        description: "desc",
        price: 1200,
        quantity: 5,
        category_name: "Cardio",
        image_url: "s.png",
    },
];

const orderList = [
    {
        order_id: 3,
        username: "bob",
        total_amount: "800.00",
        status: "Pending",
        created_at: "2026-01-11T10:00:00Z",
        items: [{ equipment_name: "BP Monitor", quantity: 1 }],
    },
];

const categoriesList = [{ category_id: 1, name: "Cardio", description: "Heart" }];

const mockByUrl = () => {
    mockApi.get.mockImplementation((url) => {
        if (url === "/admin/stats") return Promise.resolve({ data: stats });
        if (url === "/all-orders") return Promise.resolve({ data: orderList });
        if (url === "/equipment") return Promise.resolve({ data: equipmentList });
        if (url === "/categories") return Promise.resolve({ data: categoriesList });
        return Promise.resolve({ data: [] });
    });
};

const equipmentRows = () => screen.getAllByRole("row");
const lastRow = () => equipmentRows()[equipmentRows().length - 1];

describe("AdminDashboard", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders overview stats, monthly revenue and recent orders", async () => {
        mockByUrl();
        render(<AdminDashboard />);
        expect(await screen.findByText("Admin Dashboard")).toBeInTheDocument();
        expect(screen.getByText("BDT 250,000")).toBeInTheDocument();
        expect(screen.getByText("Monthly Revenue (Last 6 Months)")).toBeInTheDocument();
        expect(screen.getByText("Mar")).toBeInTheDocument();
        expect(screen.getByText("Recent Orders")).toBeInTheDocument();
        expect(screen.getByText("alice")).toBeInTheDocument();
    });

    it("manages equipment in the equipment tab", async () => {
        const user = userEvent.setup();
        mockByUrl();
        mockApi.post.mockResolvedValue({ data: {} });
        render(<AdminDashboard />);
        await screen.findByText("Admin Dashboard");
        await user.click(screen.getByRole("tab", { name: "Equipment" }));
        expect(await screen.findByText("Stethoscope")).toBeInTheDocument();

        await user.type(screen.getByPlaceholderText("New Name"), "X-Ray Machine");
        await user.type(screen.getByPlaceholderText("New Description"), "Imaging");
        await user.type(screen.getByPlaceholderText("Price"), "5000");
        await user.type(screen.getByPlaceholderText("Quantity"), "3");
        await user.type(screen.getByPlaceholderText("Image URL"), "xray.png");
        await user.click(within(lastRow()).getByRole("button"));
        await waitFor(() =>
            expect(mockApi.post).toHaveBeenCalledWith(
                "/add-equipment",
                expect.objectContaining({ name: "X-Ray Machine" })
            )
        );
    });

    it("rejects adding equipment with a negative price", async () => {
        const user = userEvent.setup();
        mockByUrl();
        render(<AdminDashboard />);
        await screen.findByText("Admin Dashboard");
        await user.click(screen.getByRole("tab", { name: "Equipment" }));
        await screen.findByText("Stethoscope");
        await user.type(screen.getByPlaceholderText("New Name"), "Bad");
        await user.type(screen.getByPlaceholderText("Price"), "-5");
        await user.type(screen.getByPlaceholderText("Quantity"), "2");
        await user.click(within(lastRow()).getByRole("button"));
        const { toast } = await import("sonner");
        await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Price must be a non-negative number"));
        expect(mockApi.post).not.toHaveBeenCalled();
    });

    it("edits and saves equipment", async () => {
        const user = userEvent.setup();
        mockByUrl();
        mockApi.put.mockResolvedValue({ data: {} });
        render(<AdminDashboard />);
        await screen.findByText("Admin Dashboard");
        await user.click(screen.getByRole("tab", { name: "Equipment" }));
        await screen.findByText("Stethoscope");
        const row = screen.getByText("Stethoscope").closest("tr");
        await user.click(within(row).getAllByRole("button")[0]);
        const nameInput = within(row).getByDisplayValue("Stethoscope");
        await user.clear(nameInput);
        await user.type(nameInput, "Digital Stethoscope");
        await user.click(within(row).getAllByRole("button")[0]);
        await waitFor(() =>
            expect(mockApi.put).toHaveBeenCalledWith(
                "/modify-equipment/1",
                expect.objectContaining({ name: "Digital Stethoscope" })
            )
        );
    });

    it("deletes equipment when confirmed", async () => {
        const user = userEvent.setup();
        vi.spyOn(window, "confirm").mockReturnValue(true);
        mockByUrl();
        mockApi.delete.mockResolvedValue({ data: {} });
        render(<AdminDashboard />);
        await screen.findByText("Admin Dashboard");
        await user.click(screen.getByRole("tab", { name: "Equipment" }));
        await screen.findByText("Stethoscope");
        const row = screen.getByText("Stethoscope").closest("tr");
        await user.click(within(row).getAllByRole("button")[1]);
        await waitFor(() => expect(mockApi.delete).toHaveBeenCalledWith("/delete-equipment/1"));
    });

    it("manages orders in the orders tab", async () => {
        const user = userEvent.setup();
        mockByUrl();
        mockApi.put.mockResolvedValue({ data: {} });
        render(<AdminDashboard />);
        await screen.findByText("Admin Dashboard");
        await user.click(screen.getByRole("button", { name: "Orders" }));
        expect(await screen.findByText("bob")).toBeInTheDocument();
        await user.click(screen.getByRole("button", { name: "Complete" }));
        await waitFor(() => expect(mockApi.put).toHaveBeenCalledWith("/orders/3/status", { status: "Completed" }));
    });

    it("adds a category in the categories tab", async () => {
        const user = userEvent.setup();
        mockByUrl();
        mockApi.post.mockResolvedValue({ data: {} });
        render(<AdminDashboard />);
        await screen.findByText("Admin Dashboard");
        await user.click(screen.getByRole("button", { name: "Categories" }));
        expect(await screen.findByText("Cardio")).toBeInTheDocument();
        await user.type(screen.getByPlaceholderText("New category name"), "Surgical");
        await user.type(screen.getByPlaceholderText("Description (optional)"), "Tools");
        await user.click(screen.getByPlaceholderText("Description (optional)").nextElementSibling);
        await waitFor(() =>
            expect(mockApi.post).toHaveBeenCalledWith("/categories", { name: "Surgical", description: "Tools" })
        );
    });

    it("edits a category", async () => {
        const user = userEvent.setup();
        mockByUrl();
        mockApi.put.mockResolvedValue({ data: {} });
        render(<AdminDashboard />);
        await screen.findByText("Admin Dashboard");
        await user.click(screen.getByRole("button", { name: "Categories" }));
        await screen.findByText("Cardio");
        const row = screen.getByText("Cardio").closest("tr");
        await user.click(within(row).getAllByRole("button")[0]);
        const nameInput = within(row).getByDisplayValue("Cardio");
        await user.clear(nameInput);
        await user.type(nameInput, "Cardiology");
        await user.click(within(row).getByRole("button", { name: "Save" }));
        await waitFor(() =>
            expect(mockApi.put).toHaveBeenCalledWith("/categories/1", { name: "Cardiology", description: "Heart" })
        );
    });

    it("deletes a category when confirmed", async () => {
        const user = userEvent.setup();
        vi.spyOn(window, "confirm").mockReturnValue(true);
        mockByUrl();
        mockApi.delete.mockResolvedValue({ data: {} });
        render(<AdminDashboard />);
        await screen.findByText("Admin Dashboard");
        await user.click(screen.getByRole("button", { name: "Categories" }));
        await screen.findByText("Cardio");
        const row = screen.getByText("Cardio").closest("tr");
        await user.click(within(row).getAllByRole("button")[1]);
        await waitFor(() => expect(mockApi.delete).toHaveBeenCalledWith("/categories/1"));
    });
});
