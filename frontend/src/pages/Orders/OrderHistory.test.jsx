import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import OrderHistory from "./OrderHistory";

vi.mock("sonner", () => ({
    toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() },
}));

const mockApi = vi.hoisted(() => ({ get: vi.fn(), put: vi.fn() }));

vi.mock("../../services/api", () => ({ default: mockApi }));

const orders = [
    {
        order_id: 7,
        created_at: "2026-01-15T10:00:00Z",
        status: "Pending",
        total_amount: "2400.00",
        items: [{ order_item_id: 1, equipment_name: "Stethoscope", quantity: 2, unit_price: "1200.00" }],
    },
];

describe("OrderHistory", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("shows skeleton while loading", () => {
        mockApi.get.mockReturnValue(new Promise(() => {}));
        const { container } = render(<OrderHistory />);
        expect(container.querySelector(".skeleton")).toBeTruthy();
    });

    it("shows empty state when there are no orders", async () => {
        mockApi.get.mockResolvedValue({ data: [] });
        render(<OrderHistory />);
        expect(await screen.findByText("No orders yet")).toBeInTheDocument();
    });

    it("renders orders with items and totals", async () => {
        mockApi.get.mockResolvedValue({ data: orders });
        render(<OrderHistory />);
        expect(await screen.findByText("Order #7")).toBeInTheDocument();
        expect(screen.getByText("Pending")).toBeInTheDocument();
        expect(screen.getAllByText("BDT 2400.00").length).toBeGreaterThan(0);
        expect(screen.getAllByText("BDT 1200.00").length).toBeGreaterThan(0);
        expect(screen.getByText("Stethoscope")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Cancel Order" })).toBeInTheDocument();
    });

    it("does not cancel when confirm is declined", async () => {
        const user = userEvent.setup();
        vi.spyOn(window, "confirm").mockReturnValue(false);
        mockApi.get.mockResolvedValue({ data: orders });
        render(<OrderHistory />);
        await screen.findByText("Order #7");
        await user.click(screen.getByRole("button", { name: "Cancel Order" }));
        expect(mockApi.put).not.toHaveBeenCalled();
    });

    it("cancels an order when confirmed", async () => {
        const user = userEvent.setup();
        vi.spyOn(window, "confirm").mockReturnValue(true);
        mockApi.get.mockResolvedValue({ data: orders });
        mockApi.put.mockResolvedValue({ data: {} });
        render(<OrderHistory />);
        await screen.findByText("Order #7");
        await user.click(screen.getByRole("button", { name: "Cancel Order" }));
        await waitFor(() => expect(mockApi.put).toHaveBeenCalledWith("/orders/7/cancel"));
        expect(await screen.findByText("Cancelled")).toBeInTheDocument();
    });

    it("shows an error toast when cancellation fails", async () => {
        const user = userEvent.setup();
        vi.spyOn(window, "confirm").mockReturnValue(true);
        const { toast } = await import("sonner");
        mockApi.get.mockResolvedValue({ data: orders });
        mockApi.put.mockRejectedValue({ response: { data: { message: "Cannot cancel" } } });
        render(<OrderHistory />);
        await screen.findByText("Order #7");
        await user.click(screen.getByRole("button", { name: "Cancel Order" }));
        await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Cannot cancel"));
    });

    it("renders pagination when there are multiple pages", async () => {
        mockApi.get.mockResolvedValue({ data: { data: orders, totalPages: 2 } });
        render(<OrderHistory />);
        expect(await screen.findByText("Order #7")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
        const user = userEvent.setup();
        await user.click(screen.getByRole("button", { name: "2" }));
        await waitFor(() =>
            expect(mockApi.get).toHaveBeenCalledWith(
                "/my-orders",
                expect.objectContaining({ params: expect.objectContaining({ page: 2 }) })
            )
        );
    });
});
