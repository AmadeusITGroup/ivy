import { PreProcessorFactories } from './types';
export interface ProcessOptions {
    filePath: string;
    preProcessors?: PreProcessorFactories;
    logErrors?: boolean;
}
export declare function process(source: string, options: ProcessOptions): Promise<string>;
export interface CompilationResult {
    fileContent: string;
    convertLineNbr: (newLineNbr: number) => number;
}
export interface CompilationOptions {
    filePath: string;
    preProcessors?: PreProcessorFactories;
}
export declare function compile(source: string, pathOrOptions: string | CompilationOptions): Promise<CompilationResult>;
