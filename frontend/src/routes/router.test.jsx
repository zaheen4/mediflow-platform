import { describe, it, expect } from "vitest";
import { router } from "./router";

describe("router", () => {
    it("defines the expected routes under the home layout", () => {
        const children = router.routes[0].children;
        expect(children.map((r) => r.path)).toEqual([
            "/",
            "/login",
            "/register",
            "/buy-equipment",
            "/equipment/:id",
            "/cart",
            "/checkout",
            "/orders",
            "/profile",
            "/admin-dashboard",
            "/about",
            "/services",
            "*",
        ]);
    });

    it("wraps every element in a route error boundary", () => {
        const children = router.routes[0].children;
        for (const route of children) {
            expect(route.element).toBeTruthy();
        }
    });
});
