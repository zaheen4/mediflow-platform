import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import EquipmentDetail from "./EquipmentDetail";
import { CartContext } from "../../context/CartContext";

vi.mock("sonner", () => ({
    toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() },
}));

const mockApi = vi.hoisted(() => ({ get: vi.fn() }));

vi.mock("../../services/api", () => ({ default: mockApi }));

const equip = {
    equipment_id: 3,
    name: "MRI Scanner",
    description: "Medical imaging device",
    price: 500000,
    quantity: 2,
    image_url: "mri.png",
};

const renderDetail = (addToCart = vi.fn()) =>
    render(
        <MemoryRouter initialEntries={["/equipment/3"]}>
            <Routes>
                <Route
                    path="/equipment/:id"
                    element={
                        <CartContext.Provider value={{ addToCart }}>
                            <EquipmentDetail />
                        </CartContext.Provider>
                    }
                />
                <Route path="/buy-equipment" element={<div>Shop Page</div>} />
            </Routes>
        </MemoryRouter>
    );

describe("EquipmentDetail", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("shows a spinner while loading", () => {
        mockApi.get.mockReturnValue(new Promise(() => {}));
        renderDetail();
        expect(document.querySelector(".loading-spinner")).toBeTruthy();
    });

    it("renders equipment details after loading", async () => {
        mockApi.get.mockResolvedValue({ data: equip });
        renderDetail();
        expect(await screen.findByText("MRI Scanner")).toBeInTheDocument();
        expect(screen.getByText("Medical imaging device")).toBeInTheDocument();
        expect(screen.getByText("In Stock (2 available)")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Add to Cart" })).not.toBeDisabled();
    });

    it("adds the equipment to the cart", async () => {
        const addToCart = vi.fn();
        const user = userEvent.setup();
        mockApi.get.mockResolvedValue({ data: equip });
        renderDetail(addToCart);
        await screen.findByText("MRI Scanner");
        await user.click(screen.getByRole("button", { name: "Add to Cart" }));
        expect(addToCart).toHaveBeenCalledWith(equip);
    });

    it("shows out of stock state when quantity is zero", async () => {
        const user = userEvent.setup();
        mockApi.get.mockResolvedValue({ data: { ...equip, quantity: 0 } });
        renderDetail();
        expect(await screen.findByText("Out of Stock")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Add to Cart" })).toBeDisabled();
        await user.click(screen.getByRole("button", { name: "Add to Cart" }));
        expect(screen.getByRole("button", { name: "Add to Cart" })).toBeDisabled();
    });

    it("navigates back to the shop when fetch fails", async () => {
        mockApi.get.mockRejectedValue(new Error("Not found"));
        renderDetail();
        expect(await screen.findByText("Shop Page")).toBeInTheDocument();
    });
});
