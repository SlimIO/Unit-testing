/* eslint-disable lines-between-class-members */

// Require Node.js Dependencies
import events from "events";

export default class Helper extends events {
    #planned = 0;
    #count = 0;
    #finished = false;

    constructor() {
        super();
        this.once("terminated", () => {
            this.#finished = true;
        });
    }

    get hasExpectedPlanCount() {
        return this.#count === this.#planned;
    }

    plan(count) {
        if (typeof count !== "number") {
            throw new TypeError("count must be a number");
        }

        this.#planned = count;
    }

    succeed() {
        if (!this.#finished) {
            this.emit("terminated", null);
        }
    }

    fail(error) {
        if (!this.#finished) {
            this.emit("terminated", error);
        }
    }

    pass() {
        this.#count++;
    }
}
