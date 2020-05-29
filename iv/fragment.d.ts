import { IvDocument, IvFragment, IvTemplate } from './types';
import { IvElement } from '.';
import { IvEventEmitter } from './events';
import { PreProcessorFactories } from './compiler/types';
/**
 * Create an IvFragment out of a $fragment template string
 * e.g. const foo = `Some Text ${v}...` where v can be a string or another IvFragment
 * @param strings the static part of the template string
 * @param keys the values in the template string - can be IvFragment or anything that can be converted to a string
 */
export declare function $fragment(strings: TemplateStringsArray, ...keys: any[]): IvFragment;
interface RenderOptions {
    doc?: IvDocument;
    preProcessors?: PreProcessorFactories;
}
export declare function renderFragment(f: IvFragment, htmlElement: any, context?: {
    [ref: string]: any;
}, options?: RenderOptions): Promise<IvTemplate>;
declare class FragmentAPI {
    value: any;
    context?: {
        [key: string]: any;
    };
    doc?: IvDocument;
    $targetElt: IvElement;
    completeEmitter: IvEventEmitter;
}
export declare const fragment: import("./types").IvDecorator<FragmentAPI>;
export {};
