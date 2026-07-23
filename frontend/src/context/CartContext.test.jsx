import { render, screen, act } from "@testing-library/react";
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

const renderWithAuth = (user) =>
    render(
        <AuthContext.Provider value={{ user }}>
            <CartProvider>
                <TestComponent />
            </CartProvider>
        </AuthContext.Provider>
    );

describe("CartContext", () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it("starts with empty cart", () => {
        renderWithAuth({ role: "User", username: "alice", token: "abc" });
        expect(screen.getByTestId("count").textContent).toBe("0");
        expect(screen.getByTestId("items").textContent).toBe("0");
        expect(screen.getByTestId("total").textContent).toBe("0");
    });

    it("loads cart from localStorage on mount", () => {
        const storedCart = [sampleItem];
        localStorage.setItem("cart", JSON.stringify(storedCart));
        renderWithAuth({ role: "User", username: "alice", token: "abc" });
        expect(screen.getByTestId("count").textContent).toBe("1");
    });

    it("addToCart adds new item", () => {
        renderWithAuth({ role: "User", username: "alice", token: "abc" });
        act(() => {
            screen.getByTestId("add-1").click();
        });
        expect(screen.getByTestId("count").textContent).toBe("1");
        expect(screen.getByTestId("items").textContent).toBe("1");
        expect(screen.getByTestId("total").textContent).toBe("100");
    });

    it("addToCart increments quantity for existing item", () => {
        renderWithAuth({ role: "User", username: "alice", token: "abc" });
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
        renderWithAuth({ role: "User", username: "alice", token: "abc" });
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
        renderWithAuth({ role: "User", username: "alice", token: "abc" });
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
        expect(screen.getByTestId("items").textContent).toBe("1");
    });

    it("updateQuantity changes item quantity", () => {
        renderWithAuth({ role: "User", username: "alice", token: "abc" });
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
        renderWithAuth({ role: "User", username: "alice", token: "abc" });
        act(() => {
            screen.getByTestId("add-1").click();
        });
        act(() => {
            testCart.updateQuantity(1, -3);
        });
        expect(screen.getByTestId("items").textContent).toBe("1");
        expect(Number(screen.getByTestId("total").textContent)).toBe(100);
    });

    it("clearCart empties the cart and localStorage", () => {
        renderWithAuth({ role: "User", username: "alice", token: "abc" });
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
