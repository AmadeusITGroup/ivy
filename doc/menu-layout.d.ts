import { IvTemplate } from '../iv/types';
interface Menuitem {
    title: string;
    code: string;
    content: () => IvTemplate;
}
interface MenuCategory {
    title: string;
    code: string;
    items: Menuitem[];
}
export interface MenuContent {
    categories: MenuCategory[];
}
export declare class MenuPageState {
    ΔΔcategoryCode: string;
    categoryCode: string;
    ΔΔitemCode: string;
    itemCode: string;
}
export declare function retrieveMenuItem(state: MenuPageState, itemCode: string, content: any, setOnPageState?: boolean): any;
export declare const menuLayout: () => IvTemplate;
export {};
