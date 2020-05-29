import { IvTemplate } from '../iv/types';
import { IvError, CompilationResult } from '../iv/compiler/types';
export declare let body: {
    $template(tsa: TemplateStringsArray): Promise<string | undefined>;
};
export declare let statics: {
    $template(tsa: TemplateStringsArray): Promise<any[] | undefined>;
};
export declare let test: {
    importMap: undefined;
    $template(tsa: TemplateStringsArray): Promise<CompilationResult>;
};
export declare let testData: {
    lastEventListenerOptions: any;
};
export declare function compilationError(src: string, lineOffset?: number): Promise<string>;
export declare const error: {
    $template(tsa: TemplateStringsArray): Promise<string>;
    template2: (tsa: TemplateStringsArray) => Promise<string>;
};
export declare function formatError(e?: IvError, indentLevel?: number): string;
export declare function reset(): ElementNode;
export declare function getTemplate(f: () => IvTemplate, body: any): IvTemplate;
export declare function logNodes(t: IvTemplate, label?: string): void;
export declare function stringify(t: IvTemplate, log?: boolean): any;
export declare function resetIdCount(): void;
export declare const doc: {
    resetUid(): void;
    getLastUid(): number;
    traces: {
        wentThroughTextContentDelete: boolean;
        reset: () => void;
    };
    createDocumentFragment(): DocFragment;
    createTextNode(data: string): TextNode;
    createElement(name: string): ElementNode;
    createElementNS(ns: string, name: string): any;
    createComment(data: string): CommentNode;
};
interface StringOptions {
    indent?: string;
    isRoot?: boolean;
    showUid?: boolean;
}
declare class CommentNode {
    data: string;
    uid: string;
    constructor(data: string);
    stringify(options?: StringOptions): string;
}
declare class TextNode {
    _textContent: string;
    uid: string;
    parentNode: null;
    changeCount: number;
    constructor(_textContent: string);
    textContent: string;
    log(label?: string): void;
    stringify(options?: StringOptions): string;
    readonly innerText: string;
}
declare class ElementClassList {
    elt: any;
    constructor(elt: any);
    add(name: string): void;
    remove(name: string): void;
}
export declare class ElementNode {
    nodeName: string;
    uid: string;
    childNodes: any[];
    namespaceURI: string;
    nsSpecified: boolean;
    parentNode: null;
    classList: ElementClassList;
    style: {};
    $changes: any;
    eListeners: any[];
    constructor(nodeName: string, namespace?: string);
    setAttribute(key: string, value: string): void;
    getAttribute(name: string): any;
    removeAttribute(key: string): void;
    value: any;
    className: string;
    readonly tagName: string;
    readonly nodeType: 1 | 11;
    innerHTML: string;
    appendChild(node: any): void;
    removeChild(node: any): void;
    textContent: any;
    insertBefore(node: any, nodeRef: any): void;
    log(label?: string): void;
    stringify(options?: StringOptions): string;
    addEventListener(evtName: any, func: any, options: any): void;
    click(): void;
}
export declare function focusElt(e: ElementNode): void;
export declare function blurElt(e: ElementNode): void;
export declare function editElt(e: ElementNode, value: string | boolean | number, append?: boolean, focusAndBlur?: boolean): void;
declare class DocFragment extends ElementNode {
    constructor();
}
export {};
