import { render, screen, act, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { CartProvider, CartContext } from "./CartContext";
import { AuthContext } from "./AuthContext";
import { useContext } from "react";

vi.mock("sonner", () => ({
    toast: {
        success: vi.fn(),
        info: vi.fn(),
    },
}));

const mockApi = vi.hoisted(() => ({
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
}));

vi.mock("../services/api", () => ({
    default: mockApi,
}));

const sampleItem = {
    equipment_id: 1,
    name: "Test Item",
    price: 100,
    description: "A test item",
};

const sampleItem2 = {
    equipment_id: 2,
    name: "Test Item 2",
    price: 50,
    description: "Another test item",
};

let testCart;

const TestComponent = () => {
    const ctx = useContext(CartContext);
    testCart = ctx;
    return (
        <div>
            <span data-testid="count">{ctx.cart.length}</span>
            <span data-testid="items">{ctx.getTotalItems()}</span>
            <span data-testid="total">{ctx.getTotalPrice()}</span>
            <span data-testid="synced">{ctx.synced ? "true" : "false"}</span>
            <button data-testid="add-1" onClick={() => ctx.addToCart(sampleItem)}>
                Add 1
            </button>
            <button data-testid="add-2" onClick={() => ctx.addToCart(sampleItem2)}>
                Add 2
            </button>
            <button data-testid="add-1-again" onClick={() => ctx.addToCart(sampleItem)}>
                Add 1 Again
            </button>
            <button data-testid="remove-1" onClick={() => ctx.removeFromCart(1)}>
                Remove 1
            </button>
            <button data-testid="inc-1" onClick={() => ctx.updateQuantity(1, 5)}>
                Inc 1
            </button>
            <button data-testid="clear" onClick={ctx.clearCart}>
                Clear
            </button>
        </div>
    );
};

function renderWithAuth(user) {
    return render(
        <AuthContext.Provider value={{ user }}>
            <CartProvider>
                <TestComponent />
            </CartProvider>
        </AuthContext.Provider>
    );
}

describe("CartContext — localStorage (guest mode)", () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it("starts with empty cart", () => {
        renderWithAuth(null);
        expect(screen.getByTestId("count").textContent).toBe("0");
        expect(screen.getByTestId("items").textContent).toBe("0");
        expect(screen.getByTestId("total").textContent).toBe("0");
        expect(screen.getByTestId("synced").textContent).toBe("false");
    });

    it("loads cart from localStorage on mount", () => {
        localStorage.setItem("cart", JSON.stringify([sampleItem]));
        renderWithAuth(null);
        expect(screen.getByTestId("count").textContent).toBe("1");
    });

    it("addToCart adds new item", () => {
        renderWithAuth(null);
        act(() => {
            screen.getByTestId("add-1").click();
        });
        expect(screen.getByTestId("count").textContent).toBe("1");
        expect(screen.getByTestId("items").textContent).toBe("1");
        expect(screen.getByTestId("total").textContent).toBe("100");
    });

    it("addToCart increments quantity for existing item", () => {
        renderWithAuth(null);
        act(() => {
            screen.getByTestId("add-1").click();
        });
        act(() => {
            screen.getByTestId("add-1-again").click();
        });
        expect(screen.getByTestId("count").textContent).toBe("1");
        expect(screen.getByTestId("items").textContent).toBe("2");
        expect(screen.getByTestId("total").textContent).toBe("200");
    });

    it("addToCart supports multiple distinct items", () => {
        renderWithAuth(null);
        act(() => {
            screen.getByTestId("add-1").click();
        });
        act(() => {
            screen.getByTestId("add-2").click();
        });
        expect(screen.getByTestId("count").textContent).toBe("2");
        expect(screen.getByTestId("items").textContent).toBe("2");
        expect(Number(screen.getByTestId("total").textContent)).toBe(150);
    });

    it("removeFromCart removes item by id", () => {
        renderWithAuth(null);
        act(() => {
            screen.getByTestId("add-1").click();
        });
        act(() => {
            screen.getByTestId("add-2").click();
        });
        expect(screen.getByTestId("count").textContent).toBe("2");
        act(() => {
            screen.getByTestId("remove-1").click();
        });
        expect(screen.getByTestId("count").textContent).toBe("1");
    });

    it("updateQuantity changes item quantity", () => {
        renderWithAuth(null);
        act(() => {
            screen.getByTestId("add-1").click();
        });
        act(() => {
            screen.getByTestId("inc-1").click();
        });
        expect(screen.getByTestId("items").textContent).toBe("5");
        expect(Number(screen.getByTestId("total").textContent)).toBe(500);
    });

    it("updateQuantity does not allow quantity below 1", () => {
        renderWithAuth(null);
        act(() => {
            screen.getByTestId("add-1").click();
        });
        act(() => {
            testCart.updateQuantity(1, -3);
        });
        expect(screen.getByTestId("items").textContent).toBe("1");
    });

    it("clearCart empties the cart and localStorage", () => {
        renderWithAuth(null);
        act(() => {
            screen.getByTestId("add-1").click();
        });
        expect(screen.getByTestId("count").textContent).toBe("1");
        act(() => {
            screen.getByTestId("clear").click();
        });
        expect(screen.getByTestId("count").textContent).toBe("0");
        expect(JSON.parse(localStorage.getItem("cart"))).toEqual([]);
    });

    it("clears cart when user logs out (becomes null)", () => {
        const { rerender } = render(
            <AuthContext.Provider value={{ user: { role: "User", username: "alice", token: "abc" } }}>
                <CartProvider>
                    <TestComponent />
                </CartProvider>
            </AuthContext.Provider>
        );
        act(() => {
            screen.getByTestId("add-1").click();
        });
        expect(screen.getByTestId("count").textContent).toBe("1");
        rerender(
            <AuthContext.Provider value={{ user: null }}>
                <CartProvider>
                    <TestComponent />
                </CartProvider>
            </AuthContext.Provider>
        );
        expect(screen.getByTestId("count").textContent).toBe("0");
    });
});

describe("CartContext — server synced mode", () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
        mockApi.get.mockResolvedValue({
            data: {
                items: [],
                totalItems: 0,
                totalPrice: 0,
            },
        });
        mockApi.post.mockResolvedValue({ data: { message: "ok" } });
        mockApi.put.mockResolvedValue({ data: { message: "ok" } });
        mockApi.delete.mockResolvedValue({ data: { message: "ok" } });
    });

    it("fetches cart from server on mount with user", async () => {
        mockApi.get.mockResolvedValue({
            data: {
                items: [{ ...sampleItem, quantity: 2, stock: 10 }],
                totalItems: 2,
                totalPrice: 200,
            },
        });
        renderWithAuth({ role: "User", username: "alice", token: "abc" });

        await waitFor(() => {
            expect(screen.getByTestId("count").textContent).toBe("1");
        });
        expect(screen.getByTestId("items").textContent).toBe("2");
        expect(screen.getByTestId("total").textContent).toBe("200");
        expect(screen.getByTestId("synced").textContent).toBe("true");
    });

    it("merges localStorage items on login", async () => {
        localStorage.setItem("cart", JSON.stringify([{ equipment_id: 1, quantity: 2 }]));
        mockApi.get.mockResolvedValue({
            data: {
                items: [{ ...sampleItem, quantity: 2, stock: 10 }],
                totalItems: 2,
                totalPrice: 200,
            },
        });

        renderWithAuth({ role: "User", username: "alice", token: "abc" });

        await waitFor(() => {
            expect(mockApi.post).toHaveBeenCalledWith("/cart/merge", {
                items: [{ equipment_id: 1, quantity: 2 }],
            });
        });
    });

    it("addToCart calls API when synced", async () => {
        renderWithAuth({ role: "User", username: "alice", token: "abc" });

        await waitFor(() => {
            expect(screen.getByTestId("synced").textContent).toBe("true");
        });

        mockApi.get.mockResolvedValue({
            data: {
                items: [{ ...sampleItem, quantity: 1, stock: 10 }],
                totalItems: 1,
                totalPrice: 100,
            },
        });

        await act(async () => {
            await screen.getByTestId("add-1").click();
        });

        expect(mockApi.post).toHaveBeenCalledWith("/cart/add", { equipment_id: 1 });
    });

    it("removeFromCart calls API when synced", async () => {
        mockApi.get.mockResolvedValue({
            data: {
                items: [{ ...sampleItem, quantity: 1, stock: 10 }],
                totalItems: 1,
                totalPrice: 100,
            },
        });

        renderWithAuth({ role: "User", username: "alice", token: "abc" });

        await waitFor(() => {
            expect(screen.getByTestId("count").textContent).toBe("1");
        });

        await act(async () => {
            await screen.getByTestId("remove-1").click();
        });

        expect(mockApi.delete).toHaveBeenCalledWith("/cart/remove/1");
    });

    it("updateQuantity calls API when synced", async () => {
        mockApi.get.mockResolvedValue({
            data: {
                items: [{ ...sampleItem, quantity: 1, stock: 10 }],
                totalItems: 1,
                totalPrice: 100,
            },
        });

        renderWithAuth({ role: "User", username: "alice", token: "abc" });

        await waitFor(() => {
            expect(screen.getByTestId("count").textContent).toBe("1");
        });

        await act(async () => {
            await testCart.updateQuantity(1, 5);
        });

        expect(mockApi.put).toHaveBeenCalledWith("/cart/update/1", { quantity: 5 });
        expect(screen.getByTestId("items").textContent).toBe("5");
    });

    it("clearCart calls API when synced", async () => {
        mockApi.get.mockResolvedValue({
            data: {
                items: [{ ...sampleItem, quantity: 1, stock: 10 }],
                totalItems: 1,
                totalPrice: 100,
            },
        });

        renderWithAuth({ role: "User", username: "alice", token: "abc" });

        await waitFor(() => {
            expect(screen.getByTestId("count").textContent).toBe("1");
        });

        await act(async () => {
            await testCart.clearCart();
        });

        expect(mockApi.delete).toHaveBeenCalledWith("/cart");
        expect(screen.getByTestId("count").textContent).toBe("0");
    });
});
