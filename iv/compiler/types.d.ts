import { XjsPreProcessor, XjsText, XjsCData, XjsNode, XjsElement, XjsFragment, XjsParam, XjsProperty, XjsDecorator, XjsLabel, XjsJsStatement, XjsComponent, XjsParamNode, XjsExpression, XjsTplFunction, XjsJsBlock } from '../../xjs/types';
export interface IvError {
    kind: "#Error";
    origin: "IVY" | "TS" | "XJS";
    message: string;
    description: string;
    line: number;
    column: number;
    lineExtract: string;
    file: string;
}
export interface CompilationOptions {
    templateName: string;
    filePath: string;
    body?: boolean;
    statics?: boolean;
    function?: boolean;
    imports?: boolean;
    importMap?: {
        [key: string]: 1;
    };
    lineOffset?: number;
    columnOffset?: number;
    preProcessors?: PreProcessorFactories;
    templateType?: "$template" | "$fragment";
}
export declare type PreProcessorFactories = {
    [name: string]: () => XjsPreProcessor;
};
export interface CompilationResult {
    body?: string;
    statics?: any[];
    function?: string;
    importMap?: {
        [key: string]: 1;
    };
    contextIdentifiers?: string[];
}
export declare enum ContainerType {
    Block = 1,
    Component = 2,
    Async = 3
}
export declare type ViewKind = "template" | "cptContent" | "paramContent" | "jsBlock" | "asyncBlock";
export interface GenerationCtxt {
    init(template: string, options: CompilationOptions): void;
    process(root: XjsTplFunction | XjsFragment): any;
    template: string;
    options: CompilationOptions;
    indentIncrement: string;
    templateName: string;
    filePath: string;
    errorPath: string;
    imports: {
        [key: string]: 1;
    };
    statics: string[];
    localVars: {
        [name: string]: 1;
    };
    blockCount: number;
    eachCount: number;
    templateArgs: string[];
    paramCounter: number;
    acceptPreProcessors: boolean;
    error(msg: string, nd?: XjsNode): void;
    decreaseIndent(indent: string): string;
    addTxtInstruction(node: XjsText | XjsCData, idx: number, view: ViewInstruction, iFlag: number, parentLevel: number, staticLabels: string): void;
    addXmlNsInstruction(view: ViewInstruction, iFlag: number, startInstruction: boolean, xmlns: string): void;
    addEltInstruction(node: XjsElement, idx: number, view: ViewInstruction, iFlag: number, parentLevel: number, staticLabels: string, staticArgs: string): void;
    addFraInstruction(node: XjsFragment | null, idx: number, view: ViewInstruction, iFlag: number, parentLevel: number): void;
    addParamInstruction(parentView: ViewInstruction, node: XjsParam | XjsProperty | XjsDecorator, idx: number, view: ViewInstruction, iFlag: number, isAttribute: boolean, indent: string, targetParamNode: boolean): void;
    addDecoInstruction(node: XjsDecorator, idx: number, parentIdx: number, view: ViewInstruction, iFlag: number, indent: string, staticsIdx: number, staticLabels: string): DecoInstruction;
    addLblInstruction(node: XjsLabel, idx: number, view: ViewInstruction, iFlag: number, indent: string): void;
    addJsStatementsInstruction(node: XjsJsStatement, view: ViewInstruction, iFlag: number, prevKind: string): void;
    addCntInstruction(idx: number, view: ViewInstruction, iFlag: number, parentLevel: number, type: ContainerType): void;
    addCptInstruction(node: XjsComponent, idx: number, view: ViewInstruction, iFlag: number, parentLevel: number, staticLabels: string, callImmediately: boolean, staticParamIdx: number): CptInstruction;
    addPndInstruction(parentView: ViewInstruction, node: XjsParamNode, idx: number, view: ViewInstruction, iFlag: number, parentLevel: number, staticLabels: string, staticParamIdx: number, indent: string, parentIndex: number, instanceVarName: string, hasEndInstruction: boolean): PndInstruction;
    addEvtInstruction(decorator: XjsDecorator, name: string, idx: number, parentIdx: any, view: ViewInstruction, iFlag: number): void;
    addInsInstruction(node: XjsDecorator, parent: XjsComponent | XjsElement | XjsFragment, idx: number, view: ViewInstruction, iFlag: number): void;
    addViewInstruction(instructionsView: ViewInstruction | null, kind: ViewKind, node: XjsTplFunction | XjsJsBlock | XjsElement | XjsFragment | XjsComponent, idx: number, parentView: ViewInstruction | null, iFlag: number, generationCtxt?: GenerationCtxt, indent?: string): ViewInstruction;
}
export interface CptInstruction {
    idx: number;
    dynamicPNodeNames: string[];
    callImmediately: boolean;
    addEndInstruction(): void;
}
export interface PndInstruction {
    idx: number;
    dynamicPNodeNames: string[];
    addEndInstruction(): void;
}
export interface DecoInstruction {
    addEndInstruction(): void;
}
export interface ViewInstruction {
    gc: GenerationCtxt;
    instructions: any[];
    indent: string;
    nodeCount: number;
    jsVarName: string;
    cmVarName: string;
    exprCount: number;
    expr1Count: number;
    dExpressions: number[];
    bindingsCount: number;
    hasChildNodes: boolean;
    childBlockIndexes: number[];
    childViewIndexes: number[];
    paramInstanceVars?: {
        [paramName: string]: string;
    };
    asyncValue: number | XjsExpression;
    update?(indent: string, nodeCount: number, hasChildNodes: boolean, asyncValue: number | XjsExpression, exprCount: number, expr1Count: number, bindingsCount: number, paramInstanceVars?: {
        [paramName: string]: string;
    }): any;
}
