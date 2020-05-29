import { PreProcessorFactories } from '../compiler/types';
export default function ivy(opts?: {
    include?: any;
    exclude?: any;
    preProcessors?: PreProcessorFactories;
}): {
    name: string;
    transform(this: any, code: string, fileId: string): Promise<any>;
};
