export interface TraxObject {
    ΔTrackable: true;
    ΔChangeVersion: number;
    ΔMd?: TraxMetaData;
    ΔComputeDependencies?: {
        [propName: string]: boolean;
    };
}
export interface TraxMetaData {
    parents: FlexArray<TraxObject>;
    refreshCtxt?: RefreshContext;
    watchers?: FlexArray<WatchFunction>;
    trackers?: FlexArray<TrackFunction>;
}
export interface Constructor<T> {
    ΔFactory?: Factory<T>;
    new (...args: any[]): T;
}
export interface Factory<T> {
    ΔIsFactory: true;
    ΔCreateProxy?: (v: any) => TraxObject | null;
    (): T;
}
declare type FlexArray<T> = T | T[] | undefined;
/**
 * Data object decorator
 */
export declare function Data(c: any): void;
export declare const ref: {
    (proto: any, key: string): void;
    depth: (depth: number) => (proto: any, key: string) => void;
};
/**
 * Decorator to express properties calculated from other properties
 * @param proto
 * @param propName
 * @param descriptor
 */
export declare function computed(proto: any, propName: string, descriptor: PropertyDescriptor): void;
export declare function version(o: any): number;
export declare function dispose(traxObject: any, recursive?: boolean): void;
export declare function forEachProperty(traxObject: any, processor: (propName: string, internalValue: any, factory: Factory<any>) => void): void;
export declare function hasProperty(traxObject: any, propName: string): boolean;
export declare function hasParents(traxObject: any): boolean;
export declare function getParents(traxObject: any): any[] | null;
export declare function isDataObject(o: any): boolean;
export declare function isMutating(o: any): boolean;
/**
 * Return a promise that will be resolved when the current context has refreshed
 */
export declare function changeComplete(o: any): Promise<void>;
export declare function commitChanges(o: any, forceNewRefreshContext?: boolean): void;
declare type WatchFunction = (o: TraxObject) => void;
declare type TrackFunction = (o: TraxObject, operation: string, property?: string | number, previousValue?: any, newValue?: any) => void;
/**
 * Watch all changes associated to a data node instance
 * @param o  the data node to watch
 * @param fn the function to call when the data node changes (the new data node version will be passed as argument)
 * @return the watch function that can be used as identifier to un-watch the object (cf. unwatch)
 */
export declare function watch(o: any, fn: WatchFunction): WatchFunction | null;
/**
 * Stop watching a data node
 * @param d the targeted data node
 * @param watchFn the watch function that should not be called any longer (returned by watch(...))
 */
export declare function unwatch(o: any, watchFn: WatchFunction | null): void;
export declare function numberOfWatchers(o: any): number;
/**
 * Start tracking an object. The track function will be called synchronously when a new value is set in one
 * of the object property. Note that sub-object properties will not be tracked (on the contrary to watch)
 * @param o
 * @param fn
 */
export declare function track(o: any, fn: TrackFunction): TrackFunction | null;
/**
 * Stop tracking an object
 * @param o
 * @param trackFn
 */
export declare function untrack(o: any, trackFn: TrackFunction): void;
export declare function numberOfTrackers(o: any): number;
/**
 * Force the creation of a property instance even if it can be null or undefined
 * @param o a Data Object
 * @param propName the property name
 * @returns the new property value
 */
export declare function createProperty(o: any, propName: string | number): any;
/**
 * Reset a property to its initial value
 * @param o a Data Object
 * @param propName the property name
 * @returns the new property value
 */
export declare function resetProperty(o: any, propName: string): any;
export interface JSConversionContext {
    getDefaultConversion(): any;
    getPreviousConversion(): any;
}
export interface JSConverter {
    (obj: any, cc: JSConversionContext): any;
}
export declare const convertToJson: (d: any, converter?: JSConverter | undefined) => any;
/**
 * Create a trax object instance from a JSON object that use the same key-values as the data set properties
 * The data will actually be lazy-loaded so that the json object will only be read when the
 * equivalent property is read on the data node instance
 * Note: the returned dataset will be initialized with the json data and will be considered as mutable, with no on-going mutations
 * @param c the @Data object constructor (i.e. class reference)
 * @param json the json data to feed in the data node
 * @return the new object instance
 */
export declare function create<T>(c: Constructor<T> | Factory<T>, json?: Object): T;
/**
 * Data Object class decorator
 * @param c the data object constructor
 */
export declare function ΔD(c: any): void;
/**
 * Property decorator
 * Adds getter / setter
 * @param factory the property factory (or 0 if none - e.g. for 'any' types)
 * @param canBeNullOrUndefined: 1=can be null, 2=can be undefined, 3=can be both null or undefined
 */
export declare function Δp<T>(factory?: Factory<T> | 0, canBeNullOrUndefined?: 1 | 2 | 3): (proto: any, key: string) => void;
/**
 * Undefined symbol - returned by ΔDefault methods to differentiate no default from undefined
 */
export declare const Δu: {};
/**
 * Generate a factory function for a given Data class reference
 */
export declare function Δf<T>(dataObjectClassRef: Constructor<T>): Factory<T>;
export declare const ΔfStr: Factory<string>;
export declare const ΔfNbr: Factory<number>;
export declare const ΔfBool: Factory<boolean>;
export declare const ΔfNull: Factory<null>;
export declare const ΔfRef: Factory<undefined>;
/**
 * Recursively mark a node and its parent as changed (i.e. create a mutable next object on them)
 * @param o the data node to mark as changed
 * @param selfChange true if the call is triggered by a change of a direct property, false otherwise (i.e. when in recursive call)
 */
export declare function touch(o: TraxObject): void;
/**
 * Disconnect a child node from its parent
 * (i.e. remove the parent from the child parents collection)
 * @param parent
 * @param child
 */
export declare function ΔDisconnectChildFromParent(parent: TraxObject, child: TraxObject | null): void;
/**
 * Connect a child node to a new parent
 * (i.e. add the parent from the child parents collection)
 * @param parent
 * @param child
 */
export declare function ΔConnectChildToParent(parent: TraxObject, child: TraxObject | null): void;
/**
 * Context holding a linked list of nodes that need to be refreshed
 */
declare class RefreshContext {
    id: number;
    objects: TraxObject[] | undefined;
    constructor();
    /**
     * Check if a data object needs to be refreshed (i.e. if it has a watcher)
     * If refresh is needed, its md.refreshContext will be set
     * @param o
     */
    register(o: TraxObject): void;
    /**
     * Refresh all the data nodes associated to the current context
     * @param syncWatchers flag indicating if watch callbacks should be called synchronously (default: true)
     */
    refresh(syncWatchers?: boolean): void;
}
export declare function createFactory<T>(cf: Constructor<T> | Factory<T>): Factory<T>;
export declare function createNewRefreshContext(): void;
export declare let Δlf: <T>(itemFactory?: Factory<T> | undefined) => Factory<T[]>;
export declare const Δdf: <T>(itemFactory?: Factory<T> | undefined) => Factory<{
    [k: string]: any;
}>;
export declare function createDictionary<T>(c?: Constructor<T>): {
    [k: string]: T;
};
export {};
