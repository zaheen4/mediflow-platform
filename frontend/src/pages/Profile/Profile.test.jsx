import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Profile from "./Profile";
import { AuthContext } from "../../context/AuthContext";

vi.mock("sonner", () => ({
    toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() },
}));

const mockApi = vi.hoisted(() => ({ get: vi.fn(), put: vi.fn() }));

vi.mock("../../services/api", () => ({ default: mockApi }));

const user = { role: "User", username: "alice", email: "alice@example.com", token: "t1" };

const renderProfile = (login = vi.fn()) =>
    render(
        <AuthContext.Provider value={{ user, login }}>
            <Profile />
        </AuthContext.Provider>
    );

const getPasswordInputs = (container) => container.querySelectorAll('input[type="password"]');

describe("Profile", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("shows a spinner while loading the profile", () => {
        mockApi.get.mockReturnValue(new Promise(() => {}));
        renderProfile();
        expect(document.querySelector(".loading-spinner")).toBeTruthy();
    });

    it("loads profile data and shows account fields", async () => {
        mockApi.get.mockResolvedValue({ data: { username: "alice", email: "alice@example.com" } });
        renderProfile();
        expect(await screen.findByText("My Profile")).toBeInTheDocument();
        expect(screen.getByDisplayValue("alice")).toBeInTheDocument();
        expect(screen.getByDisplayValue("alice@example.com")).toBeInTheDocument();
        expect(screen.getByDisplayValue("User")).toBeDisabled();
    });

    it("shows an error toast when loading the profile fails", async () => {
        mockApi.get.mockRejectedValue(new Error("Network"));
        const { toast } = await import("sonner");
        renderProfile();
        await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Failed to load profile"));
    });

    it("rejects an invalid username on save", async () => {
        const user = userEvent.setup();
        mockApi.get.mockResolvedValue({ data: { username: "alice", email: "alice@example.com" } });
        const { toast } = await import("sonner");
        renderProfile();
        await screen.findByText("My Profile");
        const usernameInput = screen.getByDisplayValue("alice");
        await user.clear(usernameInput);
        await user.type(usernameInput, "ab");
        await user.click(screen.getByRole("button", { name: /Save Profile/ }));
        await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Username must be between 3 and 50 characters"));
        expect(mockApi.put).not.toHaveBeenCalled();
    });

    it("rejects an invalid email on save", async () => {
        const user = userEvent.setup();
        mockApi.get.mockResolvedValue({ data: { username: "alice", email: "alice@example.com" } });
        const { toast } = await import("sonner");
        renderProfile();
        await screen.findByText("My Profile");
        const emailInput = screen.getByDisplayValue("alice@example.com");
        await user.clear(emailInput);
        await user.type(emailInput, "not-an-email");
        fireEvent.submit(screen.getByRole("button", { name: /Save Profile/ }).closest("form"));
        await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Invalid email format"));
        expect(mockApi.put).not.toHaveBeenCalled();
    });

    it("saves the profile and updates the user", async () => {
        const user = userEvent.setup();
        const login = vi.fn();
        mockApi.get.mockResolvedValue({ data: { username: "alice", email: "alice@example.com" } });
        mockApi.put.mockResolvedValue({ data: { username: "alice", email: "alice@example.com" } });
        renderProfile(login);
        await screen.findByText("My Profile");
        await user.click(screen.getByRole("button", { name: /Save Profile/ }));
        await waitFor(() =>
            expect(mockApi.put).toHaveBeenCalledWith("/users/me", {
                username: "alice",
                email: "alice@example.com",
            })
        );
        await waitFor(() => expect(login).toHaveBeenCalled());
    });

    it("rejects a short new password", async () => {
        const user = userEvent.setup();
        const { container } = renderProfile();
        mockApi.get.mockResolvedValue({ data: { username: "alice", email: "alice@example.com" } });
        const { toast } = await import("sonner");
        await screen.findByText("My Profile");
        const [current, newPassword, confirm] = getPasswordInputs(container);
        await user.type(current, "oldpass");
        await user.type(newPassword, "123");
        await user.type(confirm, "123");
        const passwordForm = screen.getByRole("button", { name: "Change Password" }).closest("form");
        fireEvent.submit(passwordForm);
        await waitFor(() => expect(toast.error).toHaveBeenCalledWith("New password must be at least 6 characters"));
    });

    it("rejects mismatched passwords", async () => {
        const user = userEvent.setup();
        const { container } = renderProfile();
        mockApi.get.mockResolvedValue({ data: { username: "alice", email: "alice@example.com" } });
        const { toast } = await import("sonner");
        await screen.findByText("My Profile");
        const [current, newPassword, confirm] = getPasswordInputs(container);
        await user.type(current, "oldpass");
        await user.type(newPassword, "newpass1");
        await user.type(confirm, "newpass2");
        const passwordForm = screen.getByRole("button", { name: "Change Password" }).closest("form");
        fireEvent.submit(passwordForm);
        await waitFor(() => expect(toast.error).toHaveBeenCalledWith("New passwords do not match"));
    });

    it("changes the password successfully", async () => {
        const user = userEvent.setup();
        const { container } = renderProfile();
        mockApi.get.mockResolvedValue({ data: { username: "alice", email: "alice@example.com" } });
        mockApi.put.mockResolvedValue({ data: {} });
        const { toast } = await import("sonner");
        await screen.findByText("My Profile");
        const [current, newPassword, confirm] = getPasswordInputs(container);
        await user.type(current, "oldpass");
        await user.type(newPassword, "newpass1");
        await user.type(confirm, "newpass1");
        const passwordForm = screen.getByRole("button", { name: "Change Password" }).closest("form");
        fireEvent.submit(passwordForm);
        await waitFor(() =>
            expect(mockApi.put).toHaveBeenCalledWith("/change-password", {
                currentPassword: "oldpass",
                newPassword: "newpass1",
            })
        );
        await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Password changed successfully"));
    });

    it("shows an error toast when changing the password fails", async () => {
        const user = userEvent.setup();
        const { container } = renderProfile();
        mockApi.get.mockResolvedValue({ data: { username: "alice", email: "alice@example.com" } });
        mockApi.put.mockRejectedValue({ response: { data: { error: "Current password is wrong" } } });
        const { toast } = await import("sonner");
        await screen.findByText("My Profile");
        const [current, newPassword, confirm] = getPasswordInputs(container);
        await user.type(current, "wrong");
        await user.type(newPassword, "newpass1");
        await user.type(confirm, "newpass1");
        const passwordForm = screen.getByRole("button", { name: "Change Password" }).closest("form");
        fireEvent.submit(passwordForm);
        await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Current password is wrong"));
    });
});
