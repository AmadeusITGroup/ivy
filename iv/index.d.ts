import { IvTemplate, IvView, IvDocument, IvNode, IvContainer, IvCptContainer, IvLogger, IvDecorator, IvDecoratorInstance } from './types';
import { ΔD, Δp, Δf } from '../trax';
export declare let uidCount: number;
export declare const logger: IvLogger;
interface TemplateController {
    $api?: any;
    $init?: () => void;
    $beforeRender?: () => void;
    $afterRender?: () => void;
}
/**
 * Template object created at runtime
 */
export declare class Template implements IvTemplate {
    templateName: string;
    filePath: string;
    staticCache: Object;
    renderFn: (ζ: IvView, $: any, $api: any, $template: IvTemplate) => void | undefined;
    $Class?: (() => void) | undefined;
    $contextIdentifiers?: string[] | undefined;
    kind: "$template";
    _uid: number;
    view: IvView;
    tplApi: any;
    tplCtl: any;
    forceRefresh: boolean;
    watchCb: () => void;
    activeWatch: boolean;
    lastRefreshVersion: number;
    processing: boolean;
    rendering: boolean;
    initialized: boolean;
    labels: {
        [label: string]: any[];
    } | undefined;
    hasCtlClass: boolean;
    $contextInitialized: boolean;
    constructor(templateName: string, filePath: string, staticCache: Object, renderFn: (ζ: IvView, $: any, $api: any, $template: IvTemplate) => void | undefined, $Class?: (() => void) | undefined, $contextIdentifiers?: string[] | undefined);
    dispose(disconnectFromDom?: boolean): void;
    readonly uid: number;
    document: IvDocument;
    readonly api: any | undefined;
    readonly controller: TemplateController | undefined;
    attach(element: any): this;
    registerLabel(label: string, object: any): void;
    /**
     * Return the first element labelled as per the argument
     * e.g. for <div #foo/> -> query("#foo") will return the DIV DOM element
     * @param label
     * @return the DOM element or the Component api or null if nothing is found
     */
    query(selector: string, all?: boolean): any | any[] | null;
    notifyChange(): void;
    disconnectObserver(): void;
    render(data?: any, forceRefresh?: boolean): this;
}
export declare function createView(parentView: IvView | null, container: IvContainer | null, srcUID: number, template?: IvTemplate): IvView;
/**
 * Placeholder function - will replace with ζt(...) at compilation time
 * @param template
 */
export declare function $template(tsa: TemplateStringsArray): () => IvTemplate;
/**
 * Template runtime factory
 * cf. sample code generation in generator.spec
 * @param renderFn
 */
export declare function ζt(tplName: string, tplFile: string, staticCache: Object, renderFn: (ζ: any, $: any, $api: any, $template: IvTemplate) => void, argumentClass?: any, contextIdentifiers?: string[]): () => IvTemplate;
/**
 * Unchanged symbol
 * Used as a return value for expressions (cf. ζe) to notify that a value hasn't changed
 */
export declare const ζu: never[];
export declare function ζinit(v: IvView, staticCache: Object, nbrOfNodes: number): boolean;
export declare function ζview(pv: IvView, iFlag: number, containerIdx: number, nbrOfNodes: number, instanceIdx: number): IvView;
export declare function ζviewD(pv: IvView, iFlag: number, containerIdx: number, nbrOfNodes: number, instanceIdx: number, view?: IvView): IvView;
export declare function ζend(v: IvView, cm: boolean, containerIndexes?: (number[] | 0)): void;
export declare function ζendD(v: IvView, cm: boolean, containerIndexes?: (number[] | 0)): void;
export declare function ζelt(v: IvView, cm: boolean, idx: number, parentLevel: number, name: string, hasChildren: 0 | 1, labels?: any[] | 0, staticAttributes?: any[] | 0, staticProperties?: any[] | 0): void;
export declare function ζeltD(v: IvView, cm: boolean, idx: number, parentLevel: number, name: string, hasChildren: 0 | 1, labels?: any[] | 0, staticAttributes?: any[], staticProperties?: any[]): void;
export declare function ζxmlns(v: IvView, iFlag: number, ns?: string): void;
export declare function ζxmlnsD(v: IvView, iFlag: number, ns?: string): void;
export declare function ζtxt(v: IvView, cm: boolean, iFlag: number, idx: number, parentLevel: number, labels: any[] | 0, statics: string | string[], nbrOfValues: number, ...values: any[]): void;
export declare function ζtxtD(v: IvView, cm: boolean, iFlag: number, idx: number, parentLevel: number, labels: any[] | 0, statics: string | string[], nbrOfValues: number, ...values: any[]): void;
export declare function ζe(v: IvView, idx: number, value: any): any;
export declare function ζo(v: IvView, idx: number, value: any, iFlag?: number): any;
export declare function ζfra(v: IvView, cm: boolean, idx: number, parentLevel: number): void;
export declare function ζfraD(v: IvView, cm: boolean, idx: number, parentLevel: number): void;
export declare function ζcnt(v: IvView, cm: boolean, idx: number, parentLevel: number, type: number): IvContainer | undefined;
export declare function createContainer(idx: number, cmAppend: null | ((n: IvNode, domOnly: boolean) => void), type: number): IvContainer | null;
export declare function ζcntD(v: IvView, cm: boolean, idx: number, parentLevel: number, type: number): void;
export declare function ζcpt(v: IvView, cm: boolean, iFlag: number, idx: number, parentLevel: number, exprCptRef: any, callImmediately: number, labels?: any[] | 0, staticParams?: any[] | 0, dynParamNames?: string[]): void;
export declare function ζcptD(v: IvView, cm: boolean, iFlag: number, idx: number, parentLevel: number, exprCptRef: any, callImmediately: number, labels?: any[] | 0, staticParams?: any[] | 0, dynParamNames?: string[]): void;
export declare function ζcall(v: IvView, idx: number, container?: IvCptContainer | 0, labels?: any[] | 0, dynParamNames?: string[]): void;
export declare function ζcallD(v: IvView, idx: number, container?: IvCptContainer | 0, labels?: any[] | 0, dynParamNames?: string[]): void;
export declare function ζpnode(v: IvView, cm: boolean, iFlag: number, idx: number, parentIndex: number, name: string, instanceIdx: number, labels?: any[] | 0, staticParams?: any[] | 0, dynParamNames?: string[]): void;
export declare function ζpnEnd(v: IvView, cm: boolean, iFlag: number, idx: number, labels?: any[] | 0, dynParamNames?: string[]): void;
export declare function ζatt(v: IvView, iFlag: number, eltIdx: number, name: string, expr: any): void;
export declare function ζattD(v: IvView, iFlag: number, eltIdx: number, name: string, expr: any): void;
export declare function ζpro(v: IvView, iFlag: number, eltIdx: number, name: string, expr: any): void;
export declare function ζproD(v: IvView, iFlag: number, eltIdx: number, name: string, expr: any): void;
export declare function ζpar(v: IvView, cm: boolean, iFlag: number, eltIdx: number, name: string | 0, expr: any): void;
export declare function ζparD(v: IvView, cm: boolean, iFlag: number, eltIdx: number, name: string, expr: any): void;
export declare function ζbind(v: IvView, cm: boolean, iFlag: number, eltIdx: number, bindingIdx: number, name: string | 0, propertyHolder: any, propertyName?: string | number): void;
export declare function ζbindD(v: IvView, cm: boolean, iFlag: number, eltIdx: number, bindingIdx: number, name: string | 0, propertyHolder: any, propertyName?: string | number): void;
export declare function ζlbl(v: IvView, iFlag: number, idx: number, name: string, value: any): void;
export declare function ζlblD(v: IvView, iFlag: number, idx: number, name: string, value: any): void;
export declare function ζdeco(v: IvView, cm: boolean, iFlag: number, idx: number, parentIdx: number, decoName: string, decoRef: any, paramMode: 0 | 1 | 2, defaultValue?: any | 0, staticParams?: any[] | 0, labels?: any[]): void;
export declare function ζdecoD(v: IvView, cm: boolean, iFlag: number, idx: number, parentIdx: number, decoName: string, decoRef: any, paramMode: 0 | 1 | 2, defaultValue?: any | 0, staticParams?: any[] | 0, labels?: any[]): void;
export declare function ζdecoCall(v: IvView, cm: boolean, iFlag: number, idx: number): void;
export declare function ζdecoCallD(v: IvView, cm: boolean, iFlag: number, idx: number): void;
export declare function ζevt(v: IvView, cm: boolean, idx: number, eltIdx: number, eventName: string, handler: (e: any) => void, passive?: 0 | 1, options?: any): void;
export declare function ζevtD(v: IvView, cm: boolean, idx: number, eltIdx: number, eventName: string, handler: (e: any) => void, passive?: 0 | 1, options?: any): void;
export declare function ζins(v: IvView, iFlag: number, idx: number, contentExprOr$: any, is$Param?: 1): void;
export declare function ζinsD(v: IvView, iFlag: number, idx: number, exprContentView: any, is$Param?: 1): void;
export declare const ζΔD: typeof ΔD;
export declare const ζΔp: typeof Δp;
export declare const ζΔf: typeof Δf;
export declare const ζΔdf: <T>(itemFactory?: import("../trax").Factory<T> | undefined) => import("../trax").Factory<{
    [k: string]: any;
}>;
export declare const ζΔfStr: import("../trax").Factory<string>;
export declare const ζΔfBool: import("../trax").Factory<boolean>;
export declare const ζΔfNbr: import("../trax").Factory<number>;
export declare const ζΔlf: <T>(itemFactory?: import("../trax").Factory<T> | undefined) => import("../trax").Factory<T[]>;
export declare const ζΔu: {};
export declare const ΔfRef: import("../trax").Factory<undefined>;
export declare function API(c: any): void;
export declare function Controller(c: any): void;
export declare function decorator<ApiClass>(apiClass: {
    new (): ApiClass;
}, createInstance: (api: ApiClass) => IvDecoratorInstance): IvDecorator<ApiClass>;
export interface IvElement {
    className: string;
    readonly clientHeight: number;
    readonly clientLeft: number;
    readonly clientTop: number;
    readonly clientWidth: number;
    id: string;
    innerHTML: string;
    readonly scrollHeight: number;
    scrollLeft: number;
    scrollTop: number;
    readonly scrollWidth: number;
    readonly tagName: string;
    title: string;
    setAttribute(qualifiedName: string, value: string): void;
    removeAttribute(qualifiedName: string): void;
    addEventListener(type: string, listener: (e?: any) => void, options?: boolean | any): void;
    removeEventListener(type: string, listener: (e?: any) => void, options?: boolean | any): void;
}
/**
 * Default value API decorator @defaultParam
 */
export declare function defaultParam(proto: any, key: string): void;
/**
 * Input/Output API property decorator
 * Defines a property as input/output - i.e. this property can be used with an expression binding (e.g. prop={=a.b})
 * as it may be changed by the API controller (e.g. component or decorator)
 */
export declare function io(proto: any, key: string): void;
/**
 * API decorator to indicate that some properties are expected to be set
 * Ivy will use this indication to raise automatic errors
 * (e.g. missing $targetElt or $targetApi)
 */
export declare function required(proto: any, key: string): void;
export declare function asyncComplete(): Promise<null>;
export declare function logViewNodes(v: IvView, indent?: string): void;
export declare const runtime: {
    "ζt": typeof ζt;
    "ζu": never[];
    "ζinit": typeof ζinit;
    "ζview": typeof ζview;
    "ζviewD": typeof ζviewD;
    "ζend": typeof ζend;
    "ζendD": typeof ζendD;
    "ζelt": typeof ζelt;
    "ζeltD": typeof ζeltD;
    "ζxmlns": typeof ζxmlns;
    "ζxmlnsD": typeof ζxmlnsD;
    "ζtxt": typeof ζtxt;
    "ζtxtD": typeof ζtxtD;
    "ζe": typeof ζe;
    "ζo": typeof ζo;
    "ζfra": typeof ζfra;
    "ζfraD": typeof ζfraD;
    "ζcnt": typeof ζcnt;
    "ζcntD": typeof ζcntD;
    "ζcpt": typeof ζcpt;
    "ζcptD": typeof ζcptD;
    "ζcall": typeof ζcall;
    "ζcallD": typeof ζcallD;
    "ζpnode": typeof ζpnode;
    "ζpnEnd": typeof ζpnEnd;
    "ζatt": typeof ζatt;
    "ζattD": typeof ζattD;
    "ζpro": typeof ζpro;
    "ζproD": typeof ζproD;
    "ζpar": typeof ζpar;
    "ζparD": typeof ζparD;
    "ζbind": typeof ζbind;
    "ζbindD": typeof ζbindD;
    "ζlbl": typeof ζlbl;
    "ζlblD": typeof ζlblD;
    "ζdeco": typeof ζdeco;
    "ζdecoD": typeof ζdecoD;
    "ζdecoCall": typeof ζdecoCall;
    "ζdecoCallD": typeof ζdecoCallD;
    "ζevt": typeof ζevt;
    "ζevtD": typeof ζevtD;
    "ζins": typeof ζins;
    "ζinsD": typeof ζinsD;
};
export {};
