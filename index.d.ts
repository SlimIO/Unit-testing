declare class Helper {
    readonly hasExpectedPlanCount: boolean;
    plan(count: number): void;
    pass(): void;
}

declare namespace Unit {
    type handler = (curr: Helper) => Promise<void> | void;

    export const after: handler;
    export const before: handler;
}

declare function Unit(title: string, handler: Unit.handler): void;

export = Unit;
export as namespace Unit;
