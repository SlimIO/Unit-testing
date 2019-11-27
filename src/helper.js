"use strict";

// Symbols
const kCount = Symbol("kCount");
const kPlan = Symbol("kPlan");

class Helper {
    /**
     * @class Helper
     */
    constructor() {
        Object.defineProperty(this, kPlan, { value: 0, writable: true });
        Object.defineProperty(this, kCount, { value: 0, writable: true });
    }

    get hasExpectedPlanCount() {
        return this[kCount] === this[kPlan];
    }

    /**
     * @function plan
     * @memberof Helper#
     * @param {!number} count
     * @returns {void}
     */
    plan(count) {
        if (typeof count !== "number") {
            throw new TypeError("count must be a number");
        }

        this[kPlan] = count;
    }

    /**
     * @function pass
     * @memberof Helper#
     * @returns {void}
     */
    pass() {
        this[kCount]++;
    }
}

module.exports = Helper;
