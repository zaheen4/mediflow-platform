import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import RouteErrorBoundary from "./RouteErrorBoundary";

const Boom = () => {
    throw new Error("route boom");
};

describe("RouteErrorBoundary", () => {
    it("renders children when there is no error", () => {
        render(
            <RouteErrorBoundary name="Test">
                <div>Safe Content</div>
            </RouteErrorBoundary>
        );
        expect(screen.getByText("Safe Content")).toBeInTheDocument();
    });

    it("renders the fallback UI when a child throws", () => {
        vi.spyOn(console, "error").mockImplementation(() => {});
        render(
            <MemoryRouter>
                <RouteErrorBoundary name="Test">
                    <Boom />
                </RouteErrorBoundary>
            </MemoryRouter>
        );
        expect(screen.getByText("Page Error")).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Go Home" })).toHaveAttribute("href", "/");
    });
});
