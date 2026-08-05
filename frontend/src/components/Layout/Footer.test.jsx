import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Footer from "./Footer";

describe("Footer", () => {
    it("renders brand and social links", () => {
        render(<Footer />);
        expect(screen.getByText(/MediFlow Co\./)).toBeInTheDocument();
        const links = screen.getAllByRole("link");
        expect(links.some((l) => l.getAttribute("href") === "https://twitter.com")).toBe(true);
        expect(links.some((l) => l.getAttribute("href") === "https://facebook.com")).toBe(true);
        expect(links.some((l) => l.getAttribute("href") === "https://github.com/zaheen4/mediflow-platform")).toBe(true);
    });
});
