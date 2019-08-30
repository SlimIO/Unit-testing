"use strict";

// Symbols
const kCount = Symbol("kCount");
const kPlan = Symbol("kPlan");

class Helper {
    constructor() {
        Object.defineProperty(this, kPlan, { value: 0, writable: true });
        Object.defineProperty(this, kCount, { value: 0, writable: true });
    }

    get count() {
        return this[kCount];
    }

    get hasExpectedCount() {
        return this.count === this.plan;
    }

    expect(count) {
        if (typeof count !== "number") {
            throw new TypeError("count must be a number");
        }

        this[kPlan] = count;
    }

    get plan() {
        return this[kPlan];
    }

    pass() {
        this[kCount]++;
    }
}

module.exports = Helper;
