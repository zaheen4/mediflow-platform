import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { describe, it, expect } from "vitest";
import ProtectedRoute from "./ProtectedRoute";
import { AuthContext } from "../context/AuthContext";

const LoginStub = () => <div>Login Page</div>;
const HomeStub = () => <div>Home Page</div>;

const renderWithAuth = (user, adminOnly = false) => {
    return render(
        <MemoryRouter initialEntries={["/protected"]}>
            <Routes>
                <Route
                    path="/protected"
                    element={
                        <AuthContext.Provider value={{ user }}>
                            <ProtectedRoute adminOnly={adminOnly}>
                                <div>Protected Content</div>
                            </ProtectedRoute>
                        </AuthContext.Provider>
                    }
                />
                <Route path="/login" element={<LoginStub />} />
                <Route path="/" element={<HomeStub />} />
            </Routes>
        </MemoryRouter>
    );
};

describe("ProtectedRoute", () => {
    it("renders children when user is authenticated", () => {
        renderWithAuth({ role: "User", username: "testuser", token: "abc" });
        expect(screen.getByText("Protected Content")).toBeInTheDocument();
    });

    it("redirects to /login when user is not authenticated", () => {
        renderWithAuth(null);
        expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
        expect(screen.getByText("Login Page")).toBeInTheDocument();
    });

    it("renders children for admin user with adminOnly", () => {
        renderWithAuth({ role: "Admin", username: "admin", token: "xyz" }, true);
        expect(screen.getByText("Protected Content")).toBeInTheDocument();
    });

    it("redirects to / for non-admin user with adminOnly", () => {
        renderWithAuth({ role: "User", username: "testuser", token: "abc" }, true);
        expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
        expect(screen.getByText("Home Page")).toBeInTheDocument();
    });
});
