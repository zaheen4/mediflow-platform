import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import WelcomePage from "./WelcomePage";

describe("WelcomePage", () => {
    it("renders the hero heading and description", () => {
        render(<WelcomePage />);
        expect(screen.getByText("Welcome to MediFlow")).toBeInTheDocument();
        expect(screen.getByText(/Your trusted partner in medical equipment solutions/)).toBeInTheDocument();
        expect(screen.getByText(/Whether you're looking to equip your clinic/)).toBeInTheDocument();
    });
});
