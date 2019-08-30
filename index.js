"use strict";

// Require Node.js Dependencies
const { performance } = require("perf_hooks");

// Require Third-party Dependencies
const is = require("@slimio/is");
const prettyStack = require("@slimio/pretty-stack");
const { gray, white, green, red, yellow, bgGreen, bgRed } = require("kleur");

// Require Internal Dependencies
const Helper = require("./src/helper");

// Vars
const store = [];

/**
 * @async
 * @function executeHandler
 * @param {!string} title
 * @param {() => any} handler
 * @returns {Error | null}
 */
async function executeHandler(title, handler) {
    const handlerStart = performance.now();
    const help = new Helper();

    try {
        if (is.asyncFunction(handler)) {
            await handler(help);
        }
        else {
            handler(help);
        }
        if (help.hasExpectedCount === false) {
            throw new Error(`expected '${help.plan}' assertions but got '${help.count}'`);
        }

        const executionTimeMs = (performance.now() - handlerStart).toFixed(2);
        console.log(`${green("✓")} ${gray(title)} ${white().bold(`(${executionTimeMs}ms)`)}`);

        return null;
    }
    catch (error) {
        const executionTimeMs = (performance.now() - handlerStart).toFixed(2);
        console.log(`${red("✖")} ${red(title)} ${white().bold(`(${executionTimeMs}ms)`)}`);

        return error;
    }
}

// Execute at the next loop iteration
setImmediate(async() => {
    console.log("");
    let passed = 0;
    const start = performance.now();
    const errors = [];

    // Execute before is present
    if (is.func(Unit.before)) {
        const error = await executeHandler("before", Unit.before);
        if (error === null) {
            passed++;
        }
        else {
            console.error(error);
            process.exit(0);
        }
    }

    // Execute registered tests
    for (const { title, handler } of store) {
        const error = await executeHandler(title, handler);
        if (error === null) {
            passed++;
        }
        else {
            errors.push({ title, error });
        }
    }

    // Execute before is present
    if (is.func(Unit.after)) {
        const error = await executeHandler("after", Unit.after);
        if (error === null) {
            passed++;
        }
        else {
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
            try {
                prettyStack(error);
            }
            catch (error) {
                console.log(error);
            }
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
