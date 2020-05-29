export interface IvDocument {
    createTextNode(data: string): any;
    createElement(name: string): any;
    createElementNS(ns: string, name: string): any;
    createComment(data: string): any;
    createDocumentFragment(): any;
}
export interface IvContent {
    isEmpty: () => boolean;
}
export interface IvTemplate {
    kind: "$template";
    api: any | undefined;
    controller: any | undefined;
    uid: number;
    attach(element: any): IvTemplate;
    render(data?: any, forceRefresh?: boolean): IvTemplate;
    dispose(): void;
    query(label: string): any | null;
    query(label: string, all: true): any[] | null;
}
export interface IvFragment {
    kind: "$fragment";
    template: string;
    createInstance?: () => IvTemplate;
}
export interface IvLogger {
    log(message?: any, ...optionalParams: any[]): void;
    error(error?: any, ...optionalParams: any[]): void;
}
export interface IvNode {
    kind: "#element" | "#text" | "#fragment" | "#container" | "#decorator" | "#listener" | "#param";
    uid: string;
    idx: number;
    parentIdx: number;
    nextSibling: IvNode | undefined;
    domNode: any;
    attached: boolean;
}
export interface IvParentNode extends IvNode {
    ns: string;
    firstChild: IvNode | undefined;
    lastChild: IvNode | undefined;
}
export interface IvFrgNode extends IvParentNode {
    kind: "#fragment";
    contentView: IvView | null;
}
export interface IvProjectionHost {
    view: IvView;
    hostNode: IvEltNode | IvFrgNode;
}
export interface IvView {
    kind: "#view";
    uid: string;
    attached: boolean;
    domNode?: any;
    nodes: IvNode[] | null;
    namespaces: string[] | undefined;
    namespace: string | undefined;
    doc: IvDocument;
    parentView: IvView | null;
    cm: boolean;
    cmAppends: null | ((n: IvNode, domOnly: boolean) => void)[];
    lastRefresh: number;
    container: IvContainer | IvEltNode | IvFrgNode | null;
    projectionHost: IvProjectionHost | null;
    template: IvTemplate | undefined;
    rootDomNode: any;
    anchorNode: any;
    expressions: any[] | undefined;
    oExpressions: any[] | undefined;
    instructions: any[] | undefined;
    paramNode: IvParamNode | undefined;
    createElement: (name: string, namespace?: string) => any;
    nodeCount?: number;
    isEmpty: () => boolean;
}
interface ListMetaData {
    sizes: {
        [key: string]: number;
    };
    listNames: string[];
    listMap: {
        [key: string]: 1;
    };
}
interface IvParamNodeParent {
    lists?: ListMetaData;
}
export interface IvText extends IvNode {
    kind: "#text";
    pieces: string[] | undefined;
}
export interface IvEltListener extends IvNode {
    kind: "#listener";
    callback: ((e: any) => void) | undefined;
}
export interface IvParamNode extends IvNode, IvParamNodeParent {
    kind: "#param";
    dataName: string;
    dataHolder: any;
    data: any;
    dataIsList?: boolean;
    contentView: IvView | undefined;
    dynamicParams: {
        [key: string]: 1;
    } | undefined;
    viewPool: IvView[] | undefined;
    viewInstanceIdx: number;
    bindings?: IvBinding[];
}
export interface IvContainer extends IvNode {
    kind: "#container";
    subKind: "##block" | "##cpt" | "##async";
    cmAppend: null | ((n: IvNode, domOnly: boolean) => void);
}
export interface IvBlockContainer extends IvContainer {
    subKind: "##block";
    views: IvView[];
    viewPool: IvView[];
    lastRefresh: number;
    previousNbrOfViews: number;
    insertFn: null | ((n: IvNode, domOnly: boolean) => void);
}
export interface IvCptContainer extends IvContainer, IvParamNodeParent {
    subKind: "##cpt";
    cptRef: any;
    template: IvTemplate | null;
    data: any;
    contentView: IvView | null;
    dynamicParams: {
        [key: string]: 1;
    } | undefined;
    bindings?: IvBinding[];
}
export interface IvBinding {
    propertyHolder: Object;
    propertyName: string | number;
    watchFn: (() => void) | null;
}
export interface IvAsyncContainer extends IvContainer {
    subKind: "##async";
    priority: number;
}
export interface IvEltNode extends IvParentNode {
    kind: "#element";
    contentView: IvView | null;
}
export interface IvDecoNode extends IvNode {
    kind: "#decorator";
    instance: IvDecoratorInstance;
    api: any;
    refName: string;
    validProps: boolean;
    bindings?: IvBinding[];
}
/**
 * Decorator interface
 */
export interface IvDecorator<ApiClass> {
    ($api: ApiClass): IvDecoratorInstance;
    $isDecorator: true;
    $apiClass: {
        new (): ApiClass;
    };
}
export interface IvDecoratorInstance {
    $init?: () => void;
    $render?: () => void;
    $dispose?: () => void;
}
export {};
