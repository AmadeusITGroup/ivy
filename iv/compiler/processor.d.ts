import { XjsTplFunction, XjsContentNode, XjsNodeParam, XjsExpression, XjsElement, XjsFragment, XjsJsBlock, XjsComponent, XjsParamNode, XjsDecorator } from '../../xjs/types';
import { CompilationOptions, CompilationResult, GenerationCtxt, DecoInstruction, CptInstruction, PndInstruction, ViewKind, ViewInstruction } from './types';
export declare function compileTemplate(template: string, gc: GenerationCtxt, options: CompilationOptions): Promise<CompilationResult>;
export declare class ViewBlock {
    kind: ViewKind;
    node: XjsTplFunction | XjsJsBlock | XjsElement | XjsFragment | XjsComponent;
    idx: number;
    parentView: ViewBlock | null;
    iFlag: number;
    gc: GenerationCtxt;
    vi: ViewInstruction;
    nodeCount: number;
    instructions: any[];
    indent: string;
    prevKind: string;
    nextKind: string;
    instanceCounterVar: string;
    blockIdx: number;
    jsVarName: string;
    cmVarName: string;
    childBlockCreated: boolean[];
    childBlockIndexes: number[];
    childViewIndexes: number[];
    exprCount: number;
    expr1Count: number;
    dExpressions: number[];
    hasChildNodes: boolean;
    hasParamNodes: boolean;
    asyncValue: number | XjsExpression;
    cptIFlag: number;
    cpnParentLevel: number;
    contentParentInstruction: CptInstruction | PndInstruction | undefined;
    paramInstanceVars: {
        [paramName: string]: string;
    } | undefined;
    bindingsCount: number;
    constructor(instructionsBlock: ViewBlock | null, kind: ViewKind, node: XjsTplFunction | XjsJsBlock | XjsElement | XjsFragment | XjsComponent, idx: number, parentView: ViewBlock | null, iFlag: number, generationCtxt: GenerationCtxt, indent?: string);
    scan(): void;
    scanContent(content: XjsContentNode[] | undefined, parentLevel: number, iFlag: number): void;
    generateInstruction(siblings: XjsContentNode[], siblingIdx: number, parentLevel: number, iFlag: number, prevKind: string, nextKind: string): void;
    retrieveXmlNs(nd: XjsElement | XjsFragment): string;
    registerStatics(params: XjsNodeParam[] | undefined): [number, number, boolean];
    /**
     * Parse the XJS node to look for labels - e.g. #foo or #bar[] or #baz[{expr()}]
     * @param nd
     */
    generateLabelStatics(nd: XjsElement | XjsComponent | XjsDecorator): string;
    generateParamInstructions(nd: XjsFragment | XjsDecorator, idx: number, iFlag: number, isAttribute: boolean, view: ViewBlock): void;
    generateDynLabelInstructions(nd: XjsFragment | XjsComponent | XjsDecorator, idx: number, iFlag: number, view: ViewBlock): void;
    processAsyncCase(nd: XjsElement | XjsFragment, idx: number, parentLevel: number, prevKind: string, nextKind: string): boolean;
    setAsync(asyncValue: number | XjsExpression): void;
    generateDecoratorInstructions(nd: XjsComponent | XjsElement | XjsFragment, idx: number, iFlag: number, includeBuiltIn?: boolean, includeCustomDecorators?: boolean): DecoInstruction[] | undefined;
    createListeners(nd: XjsElement | XjsComponent | XjsParamNode | XjsDecorator, parentIdx: number, iFlag: number, view: ViewBlock): boolean;
}
