export default class Helper {
    #planned = 0;
    #count = 0;

    get hasExpectedPlanCount() {
        return this.#count === this.#planned;
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

        this.#planned = count;
    }

    /**
     * @function pass
     * @memberof Helper#
     * @returns {void}
     */
    pass() {
        this.#count++;
    }
}
