import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SkeletonCard, SkeletonTable, SkeletonOrderCard } from "./Skeleton";

describe("Skeleton components", () => {
    it("SkeletonCard renders the requested number of cards", () => {
        const { container } = render(<SkeletonCard count={3} />);
        expect(container.querySelectorAll(".card").length).toBe(3);
    });

    it("SkeletonCard uses the default count when not provided", () => {
        const { container } = render(<SkeletonCard />);
        expect(container.querySelectorAll(".card").length).toBe(6);
    });

    it("SkeletonTable renders rows and columns", () => {
        const { container } = render(<SkeletonTable rows={4} cols={3} />);
        expect(container.querySelectorAll(".skeleton").length).toBe(12);
    });

    it("SkeletonOrderCard renders the requested number of cards", () => {
        const { container } = render(<SkeletonOrderCard count={2} />);
        expect(container.querySelectorAll(".card").length).toBe(2);
    });
});
