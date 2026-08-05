import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import NotFound from "./NotFound";

describe("NotFound", () => {
    it("renders 404 message and home link", () => {
        render(
            <MemoryRouter>
                <NotFound />
            </MemoryRouter>
        );
        expect(screen.getByText("404")).toBeInTheDocument();
        expect(screen.getByText("Page Not Found")).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Go Home" })).toHaveAttribute("href", "/");
    });
});
