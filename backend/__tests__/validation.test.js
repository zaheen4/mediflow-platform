const {
    requireFields,
    validateUsername,
    validatePassword,
    validateEmail,
    validateEquipmentData,
    validateOrderItems,
    validateOrderStatus,
} = require("../utils/validation");
const { ValidationError } = require("../utils/errors");

describe("requireFields", () => {
    it("passes when all fields are present", () => {
        expect(() => requireFields({ a: "x", b: 1 }, ["a", "b"])).not.toThrow();
    });

    it("throws for a missing field", () => {
        expect(() => requireFields({ a: "x" }, ["a", "b"])).toThrow(ValidationError);
    });

    it("throws for a null field", () => {
        expect(() => requireFields({ a: null }, ["a"])).toThrow(ValidationError);
    });

    it("throws for a blank string field", () => {
        expect(() => requireFields({ a: "   " }, ["a"])).toThrow(ValidationError);
    });
});

describe("validateUsername", () => {
    it("accepts a valid username", () => {
        expect(() => validateUsername("johndoe")).not.toThrow();
    });

    it("rejects a short username", () => {
        expect(() => validateUsername("ab")).toThrow(ValidationError);
    });

    it("rejects a long username", () => {
        expect(() => validateUsername("a".repeat(51))).toThrow(ValidationError);
    });

    it("rejects an empty username", () => {
        expect(() => validateUsername("")).toThrow(ValidationError);
    });
});

describe("validatePassword", () => {
    it("accepts a valid password", () => {
        expect(() => validatePassword("abcdef")).not.toThrow();
    });

    it("rejects a short password", () => {
        expect(() => validatePassword("12345")).toThrow(ValidationError);
    });

    it("rejects a missing password", () => {
        expect(() => validatePassword(null)).toThrow(ValidationError);
    });
});

describe("validateEmail", () => {
    it("accepts a valid email", () => {
        expect(() => validateEmail("a@b.co")).not.toThrow();
    });

    it("rejects an invalid email", () => {
        expect(() => validateEmail("not-an-email")).toThrow(ValidationError);
    });

    it("rejects an empty email", () => {
        expect(() => validateEmail("")).toThrow(ValidationError);
    });
});

describe("validateEquipmentData", () => {
    it("rejects a missing name on create", () => {
        expect(() => validateEquipmentData({ price: 10, quantity: 1 })).toThrow(ValidationError);
    });

    it("allows a missing name on update", () => {
        expect(() => validateEquipmentData({ price: 10 }, true)).not.toThrow();
    });

    it("rejects a name over 100 characters", () => {
        expect(() => validateEquipmentData({ name: "a".repeat(101) })).toThrow(ValidationError);
    });

    it("rejects a negative price", () => {
        expect(() => validateEquipmentData({ name: "x", price: -1 })).toThrow(ValidationError);
    });

    it("rejects a non-numeric price", () => {
        expect(() => validateEquipmentData({ name: "x", price: "abc" })).toThrow(ValidationError);
    });

    it("rejects a negative quantity", () => {
        expect(() => validateEquipmentData({ name: "x", quantity: -2 })).toThrow(ValidationError);
    });

    it("rejects a non-integer quantity", () => {
        expect(() => validateEquipmentData({ name: "x", quantity: "abc" })).toThrow(ValidationError);
    });

    it("accepts valid data", () => {
        expect(() => validateEquipmentData({ name: "Valid", price: 100, quantity: 5 })).not.toThrow();
    });
});

describe("validateOrderItems", () => {
    it("rejects a non-array", () => {
        expect(() => validateOrderItems("x")).toThrow(ValidationError);
    });

    it("rejects missing items", () => {
        expect(() => validateOrderItems()).toThrow(ValidationError);
    });

    it("rejects an empty array", () => {
        expect(() => validateOrderItems([])).toThrow(ValidationError);
    });

    it("rejects a missing equipment_id", () => {
        expect(() => validateOrderItems([{ quantity: 1 }])).toThrow(ValidationError);
    });

    it("rejects a zero quantity", () => {
        expect(() => validateOrderItems([{ equipment_id: 1, quantity: 0 }])).toThrow(ValidationError);
    });

    it("accepts valid items", () => {
        expect(() => validateOrderItems([{ equipment_id: 1, quantity: 2 }])).not.toThrow();
    });
});

describe("validateOrderStatus", () => {
    it("accepts each valid status", () => {
        for (const status of ["Pending", "Completed", "Cancelled"]) {
            expect(() => validateOrderStatus(status)).not.toThrow();
        }
    });

    it("rejects an invalid status", () => {
        expect(() => validateOrderStatus("Shipped")).toThrow(ValidationError);
    });

    it("rejects a missing status", () => {
        expect(() => validateOrderStatus()).toThrow(ValidationError);
    });
});
