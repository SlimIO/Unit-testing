"use strict";

// Require Node.js Dependencies
const { performance } = require("perf_hooks");

// Require Third-party Dependencies
const is = require("@slimio/is");
const prettyStack = require("@slimio/pretty-stack");
const { gray, white, green, red, yellow, bgGreen, bgRed } = require("kleur");

// Vars
const store = [];

// Execute at the next loop iteration
setImmediate(async() => {
    console.log("");
    let passed = 0;
    const start = performance.now();
    const errors = [];

    // Execute registered tests
    for (const { title, handler } of store) {
        const handlerStart = performance.now();
        try {
            if (is.asyncFunction(handler)) {
                await handler();
            }
            else {
                handler();
            }
            const executionTimeMs = (performance.now() - handlerStart).toFixed(2);
            passed++;
            console.log(`${green("✓")} ${gray(title)} ${white().bold(`(${executionTimeMs}ms)`)}`);
        }
        catch (error) {
            const executionTimeMs = (performance.now() - handlerStart).toFixed(2);
            console.log(`${red("✖")} ${red(title)} ${white().bold(`(${executionTimeMs}ms)`)}`);
            errors.push({ title, error });
        }
    }

    // Print informations about tests execution
    const executionTimeMs = (performance.now() - start).toFixed(2);
    const hasError = errors.length > 0;
    const bgColor = hasError ? bgRed : bgGreen;
    console.log(`\n${bgColor(white().bold(hasError ? " FAILED " : " SUCCESS "))}\n`);
    console.log(white().bold(`Total:     ${yellow().bold(store.length)}`));
    if (hasError) {
        console.log(white().bold(`Failed:    ${yellow().bold(errors.length)}`));
    }
    console.log(white().bold(`Passed:    ${yellow().bold(passed)}`));
    console.log(white().bold(`Duration:  ${yellow().bold(executionTimeMs)}ms`));

    // Print errors (if there is)
    if (hasError) {
        for (const { title, error } of errors) {
            console.log(gray().bold("\n ----------------------------------\n"));
            console.log(` ${red("✖")} ${red(title)}`);
            prettyStack(error);
        }
    }
});

/**
 * @function Unit
 * @param {!string} title
 * @param {*} handler
 * @returns {void}
 */
function Unit(title, handler) {
    if (typeof title !== "string") {
        throw new TypeError("title must be a string");
    }
    store.push({ title, handler });
}

module.exports = Unit;
