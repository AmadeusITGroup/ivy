export declare class IvEvent {
    private _type;
    private _target;
    private _cancelable;
    private _defaultPrevented;
    private _immediatePropagationStopped;
    data: any | null;
    constructor(type: string, target: string, cancelable: boolean, data?: any);
    readonly type: string;
    readonly target: any;
    readonly cancelable: boolean;
    readonly defaultPrevented: boolean;
    readonly immediatePropagationStopped: boolean;
    preventDefault(): void;
    stopImmediatePropagation(): void;
}
declare class IvEventEmitterBase {
    protected _cancelableEvents: boolean;
    private _target;
    private _eventType;
    private _listeners;
    init(eventType: string, target: any): void;
    readonly listenerCount: number;
    addListener(listener: (event: IvEvent) => void): ((event: IvEvent) => void);
    removeListener(listener: (event: IvEvent) => void): void;
    removeAllListeners(): void;
    emit(data?: any): boolean;
}
export declare class IvEventEmitter extends IvEventEmitterBase {
}
export declare class IvCancelableEventEmitter extends IvEventEmitterBase {
    constructor();
}
export {};
