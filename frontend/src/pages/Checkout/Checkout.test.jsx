import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Checkout from "./Checkout";
import { CartContext } from "../../context/CartContext";

vi.mock("sonner", () => ({
    toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() },
}));

const mockApi = vi.hoisted(() => ({ post: vi.fn() }));

vi.mock("../../services/api", () => ({ default: mockApi }));

const items = [
    {
        equipment_id: 1,
        name: "Stethoscope",
        price: 1200,
        quantity: 2,
        image_url: "steth.png",
    },
];

const renderCheckout = (overrides = {}) => {
    const cartValue = {
        cart: items,
        getTotalItems: () => 2,
        getTotalPrice: () => 2400,
        clearCart: vi.fn().mockResolvedValue(),
        ...overrides,
    };
    return render(
        <CartContext.Provider value={cartValue}>
            <MemoryRouter>
                <Routes>
                    <Route path="/" element={<Checkout />} />
                    <Route path="/orders" element={<div>Orders Page</div>} />
                    <Route path="/buy-equipment" element={<div>Shop Page</div>} />
                </Routes>
            </MemoryRouter>
        </CartContext.Provider>
    );
};

const fillForm = async (user, form = {}) => {
    if (form.full_name !== undefined) await user.type(screen.getByPlaceholderText("John Doe"), form.full_name);
    if (form.phone !== undefined) await user.type(screen.getByPlaceholderText("01XXXXXXXXX"), form.phone);
    if (form.address !== undefined)
        await user.type(screen.getByPlaceholderText("Street, building, apartment"), form.address);
    if (form.city !== undefined) await user.type(screen.getByPlaceholderText("Dhaka"), form.city);
};

describe("Checkout", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("shows empty state when cart is empty", () => {
        renderCheckout({ cart: [] });
        expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Browse Equipment" })).toBeInTheDocument();
    });

    it("renders the form, order summary and payment methods", () => {
        renderCheckout();
        expect(screen.getByText("Checkout")).toBeInTheDocument();
        expect(screen.getByText("Shipping Address")).toBeInTheDocument();
        expect(screen.getByText("Cash on Delivery")).toBeInTheDocument();
        expect(screen.getByText("Credit/Debit Card")).toBeInTheDocument();
        expect(screen.getAllByText("2400.00").length).toBeGreaterThan(0);
    });

    it("requires a full name", async () => {
        const user = userEvent.setup();
        const { toast } = await import("sonner");
        renderCheckout();
        await fillForm(user, { phone: "01711111111", address: "Street 1", city: "Dhaka" });
        await user.click(screen.getByRole("button", { name: "Place Order" }));
        expect(toast.error).toHaveBeenCalledWith("Full name is required");
        expect(mockApi.post).not.toHaveBeenCalled();
    });

    it("requires a phone number", async () => {
        const user = userEvent.setup();
        const { toast } = await import("sonner");
        renderCheckout();
        await fillForm(user, { full_name: "Alice", address: "Street 1", city: "Dhaka" });
        await user.click(screen.getByRole("button", { name: "Place Order" }));
        expect(toast.error).toHaveBeenCalledWith("Phone number is required");
        expect(mockApi.post).not.toHaveBeenCalled();
    });

    it("requires a shipping address", async () => {
        const user = userEvent.setup();
        const { toast } = await import("sonner");
        renderCheckout();
        await fillForm(user, { full_name: "Alice", phone: "01711111111", city: "Dhaka" });
        await user.click(screen.getByRole("button", { name: "Place Order" }));
        expect(toast.error).toHaveBeenCalledWith("Shipping address is required");
    });

    it("requires a city", async () => {
        const user = userEvent.setup();
        const { toast } = await import("sonner");
        renderCheckout();
        await fillForm(user, { full_name: "Alice", phone: "01711111111", address: "Street 1" });
        await user.click(screen.getByRole("button", { name: "Place Order" }));
        expect(toast.error).toHaveBeenCalledWith("City is required");
    });

    it("places an order successfully and navigates to orders", async () => {
        const user = userEvent.setup();
        const clearCart = vi.fn().mockResolvedValue();
        mockApi.post.mockResolvedValue({ data: { orderId: 42 } });
        renderCheckout({ clearCart });
        await fillForm(user, { full_name: "Alice", phone: "01711111111", address: "Street 1", city: "Dhaka" });
        await user.click(screen.getByRole("button", { name: "Place Order" }));
        expect(await screen.findByText("Orders Page")).toBeInTheDocument();
        expect(mockApi.post).toHaveBeenCalledWith("/create-order", {
            items: [{ equipment_id: 1, quantity: 2 }],
            shipping_address: "Alice\nStreet 1\nDhaka",
            contact_phone: "01711111111",
            payment_method: "cash-on-delivery",
        });
        expect(clearCart).toHaveBeenCalled();
    });

    it("shows an error toast when placing the order fails", async () => {
        const user = userEvent.setup();
        const { toast } = await import("sonner");
        mockApi.post.mockRejectedValue({ response: { data: { message: "Out of stock" } } });
        renderCheckout();
        await fillForm(user, { full_name: "Alice", phone: "01711111111", address: "Street 1", city: "Dhaka" });
        await user.click(screen.getByRole("button", { name: "Place Order" }));
        await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Out of stock"));
    });
});
