import { ViewInstruction, ContainerType, DecoInstruction, ViewKind, GenerationCtxt, CompilationOptions, CompilationResult } from './types';
import { XjsExpression, XjsJsStatement, XjsJsBlock, XjsCData, XjsText, XjsElement, XjsFragment, XjsParam, XjsProperty, XjsDecorator, XjsNode, XjsLabel, XjsComponent, XjsParamNode, XjsTplFunction } from '../../xjs/types';
declare type BodyContent = string | XjsExpression | XjsJsStatement | XjsJsBlock;
export declare class CodeGenerator implements GenerationCtxt {
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
    localVars: {};
    blockCount: number;
    eachCount: number;
    templateArgs: string[];
    paramCounter: number;
    acceptPreProcessors: boolean;
    fragmentMode: boolean;
    expressionRoots: {
        [key: string]: 1;
    };
    init(template: string, options: CompilationOptions): void;
    error(msg: string, nd: XjsNode): void;
    decreaseIndent(indent: string): string;
    process(root: XjsTplFunction | XjsFragment): CompilationResult;
    processRoot: (body: BodyContent[]) => void | undefined;
    addTxtInstruction(node: XjsText | XjsCData, idx: number, view: ViewInstruction, iFlag: number, parentLevel: number, staticLabels: string): void;
    addXmlNsInstruction(view: ViewInstruction, iFlag: number, startInstruction: boolean, xmlns: string): void;
    addEltInstruction(node: XjsElement, idx: number, view: ViewInstruction, iFlag: number, parentLevel: number, staticLabels: string, staticArgs: string): void;
    addFraInstruction(node: XjsFragment | null, idx: number, view: ViewInstruction, iFlag: number, parentLevel: number): void;
    addParamInstruction(instructionsView: ViewInstruction, node: XjsParam | XjsProperty | XjsDecorator, idx: number, view: ViewInstruction, iFlag: number, isAttribute: boolean, indent: string, targetParamNode?: boolean): void;
    addDecoInstruction(node: XjsDecorator, idx: number, parentIdx: number, view: ViewInstruction, iFlag: number, indent: string, staticsIdx: number, staticLabels: string): DecoInstruction;
    addLblInstruction(node: XjsLabel, idx: number, view: ViewInstruction, iFlag: number, indent: string): void;
    addJsStatementsInstruction(node: XjsJsStatement, view: ViewInstruction, iFlag: number, prevKind: string): void;
    addCntInstruction(idx: number, view: ViewInstruction, iFlag: number, parentLevel: number, type: ContainerType): void;
    addCptInstruction(node: XjsComponent, idx: number, view: ViewInstruction, iFlag: number, parentLevel: number, staticLabels: string, callImmediately: boolean, staticParamIdx: number): {
        (body: BodyContent[]): void;
        idx: number;
        dynamicPNodeNames: any[];
        callImmediately: boolean;
        addEndInstruction(): void;
    };
    addPndInstruction(instructionsView: ViewInstruction, node: XjsParamNode, idx: number, view: ViewInstruction, iFlag: number, parentLevel: number, staticLabels: string, staticParamIdx: number, indent: string, parentIndex: number, instanceVarName: string, hasEndInstruction: boolean): {
        (body: BodyContent[]): void;
        idx: number;
        dynamicPNodeNames: string[];
        addEndInstruction(): void;
    };
    addEvtInstruction(d: XjsDecorator, name: string, idx: number, parentIdx: any, view: ViewInstruction, iFlag: number): void;
    addInsInstruction(d: XjsDecorator, parent: XjsComponent | XjsElement | XjsFragment, idx: number, view: ViewInstruction, iFlag: number): void;
    addViewInstruction(instructionsView: ViewInstruction | null, kind: ViewKind, node: XjsTplFunction | XjsJsBlock | XjsElement | XjsFragment | XjsComponent, idx: number, parentView: ViewInstruction | null, iFlag: number, generationCtxt: GenerationCtxt, indent?: string): ViewInstruction;
}
export declare function parseBinding(code: string): {
    hostExp: string;
    propExp: string;
    errorMsg: string;
};
export {};
