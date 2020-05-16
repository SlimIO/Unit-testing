declare class Helper {
    readonly hasExpectedPlanCount: boolean;
    plan(count: number): void;
    pass(): void;
}

declare namespace Unit {
    type handler = (curr: Helper) => Promise<void> | void;

    export const after: handler;
    export const before: handler;
    export const maxThreadCount: number;
    export const timeout: number;

    interface Options {
        async?: boolean;
        timeout?: number;
    }
}

declare function Unit(title: string, handler: Unit.handler, options?: Unit.Options): void;

export = Unit;
export as namespace Unit;
