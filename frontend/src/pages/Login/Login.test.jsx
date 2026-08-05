import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";
import { AuthContext } from "../../context/AuthContext";

vi.mock("sonner", () => ({
    toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() },
}));

const mockApi = vi.hoisted(() => ({ post: vi.fn() }));

vi.mock("../../services/api", () => ({ default: mockApi }));

const renderLogin = (login = vi.fn()) =>
    render(
        <AuthContext.Provider value={{ login }}>
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        </AuthContext.Provider>
    );

const toggleButton = () => screen.getAllByRole("button").find((b) => b.getAttribute("type") === "button");

describe("Login", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders the login form", () => {
        renderLogin();
        expect(screen.getByPlaceholderText("Username or Email")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
    });

    it("shows error when username is missing", () => {
        renderLogin();
        fireEvent.submit(screen.getByRole("button", { name: "Login" }).closest("form"));
        expect(screen.getByText("Username or email is required")).toBeInTheDocument();
        expect(mockApi.post).not.toHaveBeenCalled();
    });

    it("shows error when password is missing", async () => {
        const user = userEvent.setup();
        renderLogin();
        await user.type(screen.getByPlaceholderText("Username or Email"), "alice");
        fireEvent.submit(screen.getByRole("button", { name: "Login" }).closest("form"));
        expect(screen.getByText("Password is required")).toBeInTheDocument();
        expect(mockApi.post).not.toHaveBeenCalled();
    });

    it("logs in and navigates home on success", async () => {
        const user = userEvent.setup();
        const login = vi.fn();
        mockApi.post.mockResolvedValue({
            data: { role: "User", token: "t1", username: "alice", email: "alice@x.com" },
        });
        renderLogin(login);
        await user.type(screen.getByPlaceholderText("Username or Email"), "alice");
        await user.type(screen.getByPlaceholderText("Password"), "secret123");
        await user.click(screen.getByRole("button", { name: "Login" }));
        await waitFor(() => expect(login).toHaveBeenCalled());
        expect(mockApi.post).toHaveBeenCalledWith("/login", { username: "alice", password: "secret123" });
    });

    it("shows server error on failed login", async () => {
        const user = userEvent.setup();
        mockApi.post.mockRejectedValue({ response: { data: { error: "Invalid credentials" } } });
        renderLogin();
        await user.type(screen.getByPlaceholderText("Username or Email"), "alice");
        await user.type(screen.getByPlaceholderText("Password"), "wrong");
        await user.click(screen.getByRole("button", { name: "Login" }));
        await waitFor(() => expect(screen.getByText("Invalid credentials")).toBeInTheDocument());
    });

    it("shows network error when request fails", async () => {
        const user = userEvent.setup();
        mockApi.post.mockRejectedValue(new Error("Network failure"));
        renderLogin();
        await user.type(screen.getByPlaceholderText("Username or Email"), "alice");
        await user.type(screen.getByPlaceholderText("Password"), "wrong");
        await user.click(screen.getByRole("button", { name: "Login" }));
        await waitFor(() => expect(screen.getByText("Network error")).toBeInTheDocument());
    });

    it("toggles password visibility", async () => {
        const user = userEvent.setup();
        renderLogin();
        const passwordInput = screen.getByPlaceholderText("Password");
        expect(passwordInput).toHaveAttribute("type", "password");
        await user.click(toggleButton());
        expect(passwordInput).toHaveAttribute("type", "text");
        await user.click(toggleButton());
        expect(passwordInput).toHaveAttribute("type", "password");
    });
});
