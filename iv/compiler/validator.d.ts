import { XjsNode } from '../../xjs/types';
import { GenerationCtxt } from './types';
export declare const validator: {
    validateXjsNode(nd: XjsNode, gc: GenerationCtxt): void;
    getShortPath(filePath: string): string;
    throwError(msg: string, pos: number, source: string, filePath: string, origin?: string, lineOffset?: number, colOffset?: number): never;
    getErrorMessage(origin: string, description: string, file: string, line: number, column: number, lineExtract: string): string;
    getLineInfo(src: string, pos: number): {
        lineNbr: number;
        lineContent: string;
        columnNbr: number;
    };
    nodeName(kind: string): any;
};
