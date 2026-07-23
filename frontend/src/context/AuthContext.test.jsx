import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import AuthProvider, { AuthContext } from "./AuthContext";
import { useContext } from "react";

const TestComponent = () => {
    const { user, login, logout } = useContext(AuthContext);
    return (
        <div>
            <span data-testid="user">{user ? JSON.stringify(user) : "null"}</span>
            <button data-testid="login" onClick={() => login({ role: "User", token: "t1", username: "alice" })}>
                Login
            </button>
            <button data-testid="login-admin" onClick={() => login({ role: "Admin", token: "t2", username: "admin" })}>
                Login Admin
            </button>
            <button data-testid="logout" onClick={logout}>
                Logout
            </button>
        </div>
    );
};

const renderTest = () =>
    render(
        <AuthProvider>
            <TestComponent />
        </AuthProvider>
    );

describe("AuthContext", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("starts with null user", () => {
        renderTest();
        expect(screen.getByTestId("user").textContent).toBe("null");
    });

    it("restores user from localStorage on mount", () => {
        const storedUser = { role: "User", token: "abc", username: "bob" };
        localStorage.setItem("user", JSON.stringify(storedUser));
        renderTest();
        const parsed = JSON.parse(screen.getByTestId("user").textContent);
        expect(parsed.role).toBe("User");
        expect(parsed.username).toBe("bob");
    });

    it("login sets user and persists to localStorage", () => {
        renderTest();
        act(() => {
            screen.getByTestId("login").click();
        });
        const parsed = JSON.parse(screen.getByTestId("user").textContent);
        expect(parsed.role).toBe("User");
        expect(parsed.username).toBe("alice");
        expect(JSON.parse(localStorage.getItem("user")).username).toBe("alice");
    });

    it("login preserves only expected fields", () => {
        renderTest();
        act(() => {
            screen.getByTestId("login").click();
        });
        const parsed = JSON.parse(screen.getByTestId("user").textContent);
        expect(Object.keys(parsed).sort()).toEqual(["role", "token", "username"]);
    });

    it("logout clears user and localStorage", () => {
        renderTest();
        act(() => {
            screen.getByTestId("login").click();
        });
        expect(screen.getByTestId("user").textContent).not.toBe("null");
        act(() => {
            screen.getByTestId("logout").click();
        });
        expect(screen.getByTestId("user").textContent).toBe("null");
        expect(localStorage.getItem("user")).toBeNull();
    });

    it("can change from regular user to admin via login", () => {
        renderTest();
        act(() => {
            screen.getByTestId("login").click();
        });
        let parsed = JSON.parse(screen.getByTestId("user").textContent);
        expect(parsed.role).toBe("User");
        act(() => {
            screen.getByTestId("login-admin").click();
        });
        parsed = JSON.parse(screen.getByTestId("user").textContent);
        expect(parsed.role).toBe("Admin");
        expect(parsed.username).toBe("admin");
    });
});
