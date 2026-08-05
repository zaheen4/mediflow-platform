import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";

vi.mock("sonner", () => ({
    toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() },
}));

const renderNav = (user, logout = vi.fn(), getTotalItems = () => 0) =>
    render(
        <AuthContext.Provider value={{ user, logout }}>
            <CartContext.Provider value={{ getTotalItems }}>
                <MemoryRouter initialEntries={["/"]}>
                    <Routes>
                        <Route path="/" element={<Navbar />} />
                        <Route path="/login" element={<div>Login Page</div>} />
                    </Routes>
                </MemoryRouter>
            </CartContext.Provider>
        </AuthContext.Provider>
    );

describe("Navbar", () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it("shows login and register links for guests", () => {
        renderNav(null);
        expect(screen.getByRole("link", { name: "LOGIN" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "REGISTER" })).toBeInTheDocument();
        expect(screen.getAllByRole("link", { name: "Home" }).length).toBeGreaterThan(0);
        expect(screen.getAllByRole("link", { name: "About" }).length).toBeGreaterThan(0);
        expect(screen.queryAllByRole("link", { name: "Shop" })).toHaveLength(0);
        expect(screen.queryAllByRole("link", { name: "Dashboard" })).toHaveLength(0);
    });

    it("shows Shop link for regular users", () => {
        renderNav({ role: "User", username: "alice", token: "t" });
        expect(screen.getAllByRole("link", { name: "Shop" }).length).toBeGreaterThan(0);
        expect(screen.queryAllByRole("link", { name: "Dashboard" })).toHaveLength(0);
    });

    it("shows Dashboard link for admins", () => {
        renderNav({ role: "Admin", username: "root", token: "t" });
        expect(screen.getAllByRole("link", { name: "Dashboard" }).length).toBeGreaterThan(0);
    });

    it("shows cart badge with item count for users", () => {
        renderNav({ role: "User", username: "alice", token: "t" }, vi.fn(), () => 3);
        expect(screen.getByRole("link", { name: "Shopping cart with 3 items" })).toBeInTheDocument();
        expect(screen.getByText("3")).toBeInTheDocument();
    });

    it("logs out and navigates to login", async () => {
        const user = userEvent.setup();
        const logout = vi.fn();
        renderNav({ role: "User", username: "alice", token: "t" }, logout);
        await user.click(screen.getByRole("button", { name: "Logout" }));
        expect(logout).toHaveBeenCalled();
        expect(await screen.findByText("Login Page")).toBeInTheDocument();
    });

    it("toggles the theme and updates the document", async () => {
        const user = userEvent.setup();
        renderNav(null);
        expect(document.documentElement.getAttribute("data-theme")).toBe("light");
        await user.click(screen.getByRole("button", { name: "Toggle theme" }));
        expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
        expect(localStorage.getItem("theme")).toBe("dark");
    });
});
