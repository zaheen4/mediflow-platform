import { describe, it, expect, vi } from "vitest";
import api, { setUnauthorizedHandler } from "./api";

describe("api service", () => {
    it("adds an Authorization header when a user token is stored", async () => {
        localStorage.setItem("user", JSON.stringify({ token: "abc123" }));
        const config = { headers: {} };
        const result = await api.interceptors.request.handlers[0].fulfilled(config);
        expect(result.headers.Authorization).toBe("Bearer abc123");
    });

    it("does not add an Authorization header when no user is stored", async () => {
        localStorage.clear();
        const config = { headers: {} };
        const result = await api.interceptors.request.handlers[0].fulfilled(config);
        expect(result.headers.Authorization).toBeUndefined();
    });

    it("does not add an Authorization header when stored user has no token", async () => {
        localStorage.setItem("user", JSON.stringify({ username: "alice" }));
        const config = { headers: {} };
        const result = await api.interceptors.request.handlers[0].fulfilled(config);
        expect(result.headers.Authorization).toBeUndefined();
    });

    it("survives invalid JSON in localStorage", async () => {
        localStorage.setItem("user", "{not-json");
        const config = { headers: {} };
        const result = await api.interceptors.request.handlers[0].fulfilled(config);
        expect(result.headers.Authorization).toBeUndefined();
    });

    it("calls the unauthorized handler on 401 responses", () => {
        const handler = vi.fn();
        setUnauthorizedHandler(handler);
        const error = { response: { status: 401 } };
        const result = api.interceptors.response.handlers[0].rejected(error);
        expect(handler).toHaveBeenCalledTimes(1);
        return expect(result).rejects.toBe(error);
    });

    it("does not call the handler for non-401 responses", () => {
        const handler = vi.fn();
        setUnauthorizedHandler(handler);
        const error = { response: { status: 500 } };
        const result = api.interceptors.response.handlers[0].rejected(error);
        expect(handler).not.toHaveBeenCalled();
        return expect(result).rejects.toBe(error);
    });
});
