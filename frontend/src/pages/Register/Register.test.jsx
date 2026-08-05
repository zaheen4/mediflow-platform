import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Register from "./Register";

vi.mock("sonner", () => ({
    toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() },
}));

const mockApi = vi.hoisted(() => ({ post: vi.fn() }));

vi.mock("../../services/api", () => ({ default: mockApi }));

const renderRegister = () =>
    render(
        <MemoryRouter>
            <Register />
        </MemoryRouter>
    );

const fillForm = async (user, { username = "alice", email = "alice@example.com", password = "secret123" } = {}) => {
    await user.type(screen.getByLabelText("Username"), username);
    await user.type(screen.getByLabelText("Email"), email);
    await user.type(screen.getByLabelText("Password"), password);
};

describe("Register", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders the registration form", () => {
        renderRegister();
        expect(screen.getByLabelText("Username")).toBeInTheDocument();
        expect(screen.getByLabelText("Email")).toBeInTheDocument();
        expect(screen.getByLabelText("Password")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Register" })).toBeInTheDocument();
    });

    it("rejects a username shorter than 3 characters", async () => {
        const user = userEvent.setup();
        renderRegister();
        await fillForm(user, { username: "ab" });
        await user.click(screen.getByRole("button", { name: "Register" }));
        expect(screen.getByText("Username must be between 3 and 50 characters")).toBeInTheDocument();
        expect(mockApi.post).not.toHaveBeenCalled();
    });

    it("rejects a short password", async () => {
        const user = userEvent.setup();
        renderRegister();
        await fillForm(user, { password: "12345" });
        await user.click(screen.getByRole("button", { name: "Register" }));
        expect(screen.getByText("Password must be at least 6 characters")).toBeInTheDocument();
        expect(mockApi.post).not.toHaveBeenCalled();
    });

    it("rejects an invalid email", async () => {
        const user = userEvent.setup();
        renderRegister();
        await fillForm(user, { email: "not-an-email" });
        fireEvent.submit(screen.getByRole("button", { name: "Register" }).closest("form"));
        expect(screen.getByText("Please enter a valid email address")).toBeInTheDocument();
        expect(mockApi.post).not.toHaveBeenCalled();
    });

    it("registers successfully and shows success message", async () => {
        const user = userEvent.setup();
        mockApi.post.mockResolvedValue({ data: { message: "Registration Successful!" } });
        renderRegister();
        await fillForm(user);
        await user.click(screen.getByRole("button", { name: "Register" }));
        expect(await screen.findByText("Registration Successful!")).toBeInTheDocument();
        expect(mockApi.post).toHaveBeenCalledWith("/register", {
            username: "alice",
            email: "alice@example.com",
            password: "secret123",
        });
    });

    it("shows server error message on failure", async () => {
        const user = userEvent.setup();
        mockApi.post.mockRejectedValue({ response: { data: { error: "Username already taken" } } });
        renderRegister();
        await fillForm(user);
        await user.click(screen.getByRole("button", { name: "Register" }));
        expect(await screen.findByText("Username already taken")).toBeInTheDocument();
    });

    it("shows generic error when request fails without a response", async () => {
        const user = userEvent.setup();
        mockApi.post.mockRejectedValue(new Error("Network failure"));
        renderRegister();
        await fillForm(user);
        await user.click(screen.getByRole("button", { name: "Register" }));
        expect(await screen.findByText("An error occurred!")).toBeInTheDocument();
    });
});
