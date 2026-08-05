import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Shop from "./Shop";
import { CartContext } from "../../context/CartContext";

vi.mock("sonner", () => ({
    toast: { error: vi.fn(), success: vi.fn(), warning: vi.fn(), info: vi.fn() },
}));

const mockApi = vi.hoisted(() => ({ get: vi.fn() }));

vi.mock("../../services/api", () => ({ default: mockApi }));

const equipments = [
    {
        equipment_id: 1,
        name: "Stethoscope",
        description: "A diagnostic stethoscope",
        price: 1200,
        quantity: 5,
        image_url: "steth.png",
    },
    {
        equipment_id: 2,
        name: "Sphygmomanometer",
        description: "Blood pressure monitor",
        price: 800,
        quantity: 0,
        image_url: "bp.png",
    },
];

const categories = [{ category_id: 1, name: "Cardio" }];

const renderShop = (cartValue = { addToCart: vi.fn(), getTotalItems: () => 0 }) =>
    render(
        <CartContext.Provider value={cartValue}>
            <MemoryRouter>
                <Routes>
                    <Route path="/" element={<Shop />} />
                    <Route path="/cart" element={<div>Cart Page</div>} />
                </Routes>
            </MemoryRouter>
        </CartContext.Provider>
    );

describe("Shop", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("shows skeleton while equipment is loading", () => {
        mockApi.get.mockImplementation((url) =>
            url === "/categories" ? Promise.resolve({ data: categories }) : new Promise(() => {})
        );
        const { container } = renderShop();
        expect(container.querySelector(".skeleton")).toBeTruthy();
    });

    it("renders equipment cards and marks out of stock items", async () => {
        mockApi.get.mockImplementation((url) =>
            url === "/categories" ? Promise.resolve({ data: categories }) : Promise.resolve({ data: equipments })
        );
        renderShop();
        expect(await screen.findByText("Stethoscope")).toBeInTheDocument();
        expect(screen.getByText("Sphygmomanometer")).toBeInTheDocument();
        expect(screen.getByText("Out of Stock")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Add Stethoscope to cart" })).toBeInTheDocument();
    });

    it("shows empty state when no equipment matches", async () => {
        mockApi.get.mockImplementation((url) =>
            url === "/categories" ? Promise.resolve({ data: categories }) : Promise.resolve({ data: [] })
        );
        renderShop();
        expect(await screen.findByText("No equipment found")).toBeInTheDocument();
    });

    it("adds an item to the cart", async () => {
        const addToCart = vi.fn();
        mockApi.get.mockImplementation((url) =>
            url === "/categories" ? Promise.resolve({ data: categories }) : Promise.resolve({ data: equipments })
        );
        renderShop({ addToCart, getTotalItems: () => 0 });
        await screen.findByText("Stethoscope");
        await userEvent.setup().click(screen.getByRole("button", { name: "Add Stethoscope to cart" }));
        expect(addToCart).toHaveBeenCalledWith(equipments[0]);
    });

    it("searches equipment on submit", async () => {
        const user = userEvent.setup();
        mockApi.get.mockImplementation((url) =>
            url === "/categories"
                ? Promise.resolve({ data: categories })
                : Promise.resolve({ data: { data: equipments, totalPages: 1 } })
        );
        renderShop();
        await screen.findByText("Stethoscope");
        await user.type(screen.getByPlaceholderText("Search equipment..."), "steth{Enter}");
        await waitFor(() =>
            expect(mockApi.get).toHaveBeenCalledWith(
                "/equipment",
                expect.objectContaining({ params: expect.objectContaining({ search: "steth", page: 1 }) })
            )
        );
    });

    it("filters equipment by category", async () => {
        const user = userEvent.setup();
        mockApi.get.mockImplementation((url) =>
            url === "/categories"
                ? Promise.resolve({ data: categories })
                : Promise.resolve({ data: { data: equipments, totalPages: 1 } })
        );
        renderShop();
        await screen.findByText("Stethoscope");
        await user.selectOptions(screen.getByRole("combobox"), "1");
        await waitFor(() =>
            expect(mockApi.get).toHaveBeenCalledWith(
                "/equipment",
                expect.objectContaining({ params: expect.objectContaining({ category: "1", page: 1 }) })
            )
        );
    });

    it("navigates to the cart via the floating button", async () => {
        const user = userEvent.setup();
        mockApi.get.mockImplementation((url) =>
            url === "/categories" ? Promise.resolve({ data: categories }) : Promise.resolve({ data: equipments })
        );
        renderShop();
        await screen.findByText("Stethoscope");
        await user.click(screen.getByRole("button", { name: "Cart with 0 items" }));
        expect(await screen.findByText("Cart Page")).toBeInTheDocument();
    });

    it("renders pagination controls when multiple pages exist", async () => {
        mockApi.get.mockImplementation((url) =>
            url === "/categories"
                ? Promise.resolve({ data: categories })
                : Promise.resolve({ data: { data: equipments, totalPages: 3 } })
        );
        renderShop();
        expect(await screen.findByText("Stethoscope")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
    });
});
