import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import HomeLayout from "./HomeLayout";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";

const renderLayout = () =>
    render(
        <AuthContext.Provider value={{ user: null, logout: vi.fn() }}>
            <CartContext.Provider value={{ getTotalItems: () => 0 }}>
                <MemoryRouter initialEntries={["/"]}>
                    <Routes>
                        <Route element={<HomeLayout />}>
                            <Route path="/" element={<div>Child Content</div>} />
                        </Route>
                    </Routes>
                </MemoryRouter>
            </CartContext.Provider>
        </AuthContext.Provider>
    );

describe("HomeLayout", () => {
    it("renders navbar, outlet content and footer", () => {
        renderLayout();
        expect(screen.getByRole("link", { name: "MediFlow" })).toBeInTheDocument();
        expect(screen.getByText("Child Content")).toBeInTheDocument();
        expect(screen.getByText(/MediFlow Co\./)).toBeInTheDocument();
    });
});
