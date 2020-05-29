import { IvElement } from ".";
export interface ValueAdapter {
    value2data?: Function;
    data2value?: Function;
}
declare class Value {
    data: any;
    $targetElt: IvElement;
    events: string;
    adapter?: ValueAdapter;
    debounce: number;
}
export declare const value: import("./types").IvDecorator<Value>;
export declare class Debouncer {
    errContext: string;
    private timeoutId;
    duration: number;
    constructor(errContext?: string);
    process(cb: Function): void;
}
export {};
