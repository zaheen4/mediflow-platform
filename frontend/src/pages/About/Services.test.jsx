import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Services from "./Services";

describe("Services", () => {
    it("renders services, links and testimonials", () => {
        render(
            <MemoryRouter>
                <Services />
            </MemoryRouter>
        );
        expect(screen.getByText("Our Services")).toBeInTheDocument();
        expect(screen.getByText("Equipment Sales")).toBeInTheDocument();
        expect(screen.getByText("Equipment Rental")).toBeInTheDocument();
        expect(screen.getByText("Maintenance & Repair")).toBeInTheDocument();
        expect(screen.getByText("Consulting")).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /Learn More/ })).toHaveAttribute("href", "/buy-equipment");
        expect(screen.getByText("What Our Clients Say")).toBeInTheDocument();
        expect(screen.getByText(/MediFlow provided us with the best medical equipment/)).toBeInTheDocument();
    });

    it("marks services without links as Coming Soon", () => {
        render(
            <MemoryRouter>
                <Services />
            </MemoryRouter>
        );
        expect(screen.getAllByText("Coming Soon")).toHaveLength(3);
    });
});
