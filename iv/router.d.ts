import { IvElement } from '.';
export interface Router {
    currentRoute: Route;
    add(routeDict: {
        [routePattern: string]: NavControllerLoadFunction | NavController | NavControllerFactory | RouteRetriever;
    }): void;
    remove(routePattern: string): boolean;
    navigate(path: string): Promise<void>;
    parseRoute(routePattern: string): RouteDef;
    init(navState: any, win: UrlAccessor, baseUrl: string, parent?: Router): Promise<void>;
    getRoute(url: string): Route | null;
    deferLoad(retriever: () => Promise<RouteLoader>): RouteRetriever;
    matchActive(rd: RouteDef): boolean;
}
export interface NavController {
    load(r?: Route, navState?: any): void | Promise<void>;
    unload?(r: Route, navState: any): void;
    canNavigateFrom?(dest: Route, navState: any): boolean;
    canNavigateTo?(dest: Route, navState: any): boolean;
    dispose?(): void;
}
export interface NavControllerLoadFunction {
    (r?: Route, navState?: any): void | Promise<void>;
}
export interface RouteLoader {
    loadRoutes(r: Router, parentRoute: RouteDef): void;
}
interface RouteRetriever {
    retrieveRoute(parentRouteDef?: RouteDef, path?: string): Promise<Route | null>;
}
export interface NavControllerFactory {
    createController(parentRouteDef?: RouteDef, path?: string): NavController | Promise<NavController>;
}
export interface Route {
    path: string;
    pathList: any;
    pathParams: null | {
        [name: string]: string;
    };
    params: null | {
        [name: string]: string;
    };
    hashParam: null | string;
    routeId: string;
    pattern: string;
}
export interface RouteDef {
    pattern: string;
    containsParams: boolean;
    containsHashParam: boolean;
    routeId: string;
    normalizedPath: string[];
    pathVariables: string[] | null;
    isDefault: boolean;
    controllerFactory?: NavControllerFactory | RouteRetriever;
    controller?: NavController;
}
interface UrlAccessor {
    location: {
        href: string;
    };
    history: {
        pushState(state: any, title: string, url: string): void;
        replaceState(state: any, title: string, url: string): void;
    };
    addEventListener(type: string, listener: (e: any) => void): void;
}
export declare function newRouter(): Router;
export declare class Link {
    ΔΔurl: string;
    url: string;
    ΔΔ$targetElt: IvElement;
    $targetElt: any;
    ΔDefault(n: any): {};
}
export declare const link: import("./types").IvDecorator<Link>;
export declare const activeLink: import("./types").IvDecorator<Link>;
export declare class ActiveRoute {
    ΔΔpattern: string;
    pattern: string;
    ΔΔ$targetElt: IvElement;
    $targetElt: any;
    ΔDefault(n: any): {};
}
export declare const activeRoute: import("./types").IvDecorator<ActiveRoute>;
export {};
