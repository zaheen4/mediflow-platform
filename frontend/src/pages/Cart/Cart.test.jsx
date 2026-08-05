import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Cart from "./Cart";
import { CartContext } from "../../context/CartContext";

vi.mock("sonner", () => ({
    toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() },
}));

const items = [
    {
        equipment_id: 1,
        name: "Stethoscope",
        price: 1200,
        quantity: 2,
        description: "A diagnostic stethoscope",
        image_url: "steth.png",
    },
    {
        equipment_id: 2,
        name: "BP Monitor",
        price: 800,
        quantity: 1,
        description: "Blood pressure monitor",
        image_url: "bp.png",
    },
];

const renderCart = (overrides = {}) => {
    const cartValue = {
        cart: [],
        removeFromCart: vi.fn(),
        updateQuantity: vi.fn(),
        clearCart: vi.fn(),
        getTotalPrice: () => 0,
        getTotalItems: () => 0,
        ...overrides,
    };
    return render(
        <CartContext.Provider value={cartValue}>
            <MemoryRouter>
                <Routes>
                    <Route path="/" element={<Cart />} />
                    <Route path="/checkout" element={<div>Checkout Page</div>} />
                    <Route path="/buy-equipment" element={<div>Shop Page</div>} />
                </Routes>
            </MemoryRouter>
        </CartContext.Provider>
    );
};

describe("Cart", () => {
    it("renders empty state with browse link", () => {
        renderCart();
        expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Browse Equipment" })).toBeInTheDocument();
    });

    it("renders cart items and order summary", () => {
        renderCart({ cart: items, getTotalItems: () => 3, getTotalPrice: () => 3200 });
        expect(screen.getByText("Stethoscope")).toBeInTheDocument();
        expect(screen.getByText("BP Monitor")).toBeInTheDocument();
        expect(screen.getAllByText("BDT 3200.00").length).toBeGreaterThan(0);
    });

    it("navigates to checkout when cart has items", async () => {
        const user = userEvent.setup();
        renderCart({ cart: items, getTotalItems: () => 3, getTotalPrice: () => 3200 });
        await user.click(screen.getByRole("button", { name: "Proceed to Checkout" }));
        expect(await screen.findByText("Checkout Page")).toBeInTheDocument();
    });

    it("increases item quantity", async () => {
        const user = userEvent.setup();
        const updateQuantity = vi.fn();
        renderCart({ cart: items, updateQuantity, getTotalItems: () => 3, getTotalPrice: () => 3200 });
        await user.click(screen.getAllByRole("button", { name: "Increase quantity" })[0]);
        expect(updateQuantity).toHaveBeenCalledWith(1, 3);
    });

    it("decreases item quantity", async () => {
        const user = userEvent.setup();
        const updateQuantity = vi.fn();
        renderCart({ cart: items, updateQuantity, getTotalItems: () => 3, getTotalPrice: () => 3200 });
        await user.click(screen.getAllByRole("button", { name: "Decrease quantity" })[0]);
        expect(updateQuantity).toHaveBeenCalledWith(1, 1);
    });

    it("removes an item", async () => {
        const user = userEvent.setup();
        const removeFromCart = vi.fn();
        const { container } = renderCart({
            cart: items,
            removeFromCart,
            getTotalItems: () => 3,
            getTotalPrice: () => 3200,
        });
        await user.click(container.querySelector('button[title="Remove item"]'));
        expect(removeFromCart).toHaveBeenCalledWith(1);
    });

    it("clears the cart", async () => {
        const user = userEvent.setup();
        const clearCart = vi.fn().mockResolvedValue();
        const { toast } = await import("sonner");
        renderCart({ cart: items, clearCart, getTotalItems: () => 3, getTotalPrice: () => 3200 });
        await user.click(screen.getByRole("button", { name: "Clear Cart" }));
        expect(clearCart).toHaveBeenCalled();
        expect(toast.info).toHaveBeenCalledWith("Cart cleared");
    });
});
