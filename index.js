// Require Node.js Dependencies
import { performance } from "perf_hooks";

// Require Third-party Dependencies
import is from "@slimio/is";
import prettyStack from "@slimio/pretty-stack";
import kleur from "kleur";
import ms from "ms";

// Require Internal Dependencies
import Helper from "./src/helper.js";

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
        if (help.hasExpectedPlanCount === false) {
            throw new Error(`expected '${help.plan}' assertions but got '${help.count}'`);
        }

        const executionTimeMs = ms(Number((performance.now() - handlerStart).toFixed(2)));
        console.log(`${kleur.green("✓")} ${kleur.gray(title)} ${kleur.white().bold(`(${executionTimeMs})`)}`);

        return null;
    }
    catch (error) {
        const executionTimeMs = ms(Number((performance.now() - handlerStart).toFixed(2)));
        console.log(`${kleur.red("✖")} ${kleur.red(title)} ${kleur.white().bold(`(${executionTimeMs})`)}`);

        return error;
    }
}

// Execute at the next loop iteration
setImmediate(async() => {
    console.log("");
    let passed = 0;
    const start = performance.now();
    const errors = [];
    const toAsync = store.filter((row) => row.async);
    const maxThreadCount = Unit.maxThreadCount || (toAsync.length < 3 ? toAsync.length : 3);
    console.log(maxThreadCount);

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
    for (const { title, handler, async } of store) {
        if (async) {
            continue;
        }

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
    const executionTimeMs = ms(Number((performance.now() - start).toFixed(2)));
    const hasError = errors.length > 0;
    const bgColor = hasError ? kleur.bgRed : kleur.bgGreen;
    console.log(`\n${bgColor(kleur.white().bold(hasError ? " FAILED " : " SUCCESS "))}\n`);
    console.log(kleur.white().bold(`Total:     ${kleur.yellow().bold(store.length)}`));
    if (hasError) {
        console.log(kleur.white().bold(`Failed:    ${kleur.yellow().bold(errors.length)}`));
    }
    console.log(kleur.white().bold(`Passed:    ${kleur.yellow().bold(passed)}`));
    console.log(kleur.white().bold(`Duration:  ${kleur.yellow().bold(executionTimeMs)}`));

    // Print errors (if there is)
    if (hasError) {
        for (const { title, error = null } of errors) {
            console.log(kleur.gray().bold("\n ----------------------------------\n"));
            console.log(` ${kleur.red("✖")} ${kleur.red(title)}`);
            if (error !== null) {
                prettyStack(error);
            }
        }
    }
});

/**
 * @function Unit
 * @param {!string} title
 * @param {*} handler
 * @param {*} options
 * @returns {void}
 */
export default function Unit(title, handler, options = Object.create(null)) {
    if (typeof title !== "string") {
        throw new TypeError("title must be a string");
    }
    const { timeout = Infinity, async = false } = options;

    store.push({ title, handler, timeout, async });
}
