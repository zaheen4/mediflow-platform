import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import About from "./About";

describe("About", () => {
    it("renders the headline and team section", () => {
        render(<About />);
        expect(screen.getByText(/MediFlow offers you the best medical equipment/)).toBeInTheDocument();
        expect(screen.getByText("Meet Our Team")).toBeInTheDocument();
        expect(screen.getByText("Mir Zaheen Waseet")).toBeInTheDocument();
        expect(screen.getByText("Muntasir Noor Tazim")).toBeInTheDocument();
        expect(screen.getByText("Mohammed Arafath Rahman")).toBeInTheDocument();
    });
});
