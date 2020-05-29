import { IvTemplate, IvView, IvDocument, IvNode, IvContainer, IvBlockContainer, IvEltNode, IvParentNode, IvText, IvFrgNode, IvCptContainer, IvEltListener, IvParamNode, IvLogger, IvDecoNode, IvDecorator, IvDecoratorInstance, IvBinding } from './types';
import { ΔD, Δp, Δdf, ΔfStr, ΔfBool, ΔfNbr, Δf, Δlf, watch, unwatch, isMutating, createNewRefreshContext, commitChanges, version, resetProperty, createProperty, Δu, hasProperty, isDataObject, touch, createDictionary, ΔfRef as _ΔfRef } from '../trax';
// import * as _events from './events';
// import * as _fragment from './fragment';
// import * as _innerHTML from './innerHTML';
// import * as _inputs from './inputs';
// import * as _router from './router';

// export const events = _events;
// export const fragment = _fragment;
// export const innerHTML = _innerHTML;
// export const inputs = _inputs;
// export const router = _router;

export let uidCount = 0; // counter used for unique ids (debug only, can be reset)

export const logger: IvLogger = {
    log(msg: string, ...optionalParams: any[]) {
        console.log.apply(console, arguments);
    },
    error(msg: string, ...optionalParams: any[]) {
        console.error.apply(console, arguments);
    }
}

function error(view: IvView, msg: string) {
    // temporary error management
    let v: IvView | null = view, infos: string[] = [];
    while (v) {
        if (v.template) {
            let t = v.template as Template;
            infos.push(`\n>> Template: "${t.templateName}" - File: "${t.filePath}"`);
        }
        v = v.parentView;
    }
    logger.error("IVY: " + msg + infos.join(""));
}

const U = undefined,
    DOCUMENT_FRAGMENT = 11,
    PROP_API = "$api",
    PROP_TEMPLATE = "$template",
    PROP_LOGGER = "$logger",
    RX_EVENT_EMITTER = /^ΔΔ(\w+)Emitter$/,
    RX_TRAX_PROP_PREFIX = /^ΔΔ/,
    RX_TRAX_PROP_NAME = /^ΔΔ(.+)$/,
    RX_ERROR_ARGS = /([^ ]+)\s([^ ]+)/,
    API_FLAG = "ΔIsAPI",
    CONTROLLER_FLAG = "ΔIsController",
    DEFAULT_DECO_PARAM = "ΔDefaultParam",
    IO_PARAMS = "ΔIoParams",
    REQUIRED_PROPS = "ΔRequiredProps",
    DECORATOR_ERRORS = {
        "$targetApi": "$1 cannot be used on DOM nodes",
        "$targetElt": "$1 cannot be used on components that don't define #main elements"
    }
let TPL_COUNT = 0;

interface TemplateController {
    $api?: any;
    $init?: () => void;
    $beforeRender?: () => void;
    $afterRender?: () => void;
}

/**
 * Template object created at runtime
 */
export class Template implements IvTemplate {
    kind: "$template" = "$template";
    _uid = ++TPL_COUNT;
    view: IvView;
    tplApi: any = undefined;
    tplCtl: any = undefined;
    forceRefresh = false;
    watchCb: () => void;
    activeWatch = false;
    lastRefreshVersion = 0;
    processing = false;
    rendering = false;
    initialized = false;
    labels: { [label: string]: any[] } | undefined = undefined;
    hasCtlClass = false;
    $contextInitialized = false;

    constructor(public templateName: string, public filePath: string, public staticCache: Object, public renderFn: (ζ: IvView, $: any, $api: any, $template: IvTemplate) => void | undefined, public $Class?: () => void, public $contextIdentifiers?: string[]) {
        // document is undefined in a node environment
        this.view = createView(null, null, 1, this);
        let self = this;
        this.watchCb = function () {
            self.notifyChange();
        }
        this.watchCb["$templateId"] = this._uid;
        if (this.$Class !== U) {
            if (checkTemplateArgClass(this.$Class, CONTROLLER_FLAG)) {
                this.hasCtlClass = true;
            } else if (!checkTemplateArgClass(this.$Class, API_FLAG) && !isDataObject(this.$Class.prototype)) {
                error(this.view, "Type of $ argument must be either a @Controller, an @API or a @Data class");
            }
        }
    }

    dispose(disconnectFromDom = true) {
        const v = this.view;
        this.disconnectObserver();
        callLcHook(v, this.tplCtl, "$dispose", this.templateName);
        if (disconnectFromDom && v && v.nodes && v.nodes.length) {
            removeFromDom(v, v.nodes[0]);
            if (v.anchorNode) {
                // this is the root template
                v.rootDomNode.removeChild(v.anchorNode);
                v.anchorNode = null;
            }
            // todo: view dispose
        }
    }

    get uid() {
        return this._uid;
    }

    get document() {
        return this.view.doc;
    }

    set document(d: IvDocument) {
        this.view.doc = d;
    }

    get api(): any | undefined {
        if (!this.tplApi) {
            if (this.hasCtlClass) {
                let ctl = this.controller;
                if (ctl && ctl.$api) {
                    this.tplApi = ctl.$api;
                }
            } else if (this.$Class) {
                this.tplApi = new this.$Class();
                initApi(this.view, this.tplApi, this.staticCache);
            } else if (this.$contextIdentifiers) {
                this.tplApi = createDictionary();
            } else {
                this.tplApi = {};
            }
        }
        return this.tplApi;
    }

    get controller(): TemplateController | undefined {
        if (!this.tplCtl && this.hasCtlClass) {
            let ctl = this.tplCtl = new this.$Class!();
            if (hasProperty(ctl, PROP_TEMPLATE)) {
                ctl[PROP_TEMPLATE] = this;
            }
            if (hasProperty(ctl, PROP_LOGGER)) {
                let v = this.view;
                ctl[PROP_LOGGER] = <IvLogger>{
                    log: logger.log,
                    error(msg: string, ...optionalParams: any[]) {
                        error(v, msg + (optionalParams.length ? " " + optionalParams.join(" ") : ""));
                    }
                };
            }
            if (ctl[PROP_API]) {
                initApi(this.view, ctl[PROP_API], this.staticCache);
            }
        }
        return this.tplCtl;
    }

    attach(element: any) {
        if (!this.view.rootDomNode) {
            let ctxt = this.view;
            if (!ctxt.doc) throw new Error("[iv] Template.document must be defined before calling Template.attach()");
            ctxt.rootDomNode = element;
            ctxt.anchorNode = ctxt.doc.createComment("template anchor"); // used as anchor in the parent domNode
            appendChild(ctxt.anchorNode, element, 1);
        } else {
            error(this.view, "Template host cannot be changed once set");
        }
        return this;
    }

    registerLabel(label: string, object: any) {
        if (!this.labels) {
            this.labels = {};
        }
        let target = this.labels[label];
        if (!target) {
            target = this.labels[label] = [object];
        } else {
            target.push(object);
        }
    }

    /**
     * Return the first element labelled as per the argument
     * e.g. for <div #foo/> -> query("#foo") will return the DIV DOM element
     * @param label 
     * @return the DOM element or the Component api or null if nothing is found
     */
    query(selector: string, all: boolean = false): any | any[] | null {
        if (this.rendering) return null; // query cannot be used during template rendering
        const labels = selector.split(';');
        let result: any[] = [];
        for (const label of labels) {
            if (label && label.charAt(0) !== '#') {
                error(this.view, "[$template.query()] Invalid label argument: '" + label + "' (labels must start with #)");
                return null;
            }
            let target = this.labels ? this.labels[label] || null : null;
            if (target && target.length) {
                if (!all) return target[0];
                result = result.concat(target);
            }
        }
        return result.length ? result : null;
    }

    notifyChange() {
        this.render();
    }

    disconnectObserver() {
        if (this.activeWatch) {
            unwatch(this.api, this.watchCb);
            unwatch(this.controller, this.watchCb);
            this.activeWatch = false;
        }
    }

    render(data?: any, forceRefresh = false) {
        if (this.processing) return this;
        if (forceRefresh) {
            this.forceRefresh = true;
        }
        this.processing = true;
        // console.log('render', this.uid)
        const api = this.api, ctl = this.controller, view = this.view, ctxtIds = this.$contextIdentifiers;

        if (ctl && !isDataObject(ctl)) {
            error(view, "Template controller must be a @Controller Object - please check: " + this.$Class!.name);
            this.tplCtl = this.$Class = undefined;
        }

        let refreshContext = false;
        if (api && data) {
            if (ctxtIds !== U) {
                // $fragment mode
                let context = data["context"];
                if (context !== U && typeof context === "object") {
                    refreshContext = true;

                }
            } else {
                if (!isMutating(api)) {
                    createNewRefreshContext();
                }
                this.disconnectObserver();
                // inject data into params
                for (let k in data) if (data.hasOwnProperty(k)) {
                    api[k] = data[k];
                }
            }
        }
        if (this.$contextInitialized) {
            refreshContext = true;
        }
        if (refreshContext) {
            let nm = "", context = (data ? data["context"] : null) || api["$context"];
            // copy context values into api
            if (context) {
                for (let i = 0; ctxtIds!.length > i; i++) {
                    nm = ctxtIds![i];
                    api[nm] = context[nm];
                }
                api["$context"] = context; // if context is a trax dictionary, the template will be automatically refreshed
                this.$contextInitialized = true;
            }
        }
        if (ctxtIds !== U && !this.$contextInitialized) {
            error(view, "Missing $fragment context");
        }
        let bypassRender = !this.forceRefresh, nodes = view.nodes;
        if (!nodes || !nodes[0] || !(nodes[0] as IvNode).attached) {
            bypassRender = false; // internal blocks may have to be recreated if root is not attached
        }
        if (bypassRender && version(api) + version(ctl) > this.lastRefreshVersion) {
            bypassRender = false;
        }
        if (!bypassRender) {
            // console.log(">>>>>>>>>>>>>>>>> REFRESH uid:", this.uid, "lastRefreshVersion:", this.lastRefreshVersion, "forceRefresh: ", this.forceRefresh);
            if (ctl) {
                if (!this.initialized) {
                    callLcHook(view, ctl, "$init", "controller");
                    this.initialized = true;
                }
                callLcHook(view, ctl, "$beforeRender", "controller");
            }
            this.rendering = true;
            this.labels = undefined;
            view.lastRefresh++;
            view.instructions = undefined;
            try {
                this.renderFn(view, this.hasCtlClass ? ctl : api, api, this);
            } catch (ex) {
                error(view, "Template execution error\n" + (ex.message || ex));
            }

            this.rendering = false;

            if (ctl) {
                // changes in $afterRender() cannot trigger a new render to avoid infinite loops
                callLcHook(view, ctl, "$afterRender", "controller");
            }
            commitChanges(api); // will change p or state version
            this.forceRefresh = false;
            this.lastRefreshVersion = version(api) + version(ctl);
        }

        if (!this.activeWatch) {
            watch(api, this.watchCb);
            if (ctl) {
                watch(ctl, this.watchCb);
            }
            this.activeWatch = true;
        }
        this.processing = false;
        return this;
    }
}

/**
 * Initializes the api object (e.g. event Emitters)
 * @param api 
 * @param staticCache 
 */
function initApi(view: IvView, api: Object, staticCache: Object) {
    let events: string[] | null | undefined = staticCache["events"];
    if (events === undefined) {
        // first time call - scan api object to look for event emitters
        let arr: string[] | undefined;
        for (let k in api) {
            if (k.match(RX_EVENT_EMITTER)) {
                let eventName = RegExp.$1;
                if (!arr) {
                    arr = [];
                }
                if (typeof api[eventName + "Emitter"]["init"] !== "function") {
                    error(view, "Invalid EventEmitter: " + eventName + "Emitter");
                } else {
                    arr.push(eventName + "Emitter");
                    arr.push(eventName);
                    api[eventName + "Emitter"].init(eventName, api);
                }
            }
        }
        staticCache["events"] = arr ? arr : null;
    } else if (events !== null) {
        let len = events.length;
        // events contains event emitter names / event name - e.g. ["clickEmitter", "click", "hoverEmitter", "hover"]
        for (let i = 0; len > i; i += 2) {
            api[events[i]].init(events[i + 1], api);
        }
    }
}

function callLcHook(view: IvView, hookHolder: any, hook: "$init" | "$render" | "$beforeRender" | "$afterRender" | "$dispose", context: string) {
    // life cycle hook
    if (hookHolder && typeof hookHolder[hook] === "function") {
        let res: any;
        try {
            res = hookHolder[hook]!();
            if (res !== undefined && typeof res.catch === "function") {
                (res as Promise<any>).catch((err) => {
                    error(view, context + " " + hook + " hook execution error\n" + (err.message || err));
                });
            }
        } catch (ex) {
            error(view, context + " " + hook + " hook execution error\n" + (ex.message || ex));
        }
    }
}

// member of the view object
function ViewCreateElement(this: IvView, name: string, namespace?: string): any {
    namespace = namespace || this.namespace;
    if (namespace) {
        return this.doc.createElementNS(namespace, name);
    }
    return this.doc.createElement(name);
}

// member of the view object
function ViewIsEmpty(this: IvView) {
    let r = isViewEmpty(this);
    // console.log(":: view.isEmpty:", r, "for", this.uid);
    return r;
}

function isViewEmpty(v?: IvView | null) {
    if (v !== U && v !== null) {
        let isEmpty = true;

        scanDomNodes(v, false, function (n: IvView | IvNode) {
            if (!isEmpty) {
                return false; // stop scan
            }
            let k = n.kind;
            if (k === "#view") {
                let nv = n as IvView;
                if (nv.cm) {
                    // we need to define an append function with a document fragment
                    let df = nv.doc.createDocumentFragment();
                    nv.domNode = df;
                    nv.cmAppends = [function (n: IvNode) {
                        if (n.domNode) {
                            appendChild(n.domNode, df, 2);
                        } else {
                            n.domNode = df;
                        }
                    }];
                }
                runInstructions(nv);
            } else if (k === "#element" || k === "#text") {
                // console.log(":: not empty because of", n.uid);
                return isEmpty = false;
            }
            return true; // continue scan
        });
        return isEmpty;
    }
    return true;
}

export function createView(parentView: IvView | null, container: IvContainer | null, srcUID: number, template?: IvTemplate): IvView {
    // srcUID is a unique number to help debugging
    let view: IvView = {
        kind: "#view",
        uid: "view" + (++uidCount),
        attached: false,
        nodes: null,
        namespace: undefined,
        namespaces: undefined,
        doc: null as any,
        parentView: parentView,
        cm: true,
        cmAppends: null,
        lastRefresh: 0,
        container: null,
        projectionHost: null,
        template: template,
        rootDomNode: null,
        anchorNode: null,
        expressions: undefined,
        oExpressions: undefined,
        instructions: undefined,
        paramNode: undefined,
        createElement: ViewCreateElement,
        isEmpty: ViewIsEmpty
    }
    // console.log(":: createView: " + view.uid + " - called from " + srcUID);
    if (parentView) {
        setParentView(view, parentView, container);
    } else {
        view.doc = (typeof document !== "undefined") ? document as any : null as any;
    }
    return view;
}

/**
 * Register a labelled object (e.g. DOM node, component, decorator...) on the view template
 * @param v 
 * @param object the object to register on the labels
 * @param labels array of names, forward indicator (e.g. ["#header", 0, "#buttons", 1])
 */
function registerLabels(v: IvView, object: any, labels?: any[] | 0) {
    if (labels) {
        // get the template view
        let view = getTemplateView(v);
        if (view !== U && view !== null) {
            let tpl = view.template!, len = labels.length;
            for (let i = 0; len > i; i++) {
                (tpl as Template).registerLabel(labels[i], object);
            }
        }
    }
}

function registerLabel(v: IvView, object: any, label: any | 0) {
    if (label !== 0) {
        // get the template view
        let view = getTemplateView(v);
        if (view !== U && view !== null) {
            (view.template! as Template).registerLabel(label, object);
        }
    }
}

function getTemplateView(v: IvView): IvView | null {
    let view: IvView | null = v;
    while (view && !view.template) {
        view = view.parentView;
    }
    return view!;

}

function setParentView(v: IvView, pv: IvView, container: IvContainer | null) {
    v.parentView = pv;
    v.doc = pv.doc;
    v.container = container;
    v.rootDomNode = pv.rootDomNode;
    if (pv.namespace) {
        let ns = pv.namespace;
        v.namespace = ns;
        v.namespaces = [ns];
    }
}

/**
 * Placeholder function - will replace with ζt(...) at compilation time
 * @param template 
 */
export function $template(tsa: TemplateStringsArray): () => IvTemplate {
    return function () {
        return new Template("", "", {}, () => { })
    }
};


/**
 * Template runtime factory
 * cf. sample code generation in generator.spec
 * @param renderFn 
 */
export function ζt(tplName: string, tplFile: string, staticCache: Object, renderFn: (ζ: any, $: any, $api: any, $template: IvTemplate) => void, argumentClass?: any, contextIdentifiers?: string[]): () => IvTemplate {
    return function () {
        return new Template(tplName, tplFile, staticCache, renderFn, argumentClass, contextIdentifiers);
    }
}

/**
 * Unchanged symbol
 * Used as a return value for expressions (cf. ζe) to notify that a value hasn't changed
 */
export const ζu = []; // must be an array to be used for undefined statics

// ----------------------------------------------------------------------------------------------
// Runtime instructions

// Root view initialization
// e.g. let ζc = ζinit(ζ, ζs0, 2);
export function ζinit(v: IvView, staticCache: Object, nbrOfNodes: number): boolean {
    // staticCache is an object that can be used to hold class-level cached data
    let cm = v.cm;
    if (cm) {
        v.nodes = new Array(nbrOfNodes);
        if (!v.cmAppends) {
            // cmAppends is already defined when the template is called from another template
            v.cmAppends = [];
            if (v.anchorNode) {
                // this is the root template
                v.cmAppends[0] = function (n: IvNode, domOnly: boolean) {
                    // console.log("cmAppends #1");
                    if (n.domNode) {
                        insertBefore(n.domNode, v.anchorNode, v.rootDomNode, 1);
                    } else {
                        n.domNode = v.rootDomNode;
                    }
                }
            }
        }
    } else {
        v.cmAppends = null;
    }
    return cm;
}

// Sub-view creation
// e.g. ζ1 = ζview(ζ, 0, 1, 2, ++ζi1);
export function ζview(pv: IvView, iFlag: number, containerIdx: number, nbrOfNodes: number, instanceIdx: number) {
    // retrieve container to get previous view
    // container must exist otherwise the view cannot be retrieved
    let cn = pv.nodes![containerIdx], view: IvView;
    if (!cn || !cn.attached) {
        error(pv, "Invalid ζview call: container must be attached (" + (cn ? cn.uid : "XX") + ") - pview: " + pv.uid + " containerIdx: " + containerIdx);
    }
    if (cn.kind === "#container") {
        // console.log(":: ζview - parent:", pv.uid)
        if ((cn as IvContainer).subKind === "##block") {
            let cnt = cn as IvBlockContainer, views = cnt.views;
            if (instanceIdx === 1) {
                cnt.insertFn = null;
            }
            // console.log("ζview", cnt.uid, instanceIdx, cnt.domNode === undefined)
            if (instanceIdx === 1 && cnt.views.length > 1) {
                // previous views are moved to the view pool to be re-used if necessary
                cnt.previousNbrOfViews = views.length;
                view = views.shift()!;
                if (cnt.viewPool.length) {
                    cnt.viewPool = views.concat(cnt.viewPool);
                } else {
                    cnt.viewPool = views;
                }
                cnt.views = [view];
                // this view was already attached so doesn't need to be inserted again
            } else {
                view = cnt.views[instanceIdx - 1];
                if (!view) {
                    if (cnt.viewPool.length > 0) {
                        if (!cnt.insertFn) {
                            cnt.insertFn = getViewInsertFunction(pv, cnt);
                        }
                        view = views[instanceIdx - 1] = cnt.viewPool.shift()!;
                        // console.log(":: view: retrieve from pool: ", view.uid, "from", cnt.uid);
                        insertInDom(view.nodes![0], cnt.insertFn, 1);
                        view.attached = true;
                    } else {
                        view = views[instanceIdx - 1] = createView(pv, cnt, 2);
                        view.nodes = new Array(nbrOfNodes);
                        if (pv.cm && cnt.cmAppend) {
                            view.cmAppends = [cnt.cmAppend];
                        } else if (!pv.cm) {
                            view.cmAppends = [getViewInsertFunction(pv, cnt)];
                        }
                    }
                }
            }
            cnt.lastRefresh = view.lastRefresh = pv.lastRefresh;
        } else {
            // in this case cn is a component container and iFlag > 0
            // console.log("view: get content view #1", pv.uid);
            let cnt = cn as IvCptContainer;
            view = cnt.contentView!;
            if (!view) {
                view = cnt.contentView = createView(pv, cnt, 3);
                view.nodes = new Array(nbrOfNodes);
            }
            // cmAppends will be already defined in ζins() as the current view is deferred
            view.lastRefresh = pv.lastRefresh;
        }
    } else if (cn.kind === "#param") {
        // cn is a param node
        let pn = cn as IvParamNode;
        // console.log("view: get content view #2", pv.uid);
        view = pn.contentView!;
        if (!view) {
            view = pn.contentView = createView(pv, null, 4);
            if (pn.viewPool) {
                pn.viewPool[pn.viewInstanceIdx] = view;
            }
            view.nodes = new Array(nbrOfNodes);
            view.paramNode = pn;
        }
        view.lastRefresh = pv.lastRefresh
    }
    return view!;
}

export function ζviewD(pv: IvView, iFlag: number, containerIdx: number, nbrOfNodes: number, instanceIdx: number, view?: IvView) {
    // console.log(":: ζviewD")
    let v = view || ζview(pv, iFlag, containerIdx, nbrOfNodes, instanceIdx);

    // reset instructions
    if (iFlag === 1) {
        v.instructions = [];
    } else {
        let v2 = v, h = iFlag - 1;
        while (h > 0) {
            v2 = v2.parentView!;
            h--;
        }
        if (!v2.instructions) {
            v2.instructions = [];
        }
        v.instructions = v2.instructions;
    }
    if (v.cm && !v.cmAppends) {
        addInstruction(v, initView, [v, pv, containerIdx]);
    }
    return v;
}

function initView(v: IvView, parentView: IvView, containerIdx: number) {
    // initialize cmAppend when view has been created in a deferred context
    // i.e. container was created with cntD and its cmAppend was not defined
    let cn = parentView.nodes![containerIdx];
    if (cn.kind === "#container" && !v.cmAppends && (cn as IvContainer).cmAppend) {
        // console.log("initView:", v.uid, "container:", cn.uid)
        v.cmAppends = [(cn as IvContainer).cmAppend!];
    }
}

function addInstruction(v: IvView, func: Function, args: any[]) {
    // console.log("addInstruction in", v.uid, " -> ", func.name);
    v.instructions!.push(func);
    v.instructions!.push(args);
}

function runInstructions(v: IvView) {
    // console.log(":: runInstructions in", v.uid, "instructions count = ", v.instructions ? v.instructions.length / 2 : 0)
    if (v.instructions) {
        let instr = v.instructions.slice(0), len = instr.length;
        v.instructions.splice(0, len); // empty the array (may be referenced by multiple views)
        v.instructions = undefined;
        if (len) {
            for (let i = 0; len > i; i += 2) {
                // console.log("::    -> run instruction #" + (i / 2), instr[i].name);
                instr[i].apply(null, instr[i + 1]);
            }
        }
    }
}

function getViewInsertFunction(pv: IvView, cnt: IvContainer | IvFrgNode) {
    // determine the append mode
    let { position, nextDomNd, parentDomNd } = findNextSiblingDomNd(pv, cnt);
    // console.log(`:: findNextSiblingDomNd of ${cnt.uid} position=${position} nextDomNd=${nextDomNd ? nextDomNd.uid : "XX"} parentDomNd=${parentDomNd ? parentDomNd.uid : "XX"}`)
    if (position === "beforeChild" || position === "lastOnRoot") {
        return function (n: IvNode, domOnly: boolean) {
            // console.log("cmAppends #2.1", n.uid, domOnly);
            if (n.domNode) {
                insertBefore(n.domNode, nextDomNd, parentDomNd, 2);
            } else {
                n.domNode = parentDomNd;
            }
        };
    } else if (position === "lastChild") {
        return function (n: IvNode, domOnly: boolean) {
            // console.log("cmAppends #2.2", n.uid, domOnly);
            if (n.domNode) {
                appendChild(n.domNode, parentDomNd, 3);
            } else {
                n.domNode = parentDomNd;
            }
        };
    } else {
        return function () {
            // console.log("cmAppends #2.3");
            console.warn("TODO: VALIDATE VIEW APPEND: ", position)
            logView(pv, "getViewInsertFunction for " + cnt.uid)
        }
    }
}

/**
 * Delete container content
 */
function checkContainer(v: IvView, idx: number, firstTime: boolean) {
    let container = v.nodes![idx] as IvContainer;
    if (!container || container.subKind !== "##block") return; // happens when block condition has never been true
    let bc = container as IvBlockContainer, lastRefresh = bc.lastRefresh;
    // console.log(":: checkContainer", container.uid, "in=", v.uid, idx, "container.lastRefresh=", lastRefresh, "v.lastRefresh=", v.lastRefresh, "firstTime:", firstTime);

    if (!firstTime && lastRefresh !== v.lastRefresh) {
        // remove all nodes from DOM
        removeFromDom(v, bc);
    } else {
        let views = bc.views, nbrOfViews = views.length;
        if (!firstTime) {
            // console.log("previousNbrOfViews", bc.previousNbrOfViews, "nbrOfViews", nbrOfViews);
            if (nbrOfViews !== bc.previousNbrOfViews) {
                // disconnect the nodes that are still attached in the pool
                let pool = bc.viewPool, len = pool.length, view: IvView;
                for (let i = 0; len > i; i++) {
                    view = pool[i];
                    removeFromDom(view, view.nodes![0]);
                    view.attached = false;
                }
            }
            bc.previousNbrOfViews = nbrOfViews; // all views are immediately inserted
        }
    }
}

function insertInDom(nd: IvNode, insertFn: (n: IvNode, domOnly: boolean) => void, origin: number) {
    // this function can only be called when cm = false
    // note: origin is only used for debug purposes
    // console.log("insertInDom", origin, nd.attached, nd.domNode.uid)
    if (nd.attached) return;
    insertFn(nd, true);
    nd.attached = true;
    if (nd.kind === "#fragment") {
        let f = nd as IvFrgNode, ch = f.firstChild;
        while (ch) {
            insertInDom(ch, insertFn, 4);
            ch = ch.nextSibling;
        }
    } else if (nd.kind === "#container") {
        let k = (nd as IvContainer).subKind;
        if (k === "##cpt") {
            let cc = nd as IvCptContainer, tpl = cc.template as Template, root = tpl ? tpl.view.nodes![0] : null;
            if (tpl) {
                // console.log("forceRefresh #1");
                tpl.forceRefresh = true;
            }
            if (root) {
                insertInDom(root, insertFn, 5);
                tpl.view.attached = true;
            }
        } else if (k === "##block") {
            let cb = nd as IvBlockContainer, views = cb.views;
            for (let i = 0; views.length > i; i++) {
                insertInDom(views[i].nodes![0], insertFn, 6);
                views[i].attached = true;
            }
        }
    }
    if (nd.kind === "#fragment" || nd.kind === "#element") {
        let cv = (nd as IvFrgNode | IvEltNode).contentView;
        if (cv) {
            insertInDom(cv.nodes![0], insertFn, 7);
            cv.attached = true;
        }
    }
}

// End view
// e.g. ζend(ζ, ζc, 0)
export function ζend(v: IvView, cm: boolean, containerIndexes?: (number[] | 0)) {
    // console.log(":: ζend view", v.uid, containerIndexes)
    if (containerIndexes) {
        let len = containerIndexes.length;
        for (let i = 0; len > i; i++) {
            checkContainer(v, containerIndexes[i], v.cm);
        }
    }
    if (!v.cm) return;

    v.cm = false;
    v.cmAppends = null;
}

export function ζendD(v: IvView, cm: boolean, containerIndexes?: (number[] | 0)) {
    if (v.paramNode) {
        let pn = v.paramNode;
        if (!pn.dataHolder) {
            error(v, "ζendD dataHoler should be defined");
        } else {
            addInstruction(v, ζend, [v, cm, containerIndexes]);
            if (!pn.data || pn.data.kind === "#view") {
                // paramNode is associated to an IvContent param
                pn.dataHolder[pn.dataName] = v;
            } else if (pn.data) {
                pn.data["$content"] = v;
            } else {
                console.warn("TODO: ζendD no data")
            }
        }
    } else {
        addInstruction(v, ζend, [v, cm, containerIndexes]);
    }
}

function finalizeParamNode(v: IvView) {
    let pn = v.paramNode;
    if (!pn) return;
    if (!pn.data || pn.data.kind === "#view") {
        // paramNode is associated to an IvContent param
        pn.dataHolder[pn.dataName] = v
    } else if (pn.data) {
        pn.data["$content"] = v;
    } else {
        console.warn("TODO: ζendD no data")
    }
}

// Element creation function
// e.g. ζelt(ζ, ζc, 0, 0, 0, "div", 1);
export function ζelt(v: IvView, cm: boolean, idx: number, parentLevel: number, name: string, hasChildren: 0 | 1, labels?: any[] | 0, staticAttributes?: any[] | 0, staticProperties?: any[] | 0) {
    if (!cm) {
        if (labels) {
            registerLabels(v, v.nodes![idx].domNode, labels);
        }
        return;
    }
    let e = v.createElement(name);

    if (staticAttributes) {
        const len = staticAttributes.length;
        for (let i = 0; len > i; i += 2) {
            e.setAttribute(staticAttributes[i], staticAttributes[i + 1]);
            // setAttribute(e, staticAttributes[i], staticAttributes[i + 1]);
        }
    }
    if (staticProperties) {
        let len = staticProperties.length;
        for (let j = 0; len > j; j += 2) {
            e[staticProperties[j]] = staticProperties[j + 1];
        }
    }
    let nd: IvEltNode = {
        kind: "#element",
        uid: "elt" + (++uidCount),
        idx: idx,
        parentIdx: -1,
        ns: "",
        domNode: e,
        attached: true,            // always attached when created
        nextSibling: undefined,
        firstChild: undefined,
        lastChild: undefined,
        contentView: null
    }
    v.nodes![idx] = nd;
    registerLabels(v, e, labels);
    v.cmAppends![parentLevel]!(nd, false); // append in the parent DOM
    if (hasChildren) {
        v.cmAppends![parentLevel + 1] = function (n: IvNode, domOnly: boolean) {
            // console.log("cmAppends #3");
            if (n.domNode) {
                appendChild(n.domNode, e, 4);
            } else {
                n.domNode = e;
            }
            if (!domOnly) {
                appendChildToNode(nd, n);
            }
        }
    }
}

export function ζeltD(v: IvView, cm: boolean, idx: number, parentLevel: number, name: string, hasChildren: 0 | 1, labels?: any[] | 0, staticAttributes?: any[], staticProperties?: any[]) {
    if (!cm) return;
    addInstruction(v, ζelt, [v, cm, idx, parentLevel, name, hasChildren, labels, staticAttributes, staticProperties]);
}

// e.g. start: ζxmlns(ζ, 0, 1, "http://www.w3.org/2000/svg");
// or end: ζxmlns(ζ, 0, 0);
export function ζxmlns(v: IvView, iFlag: number, ns?: string) {
    // if ns is provided, it is the start of a new xmlns section / otherwise it is the end
    if (ns) {
        // start
        if (v.namespaces) {
            v.namespaces.push(ns);
        } else {
            v.namespaces = [ns];
        }
        v.namespace = ns;
    } else {
        // end
        let len = v.namespaces!.length;
        if (len === 1) {
            v.namespace = v.namespaces = undefined;
        } else {
            v.namespaces!.pop();
            v.namespace = v.namespaces![len - 2];
        }
    }
}

export function ζxmlnsD(v: IvView, iFlag: number, ns?: string) {
    addInstruction(v, ζxmlns, [v, iFlag, ns]);
}

function appendChildToNode(p: IvParentNode, child: IvNode) {
    if (!p.firstChild) {
        p.firstChild = p.lastChild = child;
        child.nextSibling = undefined;
    } else {
        p.lastChild!.nextSibling = child
        p.lastChild = child;
    }
    child.parentIdx = p.idx;
}

// Text creation function
// e.g. ζtxt(ζ, ζc, 0, 1, 1, " Hello World ", 0);
export function ζtxt(v: IvView, cm: boolean, iFlag: number, idx: number, parentLevel: number, labels: any[] | 0, statics: string | string[], nbrOfValues: number, ...values: any[]) {
    // console.log("ζtxt", idx, nbrOfValues);
    let nd: IvText;
    if (!nbrOfValues) {
        // static node: nbrOfValues === 0
        if (!cm) {
            if (labels) registerLabels(v, v.nodes![idx].domNode, labels);
            return;
        }
        nd = createNode(v.doc.createTextNode(statics as string), undefined);
        registerLabels(v, nd.domNode, labels);
    } else {
        // dynamic node
        let pieces: string[], val: any, changed = false;
        if (cm) {
            pieces = (statics as string[]).slice(0);
        } else {
            nd = v.nodes![idx] as IvText;
            pieces = nd.pieces!;
        }
        for (let i = 0; nbrOfValues > i; i++) {
            val = getExprValue(v, iFlag, values[i]);
            if (val !== ζu) {
                changed = true;
                pieces![1 + i * 2] = (val === null || val === undefined) ? "" : val;
            }
        }

        if (cm) {
            // console.log("create text node ", pieces.join(""));
            nd = createNode(v.doc.createTextNode(pieces.join("") as string), pieces);
            registerLabels(v, nd.domNode, labels);
        } else {
            if (changed) {
                // console.log("set ", idx, nd!.uid, nd!.domNode.uid, pieces.join(""))
                nd!.domNode.textContent = pieces.join("");
            }
            registerLabels(v, nd!.domNode, labels);
            return;
        }
    }

    v.nodes![idx] = nd;
    v.cmAppends![parentLevel]!(nd, false); // append in the parent DOM

    function createNode(domNode, pieces): IvText {
        return {
            kind: "#text",
            uid: "txt" + (++uidCount),
            domNode: domNode,
            attached: true,
            idx: idx,
            parentIdx: -1,
            pieces: pieces,
            nextSibling: undefined
        }
    }
}

export function ζtxtD(v: IvView, cm: boolean, iFlag: number, idx: number, parentLevel: number, labels: any[] | 0, statics: string | string[], nbrOfValues: number, ...values: any[]) {
    let args = [v, cm, iFlag, idx, parentLevel, labels, statics, nbrOfValues]
    for (let i = 0; nbrOfValues > i; i++) {
        args.push(values[i]);
    }
    addInstruction(v, ζtxt, args);
}

// Expression binding
// e.g. ζe(ζ, 0, name)
export function ζe(v: IvView, idx: number, value: any) {
    if (!v.expressions) {
        // first time, expression is considered changed
        v.expressions = [];
        v.expressions[idx] = value;
    } else {
        let exp = v.expressions;
        //console.log("ζe", idx, value, exp)
        if (exp.length > idx && exp[idx] === value) return ζu;
        exp[idx] = value;
    }
    return value;
}

function getExprValue(v: IvView, iFlag: number, exprValue: any) {
    // exprValue is an array if instHolderIdx>0 as expression was deferred
    if (iFlag) {
        if (exprValue[2]) {
            let exprs = v.oExpressions!;
            // one-time expression
            if (exprs[2 * exprValue[0]]) {
                // already read
                return ζu;
            }
            exprs[2 * exprValue[0]] = 1;
            return exprValue[1];
        }
        return ζe(v, exprValue[0], exprValue[1]);
    }
    return exprValue;
}

// One-time expression evaluation
// e.g. ζo(ζ, 0, ζc? name : ζu)
export function ζo(v: IvView, idx: number, value: any, iFlag?: number): any {
    let exprs = v.oExpressions;
    if (!exprs) {
        exprs = v.oExpressions = [];
    }
    if (iFlag) {
        if (!exprs[2 * idx]) {
            // list of read, result
            // where read = 0 | 1
            // and result = [idx, value, 1]
            let res = [idx, value, 1]
            exprs[2 * idx] = 0;
            exprs[1 + 2 * idx] = res;
            return res;
        } else {
            return exprs[1 + 2 * idx];
        }
    } else {
        if (!exprs[2 * idx]) {
            exprs[2 * idx] = 1;
            return value;
        }
        return ζu;
    }
}

// Fragment creation function
// e.g. 
export function ζfra(v: IvView, cm: boolean, idx: number, parentLevel: number) {
    if (!cm) return;
    let nd: IvFrgNode = {
        kind: "#fragment",
        uid: "fra" + (++uidCount),
        idx: idx,
        parentIdx: -1,
        ns: "",
        domNode: undefined,
        attached: true,            // always attached when created
        nextSibling: undefined,
        firstChild: undefined,
        lastChild: undefined,
        contentView: null
    }
    v.nodes![idx] = nd;
    let parentCmAppend0 = v.cmAppends![parentLevel]!;
    parentCmAppend0(nd, false);
    v.cmAppends![parentLevel + 1] = function (n: IvNode, domOnly: boolean) {
        // console.log("cmAppends #4 ", n.uid, domOnly);
        parentCmAppend0(n, true);
        if (!domOnly) {
            appendChildToNode(nd, n);
        }
    }
}

export function ζfraD(v: IvView, cm: boolean, idx: number, parentLevel: number) {
    addInstruction(v, ζfra, [v, cm, idx, parentLevel]);
}

// Container creation
// e.g. ζcnt(ζ, ζc, 1, 1, 1);
export function ζcnt(v: IvView, cm: boolean, idx: number, parentLevel: number, type: number) {
    if (!cm) return;
    let nd = createContainer(idx, null, type)!;
    v.nodes![idx] = nd;
    initContainer(v, nd, parentLevel);
    return nd;
}

export function createContainer(idx: number, cmAppend: null | ((n: IvNode, domOnly: boolean) => void), type: number): IvContainer | null {
    let nd: IvContainer;
    if (type === 1) {
        // block container
        nd = <IvBlockContainer>{
            kind: "#container",
            subKind: "##block",
            uid: "cnb" + (++uidCount),
            idx: idx,
            parentIdx: -1,
            ns: "",
            domNode: undefined,
            attached: true,            // always attached when created
            nextSibling: undefined,
            views: [],
            viewPool: [],
            cmAppend: cmAppend,
            lastRefresh: 0,
            previousNbrOfViews: 0,
            insertFn: null
        };
    } else if (type === 2) {
        // cpt container
        nd = <IvCptContainer>{
            kind: "#container",
            subKind: "##cpt",
            uid: "cnc" + (++uidCount),
            idx: idx,
            parentIdx: -1,
            ns: "",
            domNode: undefined,
            attached: true,            // always attached when created
            nextSibling: undefined,
            cmAppend: cmAppend,
            cptRef: null,
            template: null,         // current component template
            data: null,           // shortcut to cptTemplate.params
            contentView: null,
            dynamicParams: undefined
        }
        // console.log("container created", nd.uid);
    } else {
        console.warn("TODO: new cnt type");
        return null;
    }
    return nd;
}

function initContainer(v: IvView, container: IvContainer, parentLevel: number) {
    // called when
    if (v.cmAppends) {
        let parentCmAppend = v.cmAppends![parentLevel]!;
        if (parentCmAppend) {
            container.cmAppend = function (n: IvNode, domOnly: boolean) {
                // console.log("initContainer: append", n.uid, n.domNode ? n.domNode.uid : "XX", "parentLevel:", parentLevel, "in", v.uid, "(container: " + container.uid + ")");
                parentCmAppend(n, true); // append container content
            };
            parentCmAppend(container, false); // append container in parent view
        } else {
            console.log("ERROR?", parentCmAppend === U)
        }

    }
}

export function ζcntD(v: IvView, cm: boolean, idx: number, parentLevel: number, type: number) {
    if (!cm) return;
    let nd = createContainer(idx, null, type)!;
    v.nodes![idx] = nd;
    addInstruction(v, initContainer, [v, nd, parentLevel]);
}


// Component Definition (& call if no params and no content)
// e.g. ζcpt(ζ, ζc, 2, 0, ζe(ζ, 0, alert), 1, ζs1);
export function ζcpt(v: IvView, cm: boolean, iFlag: number, idx: number, parentLevel: number, exprCptRef: any, callImmediately: number, labels?: any[] | 0, staticParams?: any[] | 0, dynParamNames?: string[]) {
    let container: IvCptContainer;
    // console.log("ζcpt", cm, v.uid, "idx: " + idx, exprCptRef)
    iFlag = iFlag || 0;
    if (cm) {
        // creation mode: create cpt container if not already done in ζcptD
        container = (v.nodes![idx] as IvCptContainer) || ζcnt(v, cm, idx, parentLevel, 2) as IvCptContainer;
    } else {
        // update mode
        container = v.nodes![idx] as IvCptContainer;

        // if contains list params, reset the tempLists
        if (container.lists) {
            container.lists.sizes = {};
        }
    }

    const cptRef = getExprValue(v, iFlag, exprCptRef);
    if (!container.template) {
        // even if we are in cm we could already have gone through this code if component is deferred
        // cf. ζcptD - in which case the template will be defined
        if (cptRef === ζu) {
            error(v, "Invalid component ref")
            return;
        }
        instantiateCpt();
    } else if (cptRef !== ζu && container.cptRef !== cptRef) {
        // dispose previous template and create new one
        const prevApi = container.data;
        (container.template as Template).dispose(true);
        // cleanup previous container?
        instantiateCpt();
        // transfer values from old api to new api
        const newApi = container.data;
        for (let propName in prevApi) {
            if (prevApi.hasOwnProperty(propName) && propName.match(RX_TRAX_PROP_NAME)) {
                const nm = RegExp.$1;
                if (hasProperty(newApi, nm)) {
                    // console.log("ζcpt transfer api param: " + nm);
                    newApi[nm] = prevApi[nm];
                }
            }
        }
    }

    if (dynParamNames) {
        container.dynamicParams = {};
    }
    if (iFlag === 0 && callImmediately) {
        // callImmediately will be true if there are no child elements
        // even if iFlag>0
        ζcall(v, idx, container, labels, dynParamNames);
    }

    function instantiateCpt() {
        const tpl: Template = container.template = cptRef()!;
        container.cptRef = cptRef;
        setParentView(tpl.view, v, container);
        tpl.disconnectObserver();
        container.data = tpl.api;
        updateStaticParams(tpl.api);
    }

    function updateStaticParams(api: any) {
        if (staticParams) {
            // initialize static params
            let len = staticParams.length;
            if (!api && len) {
                error(v, "Invalid parameter: " + staticParams[0]);
            } else {
                for (let i = 0; len > i; i += 2) {
                    if (hasProperty(api, staticParams[i])) {
                        api[staticParams[i]] = staticParams[i + 1];
                    } else {
                        error(v, "Invalid parameter: " + staticParams[i])
                    }
                }
            }
        }
    }
}

export function ζcptD(v: IvView, cm: boolean, iFlag: number, idx: number, parentLevel: number, exprCptRef: any, callImmediately: number, labels?: any[] | 0, staticParams?: any[] | 0, dynParamNames?: string[]) {
    // component will be created to hold data nodes - but not fully initialized
    ζcpt(v, cm, iFlag, idx, parentLevel, exprCptRef, callImmediately, labels, staticParams, dynParamNames);
    addInstruction(v, initContainer, [v, v.nodes![idx], parentLevel]);
    if (callImmediately) {
        addInstruction(v, ζcall, [v, idx, 0, labels, dynParamNames]);
    }
}

// Component call - used when a component has content, params or param nodes
export function ζcall(v: IvView, idx: number, container?: IvCptContainer | 0, labels?: any[] | 0, dynParamNames?: string[]) {
    container = container || v.nodes![idx] as IvCptContainer;
    let tpl = container ? container.template as Template : undefined;
    if (tpl !== undefined) {
        tpl.view.lastRefresh = v.lastRefresh - 1; // will be incremented by refresh()

        cleanDataLists(container);

        if (container.contentView) {
            tpl.api.$content = container.contentView;
            let instr = container.contentView.instructions;
            if (instr && instr.length) {
                // console.log("forceRefresh #2 - ", instr.length);
                tpl.forceRefresh = true;
            }
        }
        if (tpl.view.cm) {
            // define cmAppend
            tpl.view.cmAppends = [container!.cmAppend!];
        } else {
            if (dynParamNames) {
                // reset the dynamic param nodes that have not been processed
                let len = dynParamNames.length, dp = (container ? container.dynamicParams : {}) || {}, params = tpl.api;
                for (let i = 0; len > i; i++) {
                    if (!dp[dynParamNames[i]]) {
                        // this param node has not been called - so we need to reset it
                        // console.log("reset", dynParamNames[i]);
                        resetProperty(params, dynParamNames[i]);
                    }
                }
            }

            let root = tpl.view.nodes![0];
            if (!root.attached) {
                // console.log("forceRefresh #3");
                tpl.forceRefresh = true;
                let insertFn = getViewInsertFunction(v, container!);
                insertInDom(root, insertFn, 2);
            }
        }
        if (labels) {
            registerLabels(v, tpl.api, labels);
        }
        tpl.render();
    }
}

export function ζcallD(v: IvView, idx: number, container?: IvCptContainer | 0, labels?: any[] | 0, dynParamNames?: string[]) {
    addInstruction(v, ζcall, [v, idx, container, labels, dynParamNames]);
}

function identifyPNodeList(v: IvView, pn: IvParamNode, name: string, dataParent: any) {
    if (!hasProperty(dataParent, name)) {
        if (hasProperty(dataParent, name + "List")) {
            pn.dataIsList = true;
            pn.dataName = name + "List";
        } else {
            error(v, "Invalid parameter node: <." + name + ">");
            // console.log(pn.uid, ">>>", dataParent)
        }
    } else {
        pn.dataIsList = false;
    }
}

export function ζpnode(v: IvView, cm: boolean, iFlag: number, idx: number, parentIndex: number, name: string, instanceIdx: number, labels?: any[] | 0, staticParams?: any[] | 0, dynParamNames?: string[]) {
    let pnd: IvParamNode, vNodes = v.nodes!, updateMode = false;
    // Warning: this function may not be called during cm (e.g. if defined in a conditional block)
    // console.log("ζpnode - view:", v.uid, cm, "idx: " + idx, "parentIndex: " + parentIndex)
    if (!vNodes[idx]) {
        // create and register param node
        pnd = {
            kind: "#param",
            uid: "pnd" + (++uidCount),
            idx: idx,
            parentIdx: parentIndex,
            nextSibling: undefined,
            domNode: undefined,
            attached: true,
            dataName: name,
            dataHolder: undefined,
            data: undefined,
            dataIsList: undefined,
            contentView: undefined,
            dynamicParams: undefined,
            viewInstanceIdx: instanceIdx,
            viewPool: undefined
        }
        // console.log("ζpnode: create " + pnd.uid)
        vNodes[idx] = pnd;
    } else {
        pnd = (vNodes[idx] as IvParamNode);
        let viewPool = pnd.viewPool;
        if (instanceIdx > 0 && !viewPool) {
            viewPool = pnd.viewPool = [];
            viewPool[pnd.viewInstanceIdx] = pnd.contentView!;
            // console.log(">>> ζpnode: save in pool: " + pnd.viewInstanceIdx);
        }
        if (viewPool) {
            pnd.contentView = viewPool[instanceIdx];
            // warning: contentView may be undefined -> in this case the view will be created in saved in the pool through ζview
            // console.log(">>> ζpnode: retrieve contentView from pool: " + instanceIdx + " " + (pnd.contentView ? pnd.contentView.uid : "XX"));
        }
        pnd.viewInstanceIdx = instanceIdx;
        pnd.dataHolder = pnd.data = undefined;
        updateMode = true;
    }

    if (dynParamNames) {
        pnd.dynamicParams = {};
    }

    let parent = vNodes[parentIndex] as IvCptContainer | IvParamNode,
        data: any,
        dataName = name,
        prevData: any = undefined,
        dataHolder = parent.data;
    if (!dataHolder) {
        error(v, "Invalid parameter node <." + name + "/>: no param node can be used in this context"); // TODO error handling
    } else {
        // for (let k in dataHolder) console.log(" >>> ", k)
        pnd.dataHolder = dataHolder;
        if (pnd.dataIsList === undefined) {
            identifyPNodeList(v, pnd, dataName, dataHolder);
        }
        dataName = pnd.dataName; // changed by identifyPNodeList
        prevData = pnd.data;

        if (pnd.dataIsList) {
            // data node is a list item
            let parentLists = parent.lists;
            if (!parentLists) {
                // create the list meta data
                parentLists = parent.lists = {
                    sizes: {},      // dictionary of the temporary lists
                    listNames: [],  // name of the lists managed by the object holding this meta data - e.g. ["list1", "list2"]
                    listMap: {}     // map of the list names - e.g. {list1: 1, list2: 1}
                }
            }

            // register the param list in the parent
            if (!parentLists.listMap[dataName]) {
                parentLists.listMap[dataName] = 1;
                parentLists.listNames.push(dataName);
            }

            let size = parentLists.sizes[dataName];
            if (!size) {
                size = parentLists.sizes[dataName] = 0; // temporary array
            }

            // get an existing item from the current list or create one
            data = dataHolder[dataName][size];
            if (!data) {
                data = createProperty(dataHolder[dataName], size);
            }
            parentLists.sizes[dataName] += 1;
            pnd.data = data;
        } else {
            // data node is not a list item
            pnd.data = data = dataHolder[dataName];
            if (data === undefined) {
                // create the property node
                pnd.data = data = createProperty(dataHolder, dataName);
            }
        }

        if (updateMode && data) {
            if (data["ΔΔ$content"]) {
                pnd.contentView = data["ΔΔ$content"];
                // console.log(">>> ζpnode: retrieve contentView from data: " + (pnd.contentView ? pnd.contentView.uid : "XX"))
            }
        }
    }
    // note: data may not be defined if the param node is not associated to an object 
    // e.g. string or boolean or number that will be used with a @paramValue param - cf. ζpar

    // if contains list params, reset the tempLists
    if (pnd.lists) {
        pnd.lists.sizes = {};
    }

    // if dynamic, flag the node as read
    let dp = (parent as IvCptContainer | IvParamNode).dynamicParams;
    if (dp) {
        dp[dataName] = 1;
    }

    if (staticParams) {
        if (!data) {
            error(v, "Invalid param node parameter: " + staticParams[0]);
        } else if (prevData !== data) {
            // initialize static params
            // prevData !== data is true when node data has been created or reset
            let len = staticParams.length;
            for (let i = 0; len > i; i += 2) {
                if (cm && !hasProperty(data, staticParams[i])) {
                    error(v, "Invalid param node parameter: " + staticParams[i]);
                }
                data[staticParams[i]] = staticParams[i + 1];
            }
        }
    }
}

function cleanDataLists(dataHolder: IvCptContainer | IvParamNode) {
    if (dataHolder.lists) {
        let lists = dataHolder.lists, lsNames = lists.listNames, nm: string, sz: number, data: any, len2: number;
        for (let i = 0; lsNames.length > i; i++) {
            nm = lsNames[i];
            sz = lists.sizes[nm] || 0;
            data = dataHolder.data[nm];
            len2 = data.length;
            if (sz < len2) {
                data.splice(sz, len2 - sz);
            }
        }
    }
}

export function ζpnEnd(v: IvView, cm: boolean, iFlag: number, idx: number, labels?: any[] | 0, dynParamNames?: string[]) {
    let pn = v.nodes![idx] as IvParamNode;
    cleanDataLists(pn);
    //console.log(":: ζpnEnd", v.uid, pn)
    if (dynParamNames) {
        let len = dynParamNames.length, dp = pn.dynamicParams;
        for (let i = 0; len > i; i++) {
            if (dp && !dp[dynParamNames[i]]) {
                // this param node has not been called - so we need to reset it
                // console.log("reset", dynParamNames[i]);
                resetProperty(pn.data, dynParamNames[i]);
            }
        }
    }
    if (pn.contentView !== undefined) {
        touch(pn.dataHolder); // force refresh as content may have changed
    }
}

// Attribute setter
// e.g. ζatt(ζ, 0, 1, "title", ζe(ζ, 0, exp()+123));
export function ζatt(v: IvView, iFlag: number, eltIdx: number, name: string, expr: any) {
    if (expr === ζu) return;
    let val = getExprValue(v, iFlag, expr);
    if (val !== ζu) {
        const nd = (v.nodes![eltIdx] as IvNode).domNode;
        if (val === undefined) {
            nd.removeAttribute(name);
        } else {
            nd.setAttribute(name, val);
        }
    }
}

export function ζattD(v: IvView, iFlag: number, eltIdx: number, name: string, expr: any) {
    if (expr !== ζu) {
        addInstruction(v, ζatt, [v, iFlag, eltIdx, name, expr]);
    }
}

// Property setter
// e.g. ζpro(ζ, 0, 1, "title", ζe(ζ, 0, exp()+123));
export function ζpro(v: IvView, iFlag: number, eltIdx: number, name: string, expr: any) {
    if (expr === ζu) return;
    let val = getExprValue(v, iFlag, expr);
    if (val !== ζu) {
        (v.nodes![eltIdx] as IvNode).domNode[name] = val;
    }
}

export function ζproD(v: IvView, iFlag: number, eltIdx: number, name: string, expr: any) {
    if (expr !== ζu) {
        addInstruction(v, ζpro, [v, iFlag, eltIdx, name, expr]);
    }
}

// Param setter
// e.g. ζpar(ζ, 0, 1, "title", ζe(ζ, 0, exp()+123));
export function ζpar(v: IvView, cm: boolean, iFlag: number, eltIdx: number, name: string | 0, expr: any) {
    if (expr === ζu) return;
    let val = getExprValue(v, iFlag, expr);

    if (val !== ζu) {
        let nd = v.nodes![eltIdx], k = nd.kind;
        if (k === "#container") {
            let api = (nd as IvCptContainer).data;
            if (checkCptParam(v, cm, nd as IvCptContainer, api, name as string)) {
                api[name] = val;
            }
        } else if (k === "#param") {
            setParamNodeValue(v, cm, nd as IvParamNode, val, name);
        } else if (k === "#decorator") {
            let d = (nd as IvDecoNode);
            if (!cm || checkDecoParam(v, d, name as string)) {
                d.api[name] = val;
            }
        }
    }
}

export function ζparD(v: IvView, cm: boolean, iFlag: number, eltIdx: number, name: string, expr: any) {
    if (expr !== ζu) {
        let nd = v.nodes![eltIdx];
        if (nd !== U && nd.kind === "#param") {
            ζpar(v, cm, 0, eltIdx, name, expr);
        } else {
            addInstruction(v, ζpar, [v, cm, iFlag, eltIdx, name, expr]);
        }
    }
}

function checkCptParam(v: IvView, cm: boolean, nd: IvCptContainer, api: any, name: string) {
    if (api && (!v.cm || hasProperty(api, name as string))) {
        return true;
    }
    let suffix = "";
    if (nd.template) {
        suffix = " on <*" + (nd.template as any).templateName + "/>"; // todo: use cptRef when passed by compiler
    }
    error(v, "Invalid parameter '" + name + "'" + suffix);
    return false;
}

function setParamNodeValue(v: IvView, cm: boolean, p: IvParamNode, value: any, name: string | 0) {
    if (name === 0) {
        // @paramValue parameter
        // name is 0 for @paramValue that can only be used on param nodes
        if (p.dataHolder) {
            p.dataHolder[p.dataName] = value;
            return p.dataHolder;
        }
    } else {
        if (!p.data) {
            // could not be created in the ζpnode instruction => invalid parameter
            error(v, "Invalid param node parameter: " + name);
        } else {
            if (cm && !hasProperty(p.data, name)) {
                error(v, "Invalid param node parameter: " + name);
            }
            p.data[name] = value;
            return p.data;
        }
    }
    return null;
}

// ζbind(ζ, ζc, 0, 1, "param", someData, "someProperty");
export function ζbind(v: IvView, cm: boolean, iFlag: number, eltIdx: number, bindingIdx: number, name: string | 0, propertyHolder: any, propertyName?: string | number) {
    // read value and set it as param (if value is identical to current param value it will not change anything)
    // if first time, watch param changes (will be automatically unwatched when param holder is disposed) and update data
    let nd = v.nodes![eltIdx] as (IvCptContainer | IvParamNode | IvDecoNode), k = nd.kind, value: any = U, api: any;
    if (propertyHolder !== U && propertyName !== U && propertyHolder !== null && typeof propertyHolder === "object") {
        if (cm && typeof propertyName === "string" && isDataObject(propertyHolder) && !hasProperty(propertyHolder, propertyName)) {
            error(v, "Invalid property: '" + propertyName + "'");
        }
        value = propertyHolder[propertyName];
    }
    if (k === "#container") {
        api = (nd as IvCptContainer).data;
        if (checkCptParam(v, cm, nd as IvCptContainer, api, name as string)) {
            cm && checkIoProp(v, api, name as string);
            api[name] = value;
        }
    } else if (k === "#param") {
        if (name === 0) {
            // @paramValue parameter
            // name is 0 for @paramValue that can only be used on param nodes
            let p = nd as IvParamNode;
            if (p.dataHolder) {
                p.dataHolder[p.dataName] = value;
                api = p.dataHolder;
                name = p.dataName;
                cm && checkIoProp(v, api, name, "." + name, false, true);
            }
        } else {
            api = setParamNodeValue(v, cm, nd as IvParamNode, value, name);
            cm && checkIoProp(v, api, name, "." + (nd as IvParamNode).dataName);
        }
    } else if (k === "#decorator") {
        let d = (nd as IvDecoNode);
        api = d.api;
        if (name === 0) {
            // default value - e.g. @deco={=a.b}
            name = setDecoDefaultParam(v, d, value);
            cm && name && checkIoProp(v, api, name, d.refName, true);
        } else if (!cm || checkDecoParam(v, d, name as string)) {
            // multiple params - e.g. @deco(foo={=a.b})
            cm && checkIoProp(v, api, name, d.refName);
            api[name] = value;
        }
    }

    // watch param changes
    let bindings = nd.bindings;
    if (bindings === U) {
        bindings = nd.bindings = [];
    }
    if (bindings[bindingIdx] === U) {
        // create binding data
        if (api) {
            let b: IvBinding = {
                propertyHolder: propertyHolder,
                propertyName: propertyName as any,
                watchFn: watch(api, function () {
                    const newVal = api[name], holder = b.propertyHolder;
                    // console.log("ζbind watch call:", newVal)
                    if (holder !== U && holder !== null && b.propertyName !== U && holder[b.propertyName] !== newVal) {
                        const v = version(holder);
                        if (v === 0 || v % 2 === 1) {
                            // object is new or being changed -> delay update
                            Promise.resolve().then(() => {
                                holder[b.propertyName] = newVal;
                            })
                        } else {
                            // object is stable => update now
                            holder[b.propertyName] = newVal;
                        }
                    }
                }) as any
            }
            bindings[bindingIdx] = b;
        }
    } else {
        let b = bindings[bindingIdx];
        b.propertyHolder = propertyHolder;
        b.propertyName = propertyName as any;
    }
}

export function ζbindD(v: IvView, cm: boolean, iFlag: number, eltIdx: number, bindingIdx: number, name: string | 0, propertyHolder: any, propertyName?: string | number) {
    let nd = v.nodes![eltIdx];
    if (nd !== U && nd.kind === "#param") {
        // param nodes are not deferred
        ζbind(v, cm, iFlag, eltIdx, bindingIdx, name, propertyHolder, propertyName);
    } else {
        addInstruction(v, ζbind, [v, cm, iFlag, eltIdx, bindingIdx, name, propertyHolder, propertyName]);
    }
}

// Dynamic label
// e.g. ζlbl(ζ, 0, 0, "divA", expr());
export function ζlbl(v: IvView, iFlag: number, idx: number, name: string, value: any) {
    if (value && v.nodes) {
        let o = v.nodes[idx];
        if (o.kind === "#container" && (o as IvContainer).subKind === "##cpt") {
            let tpl = (o as IvCptContainer).template;
            if (tpl) {
                registerLabel(v, tpl.api, name);
            }
        } else if (o.domNode) {
            registerLabel(v, o.domNode, name);
        } else if (o.kind === "#decorator") {
            registerLabel(v, (o as IvDecoNode).api, name);
        }
    }
}

export function ζlblD(v: IvView, iFlag: number, idx: number, name: string, value: any) {
    if (value) {
        addInstruction(v, ζlbl, [v, iFlag, idx, name, 1]);
    }
}

// Decorator
// ζdeco(ζ, ζc, 0, 1, 0, REF, VAL);
export function ζdeco(v: IvView, cm: boolean, iFlag: number, idx: number, parentIdx: number, decoName: string, decoRef: any, paramMode: 0 | 1 | 2, defaultValue?: any | 0, staticParams?: any[] | 0, labels?: any[]) {
    // paramMode: 0=no params, 1=default param, 2=multiple params
    let nd: IvDecoNode | undefined;
    if (cm) {
        // create decorator
        const nodes = v.nodes!;
        if (decoRef === undefined) {
            error(v, "Undefined decorator reference: @" + decoName);
        } else if (typeof decoRef !== "function" && decoRef["$isDecorator"] !== true) {
            error(v, "Invalid decorator reference: @" + decoName);
        } else {
            const api = new (decoRef as IvDecorator<any>).$apiClass();
            const deco = (decoRef as IvDecorator<any>)(api);
            nd = {
                kind: "#decorator",
                uid: "deco" + (++uidCount),
                idx: idx,
                parentIdx: parentIdx,
                attached: true,
                nextSibling: undefined,
                domNode: undefined,
                instance: deco,
                api: api,
                refName: "@" + decoName,
                validProps: true
            }
            nodes[idx] = nd;

            if (staticParams) {
                const len = staticParams.length;
                for (let i = 0; len > i; i += 2) {
                    checkDecoParam(v, nd, staticParams[i]);
                    api[staticParams[i]] = staticParams[i + 1];
                }
            }
        }
    } else {
        nd = v.nodes![idx] as IvDecoNode;
    }
    if (nd !== U) {
        const api = nd.api;
        if (paramMode === 1) {
            setDecoDefaultParam(v, nd, defaultValue);
        }
        registerLabels(v, api, labels);
    }
}

function checkDecoParam(v: IvView, nd: IvDecoNode, paramName: string): boolean {
    if (!hasProperty(nd.api, paramName)) {
        error(v, "Invalid decorator parameter '" + paramName + "' on " + nd.refName);
        return false;
    }
    return true;
}

function setDecoDefaultParam(v: IvView, nd: IvDecoNode, value: any): string {
    let api = nd.api, dp = api[DEFAULT_DECO_PARAM];
    if (dp === U) {
        error(v, nd.refName + " doesn't define any default parameter");
        return "";
    } else {
        api[dp] = value;
        return dp;
    }
}

function callDecoInstance(v: IvView, cm: boolean, d: IvDecoNode) {
    if (cm) {
        const api = d.api, parent = v.nodes![d.parentIdx];
        let targetElt: any = null, targetApi: any = null, invalidTarget = false;

        if (parent.kind === undefined) {
            // parent is a dom elt - cf. xtr renderer
            targetElt = parent;
        } else if (parent.kind === "#element") {
            // todo: check type validity
            targetElt = parent.domNode;
        } else if (parent.kind === "#container" && (parent as IvContainer).subKind === "##cpt") {
            let tpl = (parent as IvCptContainer).template!;
            targetApi = tpl.api;
            targetElt = tpl.query("#main");
        } else {
            // invalid target
            error(v, "Invalid decorator target for " + d.refName);
        }

        if (targetElt !== null && hasProperty(api, "$targetElt")) {
            api.$targetElt = targetElt;
        }
        if (targetApi !== null && hasProperty(api, "$targetApi")) {
            api.$targetApi = targetApi;
        }

        d.validProps = checkRequiredProps(v, d.api, d.refName, DECORATOR_ERRORS);
        if (d.validProps) {
            callLcHook(v, d.instance, "$init", d.refName);
        }
    }
    if (d.validProps) {
        callLcHook(v, d.instance, "$render", d.refName);
    }
}

export function ζdecoD(v: IvView, cm: boolean, iFlag: number, idx: number, parentIdx: number, decoName: string, decoRef: any, paramMode: 0 | 1 | 2, defaultValue?: any | 0, staticParams?: any[] | 0, labels?: any[]) {
    addInstruction(v, ζdeco, [v, cm, iFlag, idx, parentIdx, decoName, decoRef, paramMode, defaultValue, staticParams, labels]);
}

export function ζdecoCall(v: IvView, cm: boolean, iFlag: number, idx: number) {
    let nd = v.nodes![idx] as IvDecoNode;
    if (nd !== U) {
        callDecoInstance(v, cm, nd);
    }
}

export function ζdecoCallD(v: IvView, cm: boolean, iFlag: number, idx: number) {
    addInstruction(v, ζdecoCall, [v, cm, iFlag, idx]);
}

// Event listener
// ζevt(ζ, ζc, 1, 0, function (e) {doSomething()});
export function ζevt(v: IvView, cm: boolean, idx: number, eltIdx: number, eventName: string, handler: (e: any) => void, passive?: 0 | 1, options?: any) {
    if (cm) {
        // get associated elt
        let parent = v.nodes![eltIdx];
        if (parent.kind === "#element") {
            let domNode = parent.domNode;
            if (!domNode) {
                error(v, "Cannot set " + eventName + " event listener: undefined DOM node");
                return;
            }
            // create and register event listener
            let nd = createListener(domNode);
            if (passive) {
                options = options || {};
                if (options.passive !== false) {
                    options.passive = true;
                }
            }
            domNode.addEventListener(eventName, function (evt: any) {
                if (nd.callback) {
                    nd.callback(evt);
                }
            }, options);
        } else if (parent.kind === "#container") {
            let template = (parent as IvCptContainer).template;
            if (!template) {
                error(v, "Cannot set " + eventName + " event listener: undefined component template");
            } else {
                addListener(template!.api, false);
            }
        } else if (parent.kind === "#param") {
            addListener((parent as IvParamNode).data, true);
        } else if (parent.kind === "#decorator") {
            addListener((parent as IvDecoNode).api, true);
        }

    } else {
        // update callback as it may contain different closure values
        (v.nodes![idx] as IvEltListener).callback = handler; // TODO: optimize if options.once
    }

    function addListener(api: any, initEmitter: boolean) {
        if (!api || !hasProperty(api, eventName + "Emitter")) {
            error(v, "Unsupported event: " + eventName);
        } else {
            let emitter = api[eventName + "Emitter"];
            if (!emitter.addListener || typeof (emitter.addListener) !== "function") {
                error(v, "Invalid event emitter for: " + eventName);
            } else {
                // emitter.addListener
                let nd = createListener(null);
                emitter.addListener(function (evt: any) {
                    if (nd.callback) {
                        nd.callback(evt);
                    }
                });
                if (initEmitter && typeof emitter.init === "function") {
                    // this should be done earlier, but there is no easy hook for param nodes for the time being
                    emitter.init(eventName, api);
                }
            }
        }
    }

    function createListener(domNode) {
        let nd: IvEltListener = {
            kind: "#listener",
            uid: "evt" + (++uidCount),
            idx: idx,
            parentIdx: eltIdx,
            nextSibling: undefined,
            domNode: domNode,
            attached: true,
            callback: handler
        }
        v.nodes![idx] = nd;
        return nd;
    }
}

export function ζevtD(v: IvView, cm: boolean, idx: number, eltIdx: number, eventName: string, handler: (e: any) => void, passive?: 0 | 1, options?: any) {
    addInstruction(v, ζevt, [v, cm, idx, eltIdx, eventName, handler, passive, options]);
}

// Insert / Content projection instruction
// e.g. ζins(ζ, 1, ζe(ζ, 0, $content));
export function ζins(v: IvView, iFlag: number, idx: number, contentExprOr$: any, is$Param?: 1) {
    let projectionNode = v.nodes![idx] as (IvEltNode | IvFrgNode); // node with @content decorator: either a fragment or an element
    // contentView is the view that needs to be projected - e.g. $content

    let contentView: IvView | undefined;

    if (is$Param === 1) {
        if (contentExprOr$[CONTROLLER_FLAG]) {
            if (hasProperty(contentExprOr$, PROP_API)) {
                const api = contentExprOr$[PROP_API];
                if (api !== U) {
                    contentView = api["$content"];
                }
            }
        } else if (hasProperty(contentExprOr$, "$content")) {
            contentView = contentExprOr$["$content"];
        }
    } else {
        contentView = getExprValue(v, iFlag, contentExprOr$) as IvView;
    }

    if ((contentView as any) === ζu || contentExprOr$ === undefined) {
        contentView = projectionNode.contentView as IvView;
    }
    // console.log("ζins", contentView ? contentView.uid : "no content view");

    if (!contentView) return; // todo: remove what is currently projected?
    // logView(contentView, "insert: " + contentView.uid);

    let ph = contentView.projectionHost;
    if (ph && ph.hostNode !== projectionNode) {
        // contentView was already projected somewhere else
        // console.log(":: ζins:remove from dom")
        removeFromDom(contentView, contentView.nodes![0]);
    }

    if (projectionNode.contentView && projectionNode.contentView !== contentView) {
        // current projection node is already projecting a view
        removeFromDom(projectionNode.contentView, projectionNode.contentView.nodes![0]);
    }
    projectionNode.contentView = contentView;
    contentView.projectionHost = {
        view: v,
        hostNode: projectionNode
    }

    if (contentView.cm) {
        if (projectionNode.kind === "#element") {
            let pdn = projectionNode.domNode;
            contentView.cmAppends = [function (n: IvNode) {
                // console.log("cmAppends #5", n.uid, n.domNode ? n.domNode.uid : "XX");
                if (n.domNode) {
                    appendChild(n.domNode, projectionNode.domNode, 5);
                } else {
                    n.domNode = pdn;
                }
            }];
        } else {
            // fragment
            contentView.cmAppends = [getViewInsertFunction(v, projectionNode)]
        }
    } else {
        let insertFn: ((n: IvNode, domOnly: boolean) => void), insertDone = false;

        if (contentView.domNode !== U && contentView.nodes !== null && contentView.domNode.nodeType === DOCUMENT_FRAGMENT) {
            // console.log(":: first time insert")
            appendChild(contentView.nodes[0].domNode, projectionNode.domNode, 7);
            replaceRootDomNode(contentView, projectionNode.domNode);
            insertDone = true;
        }
        if (!insertDone) {
            // insert 
            if (projectionNode.kind === "#element") {
                let elt = projectionNode.domNode
                insertFn = function (n: IvNode, domOnly: boolean) {
                    if (n.domNode) {
                        appendChild(n.domNode, elt, 6);
                    } else {
                        n.domNode = elt;
                    }
                }
            } else {
                // fragment
                insertFn = getViewInsertFunction(v, projectionNode as IvFrgNode);
            }
            insertInDom(contentView.nodes![0], insertFn, 3);
        }
    }

    contentView.container = projectionNode;
    runInstructions(contentView);
}

export function ζinsD(v: IvView, iFlag: number, idx: number, exprContentView: any, is$Param?: 1) {
    addInstruction(v, ζins, [v, iFlag, idx, exprContentView, is$Param]);
}

interface SiblingDomPosition {
    position: "lastChild" | "beforeChild" | "lastOnRoot" | "defer";
    nextDomNd?: any;
    parentDomNd: any;
}

function findNextSiblingDomNd(v: IvView, nd: IvNode): SiblingDomPosition {
    while (true) {
        if (!nd) {
            error(v, "Internal error - findNextSiblingDomNd: nd cannot be undefined");
        }
        // console.log("findNextSiblingDomNd", nd.uid)
        if (nd.idx === 0) {
            // console.log("> is root - is attached:", nd.attached)
            if (!nd.attached) {
                return { position: "defer", parentDomNd: undefined };
            } else if (nd.domNode.nodeType === DOCUMENT_FRAGMENT) {
                return { position: "lastChild", parentDomNd: nd.domNode };
            }
            // root node has no sibling -> look in next view or next node in container
            let pView = v.parentView;
            if (!pView) {
                return { position: "lastOnRoot", parentDomNd: v.rootDomNode, nextDomNd: v.anchorNode };
            } else {
                // console.log("> parent view: ", pView.uid, "containing", v.uid);
                if (v.projectionHost) {
                    // current node is the root of a light-dom that is projected in another container
                    let container = v.projectionHost.hostNode;
                    if (container.kind === "#element") {
                        return { position: "lastChild", parentDomNd: container.domNode };
                    } else {
                        // container is a fragment
                        return findNextSiblingDomNd(v.projectionHost.view, container);
                    }
                } else {
                    if (v.container && (v.container as IvContainer).subKind === "##block") {
                        // look in the next views
                        const cnt = v.container as IvBlockContainer;
                        const idx = cnt.views.indexOf(v);
                        if (idx > -1) {
                            let v2: IvView, sdp2: any;
                            for (let i = idx + 1; i < cnt.views.length; i++) {
                                v2 = cnt.views[i];
                                if (v2.nodes && v2.nodes.length) {
                                    // console.log(":: next active views")
                                    sdp2 = findFirstDomNd(v2, v2.nodes[0], cnt.domNode);
                                    if (sdp2) return sdp2;
                                }
                            }
                        }
                        // look in container pool: next views may not have been detached yet
                        const pool = cnt.viewPool;
                        let sdp2: any;
                        for (let v2 of pool) {
                            if (v2.nodes && v2.nodes.length && v2.attached) {
                                // console.log(":: next views in pool ", v2.uid)
                                sdp2 = findFirstDomNd(v2, v2.nodes[0], cnt.domNode);
                                if (sdp2) return sdp2;
                            }
                        }
                    }
                    return findNextSiblingDomNd(pView, v.container as IvNode);
                }
            }
        }

        // find next node that is attached
        if (nd.nextSibling) {
            // console.log("> is not last")
            let sdp = findFirstDomNd(v, nd.nextSibling, getParentDomNd(v, nd));
            if (sdp) return sdp;
            // if not found (e.g. node not attached) we shift by 1
            nd = nd.nextSibling;
        } else {
            // console.log("> is last")
            // nd is last sibling
            let parent = v.nodes![nd.parentIdx] as IvParentNode;
            if (parent.kind === "#element") {
                return { position: "lastChild", parentDomNd: getParentDomNd(v, nd) };
            }
            // parent is a fragment (or variant)
            return findNextSiblingDomNd(v, parent);
        }
    }

    function findFirstDomNd(v: IvView, nd: IvNode, parentDomNd: any): SiblingDomPosition | null {
        // console.log("findFirstDomNd", nd? nd.uid : "XX")
        if (!nd) return null;
        if (nd.kind === "#element" || nd.kind === "#text") {
            return { position: "beforeChild", nextDomNd: nd.domNode, parentDomNd: parentDomNd };
        } else if (nd.kind === "#fragment") {
            let sdp: SiblingDomPosition | null, ch = (nd as IvParentNode).firstChild;
            while (ch) {
                sdp = findFirstDomNd(v, ch, parentDomNd);
                if (sdp) {
                    return sdp;
                }
                ch = ch.nextSibling!;
            }
            if ((nd as IvFrgNode).contentView) {
                // Search in projected view
                let cv = (nd as IvFrgNode).contentView!;
                if (cv.nodes) return findFirstDomNd(cv, cv.nodes[0], parentDomNd);
            }
            // not found
            return null;
        } else if (nd.kind === "#container") {
            let container = nd as IvContainer, sdp: SiblingDomPosition | null = null;
            if (container.subKind === "##block") {
                let views = (container as IvBlockContainer).views, len = views.length;
                for (let i = 0; len > i; i++) {
                    sdp = findFirstDomNd(views[i], views[i].nodes![0] as IvNode, parentDomNd);
                    if (sdp) break;
                }
            } else if (container.subKind === "##cpt") {
                let tpl = (container as IvCptContainer).template as Template, view = tpl.view;
                sdp = findFirstDomNd(view, view.nodes![0], parentDomNd);
            }
            return sdp ? sdp : null;
        } else {
            throw new Error("TODO findFirstDomNd: " + nd.kind); // e.g. #decorator
        }
    }
}

function getParentDomNd(v: IvView, nd: IvNode) {
    // console.log("getParentDomNd", v.uid, nd ? nd.uid : "XX");

    if (nd.idx === 0 && v.projectionHost) {
        // this node is a light-dom root node
        if (!nd.attached) return null;
        let hNode = v.projectionHost.hostNode;
        if (hNode.kind === "#element") {
            return hNode.domNode;
        } else {
            // hNode is a fragment
            return getParentDomNd(v.projectionHost.view, hNode);
        }
    }
    if (nd.idx === 0) {
        // nd is a root node
        if (v.parentView) {
            return getParentDomNd(v.parentView, v.container as IvNode);
        } else {
            return v.rootDomNode;
        }
    }
    return (v.nodes![nd.parentIdx] as IvNode).domNode;
}

function removeFromDom(v: IvView, nd: IvNode) {
    if (!nd || !nd.attached) return;
    // console.log(":: removeFromDom", nd.uid);
    if (nd.kind === "#text" || nd.kind === "#element") {
        let pdn = getParentDomNd(v, nd);
        nd.attached = false;
        if (pdn) {
            // console.log(":: removeChild:", nd.domNode.uid, "in", pdn ? pdn.uid : "XX");
            pdn.removeChild(nd.domNode);
        } else {
            error(v, "Internal error - parent not found for: " + nd.uid);
        }
    } else if (nd.kind === "#container") {
        if (nd["subKind"] === "##block") {
            let container = nd as IvBlockContainer;
            let views = container.views, len = views.length, root: IvNode;
            // remove all blocks from dom and put them in blockPool
            for (let i = 0; len > i; i++) {
                root = views[i].nodes![0];
                removeFromDom(views[i], root);
                views[i].attached = root.attached = false;
                if (root.kind === "#container" || root.kind === "#fragment") {
                    root.domNode = undefined;
                }
            }
            // move previous nodes to blockPool
            container.views = [];
            container.previousNbrOfViews = 0;
            container.viewPool = views.concat(container.viewPool);
        } else if (nd["subKind"] === "##cpt") {
            let tpl = (nd as IvCptContainer).template as Template
            let nodes = tpl.view.nodes!, root = nodes[0];
            removeFromDom(tpl.view, root);
            tpl.view.attached = root.attached = false;
            if (root.kind === "#container" || root.kind === "#fragment") {
                root.domNode = undefined;
            }
        }
        // note: we have to keep container attached (except if they are root)
    } else if (nd.kind === "#fragment") {
        let f = nd as IvFrgNode;
        f.attached = false;
        if (f.contentView) {
            removeFromDom(f.contentView, f.contentView.nodes![0]);
        } else
            if (f.firstChild) {
                let nd = f.firstChild;
                while (nd) {
                    removeFromDom(v, nd);
                    nd = nd.nextSibling!;
                }
            }
        f.domNode = undefined;
    } else if (nd.kind === "#param") {
        console.warn("TODO removeFromDom for param nodes")
    } else {
        // will raise an error when new node types are introduced
        console.warn("RemoveFromDom for " + nd.kind)
    }
}

// ----------------------------------------------------------------------------------------------
// Param class

export const ζΔD = ΔD;
export const ζΔp = Δp;
export const ζΔf = Δf;
export const ζΔdf = Δdf;
export const ζΔfStr = ΔfStr;
export const ζΔfBool = ΔfBool;
export const ζΔfNbr = ΔfNbr;
export const ζΔlf = Δlf;
export const ζΔu = Δu;
export const ΔfRef = _ΔfRef;
export function API(c: any) {
    c.prototype[API_FLAG] = true;
    ΔD(c);
}
export function Controller(c: any) {
    c.prototype[CONTROLLER_FLAG] = true;
    ΔD(c);
}

function removeTraxPropPrefix(propName: string) {
    return propName.replace(RX_TRAX_PROP_PREFIX, "");
}

function checkTemplateArgClass(cls: () => void, flag: string): boolean {
    return cls.prototype[flag] === true;
}

// ----------------------------------------------------------------------------------------------
// Decorators

export function decorator<ApiClass>(apiClass: { new(): ApiClass }, createInstance: (api: ApiClass) => IvDecoratorInstance): IvDecorator<ApiClass> {
    createInstance["$apiClass"] = apiClass;
    createInstance["$isDecorator"] = true;
    return createInstance as IvDecorator<ApiClass>;
}

export interface IvElement {
    // subset of typescript HTMLElement to simplify tests / mocking

    className: string;
    readonly clientHeight: number;
    readonly clientLeft: number;
    readonly clientTop: number;
    readonly clientWidth: number;

    id: string;
    innerHTML: string;

    readonly scrollHeight: number;
    scrollLeft: number;
    scrollTop: number;
    readonly scrollWidth: number;

    readonly tagName: string;
    title: string;

    setAttribute(qualifiedName: string, value: string): void;
    removeAttribute(qualifiedName: string): void;

    addEventListener(type: string, listener: (e?: any) => void, options?: boolean | any): void;
    removeEventListener(type: string, listener: (e?: any) => void, options?: boolean | any): void;
}

/** 
 * Default value API decorator @defaultParam
 */
export function defaultParam(proto, key: string) {
    // proto = object prototype
    // key = the property name (e.g. "value")
    proto[DEFAULT_DECO_PARAM] = removeTraxPropPrefix(key);
}

/**
 * Input/Output API property decorator
 * Defines a property as input/output - i.e. this property can be used with an expression binding (e.g. prop={=a.b})
 * as it may be changed by the API controller (e.g. component or decorator)
 */
export function io(proto, key: string) {
    // proto = object prototype
    // key = the property name (e.g. "value")
    let ioParams = proto[IO_PARAMS];
    key = "/" + removeTraxPropPrefix(key);
    if (ioParams === U) {
        proto[IO_PARAMS] = key;
    } else {
        proto[IO_PARAMS] = ioParams + key;
    }
}

/**
 * API decorator to indicate that some properties are expected to be set
 * Ivy will use this indication to raise automatic errors 
 * (e.g. missing $targetElt or $targetApi)
 */
export function required(proto, key: string) {
    // proto = object prototype
    // key = the property name (e.g. "ΔΔ$targetElt")

    let requiredProps = proto[REQUIRED_PROPS] as string[];
    if (requiredProps === U) {
        requiredProps = proto[REQUIRED_PROPS] = []
    }
    requiredProps.push(key);
}

function checkRequiredProps(v: IvView, o: Object, context: string, msgMap?: { [propName: string]: string }): boolean {
    // return true if ok
    if (o[REQUIRED_PROPS] !== U) {
        let requiredProps = o[REQUIRED_PROPS] as string[], val: any, ok = true;
        for (let idx in requiredProps) {
            val = o[requiredProps[idx]];
            if (val === U || val === null) {
                let propName = removeTraxPropPrefix(requiredProps[idx]);
                if (msgMap !== U && msgMap[propName] !== U) {
                    error(v, (context + " " + propName).replace(RX_ERROR_ARGS, msgMap[propName])); // todo RegEx
                } else {
                    error(v, propName + " property is required for " + context);
                }
                ok = false;
            }
        }
        return ok;
    }
    return true;
}

function checkIoProp(v: IvView, propHolder: Object, propName: string, propHolderRef?: string, isDefaultProp?: boolean, isParamValue?: boolean): boolean {
    let ioParams = propHolder[IO_PARAMS];
    if (ioParams !== U) {
        let pn = "/" + propName;
        if (ioParams === pn || (ioParams as string).indexOf(pn) > -1) {
            return true;
        }
    }
    if (propHolderRef !== U) {
        if (isDefaultProp) {
            error(v, "Invalid I/O binding expression on " + propHolderRef + " (@defaultParam is not an @io param)");
        } else if (isParamValue) {
            error(v, "Invalid I/O binding expression on " + propHolderRef + "@paramValue (not an @io param)");
        } else {
            error(v, "Invalid I/O binding expression on " + propHolderRef + "." + propName + " (not an @io param)");
        }
    } else {
        error(v, "Invalid I/O binding expression on '" + propName + "' (not an @io param)");
    }
    return false;
}

function appendChild(child: any, parent: any, srcId: number) {
    // console.log("::   appendChild", child.uid, "in", parent.uid, "at", srcId);
    parent.appendChild(child);
}

function insertBefore(child: any, nextChild: any, parent: any, srcId: number) {
    // console.log("::   insertBefore", child.uid, "before", nextChild.uid, "in", parent.uid, "at", srcId);
    parent.insertBefore(child, nextChild);
}

function replaceRootDomNode(v: IvView | null, newRoot: any, oldRoot?: any) {
    if (!v || v.cm || !v.nodes || !v.nodes.length) return;
    if (oldRoot === U) {
        oldRoot = v.domNode;
    }
    if (oldRoot === U || newRoot === oldRoot) return;

    scanDomNodes(v, true, function (n: IvView | IvNode) {
        if (n.kind === "#view" || n.kind === "#fragment" || n.kind === "#container") {
            if (n.domNode === oldRoot) {
                // console.log(":: replace ", n.domNode!.uid, "with", newRoot.uid)
                n.domNode = newRoot;
            }
        }
        return true;
    });
}

function scanDomNodes(v: IvView | null | undefined, scanViewPools: boolean, processor: (n: IvNode | IvView) => boolean) {
    // processor is called on views and on all child nodes (including fragment and container child views)
    // processor must return true to continue the scan
    if (v !== U && v !== null) {
        let df: any = null;
        // console.log(":: scanView", v.uid, v.cm);
        if (processor(v)) {
            if (v.nodes !== null && v.nodes.length) {
                for (const vn of v.nodes) {
                    if (!scanNode(vn)) return false;
                }
            }
        } else {
            return false;
        }
    }
    return true;

    function scanNode(n: IvNode): boolean {
        // console.log(":: scanNode", n ? n.uid : "x")
        let k = n.kind;
        if (k === "#fragment") {
            if (!processor(n)) {
                return false;
            }
            return scanDomNodes((n as IvFrgNode).contentView, scanViewPools, processor);
        } else if (k === "#container") {
            if (!processor(n)) {
                return false;
            }
            let c = n as IvContainer, sk = c.subKind;
            if (sk === "##block") {
                let views = (c as IvBlockContainer).views;
                if (views !== null) {
                    for (let v of views) {
                        if (!scanDomNodes(v, scanViewPools, processor)) return false;
                    }
                }
                if (scanViewPools && (c as IvBlockContainer).viewPool) {
                    for (let v of (c as IvBlockContainer).viewPool) {
                        if (!scanDomNodes(v, scanViewPools, processor)) return false;
                    }
                }
            } else if (sk === "##cpt") {
                let tpl = (c as IvCptContainer).template;
                if (tpl !== null) {
                    return scanDomNodes((tpl as Template).view, scanViewPools, processor);
                }
            } else if (sk === "##async") {
                console.log("TODO: support scanNode for @async block");
            }
        } else {
            return processor(n);
        }
        return true;
    }
}

// ----------------------------------------------------------------------------------------------
// Async functions

export async function asyncComplete() {
    return null; //createAsyncProcessor();
}

// ----------------------------------------------------------------------------------------------
// Debug function

const SEP = "-------------------------------------------------------------------------------";

function logView(v: IvView, label = "", viewId?: string) {
    if (!viewId || v.uid === viewId) {
        console.log("");
        console.log(SEP);
        if (label) {
            console.log(label + ":")
        }
        logViewNodes(v);
    }
}

function logViewDom(v: IvView) {
    // only works with test dom nodes
    if (!v || !v.nodes) {
        console.log("No nodes");
    } else if (!v.nodes![0].domNode) {
        console.log("No DOM node");
    } else if (!v.nodes![0].domNode.stringify) {
        console.log("DOM node doesn't support stringify");
    } else {
        console.log(v.nodes![0].domNode!.stringify());
    }
}

export function logViewNodes(v: IvView, indent: string = "") {
    if (!v.nodes) {
        console.log(`${indent}${v.uid} - no nodes`);
        return;
    }
    let pv = v.parentView ? v.parentView.uid : "XX", ph = v.projectionHost, host = ph ? " >>> projection host: " + ph.hostNode.uid + " in " + ph.view.uid : "";
    console.log(`${indent}*${v.uid}* cm:${v.cm} isTemplate:${v.template !== undefined} parentView:${pv}${host}`);
    let len = v.nodes.length, nd: IvNode, space = "";
    for (let i = 0; len > i; i++) {
        nd = v.nodes[i];
        if (!nd) {
            console.log(`${indent}[${i}] XX`)
            continue;
        }

        if (nd.uid.length < 5) {
            space = ["     ", "    ", "   ", "  ", " "][nd.uid.length];
        } else {
            space = "";
        }
        if (nd.kind === "#container") {
            let cont = nd as IvContainer;
            let dn = cont.domNode ? cont.domNode.uid : "XX";
            console.log(`${indent}[${i}] ${nd.uid}${space} ${dn} attached:${nd.attached ? 1 : 0} parent:${parent(nd.parentIdx)} nextSibling:${nd.nextSibling ? nd.nextSibling.uid : "X"}`);
            if (cont.subKind === "##block") {
                let cb = cont as IvBlockContainer, len2 = cb.views.length;
                if (!len2) {
                    console.log(`${indent + "  "}- no child views`);
                } else {
                    for (let j = 0; len2 > j; j++) {
                        if (!cb.views[j]) {
                            console.log(`${indent + "  "}- view #${j} UNDEFINED`);
                            continue;
                        }
                        let childView = cb.views[j];
                        dn = childView.rootDomNode ? childView.rootDomNode.$uid : "XX";
                        console.log(`${indent + "  "}- view #${j}`);
                        logViewNodes(cb.views[j], "    " + indent);
                    }
                }
            } else if (cont.subKind === "##cpt") {
                let cc = cont as IvCptContainer, tpl = cc.template, contentView = cc.contentView;
                if (!contentView) {
                    console.log(`${indent + "  "}- light DOM: none`);
                } else {
                    console.log(`${indent + "  "}- light DOM:`);
                    logViewNodes(contentView, "    " + indent);
                }
                if (!tpl) {
                    console.log(`${indent + "  "}- no template`);
                } else {
                    console.log(`${indent + "  "}- shadow DOM:`);
                    logViewNodes(tpl["view"], "    " + indent);
                }
            } else {
                console.log(`${indent + "  "}- ${cont.subKind} container`);
            }
        } else {
            let dn = nd.domNode ? nd.domNode.uid : "XX", lastArg = "";
            if (nd.domNode && nd.kind === "#text") {
                lastArg = " text=#" + nd.domNode["_textContent"] + "#";
            } else if (nd.kind === "#fragment" || nd.kind === "#element") {
                let children: string[] = [], ch = (nd as IvFrgNode).firstChild;
                while (ch) {
                    children.push(ch.uid);
                    ch = ch.nextSibling;
                }
                lastArg = " children:[" + children.join(", ") + "]";
                let cnView = (nd as IvFrgNode | IvEltNode).contentView;
                if (cnView) {
                    lastArg += " >>> content view: " + cnView.uid;
                }
            }
            console.log(`${indent}[${nd.idx}] ${nd.uid}${space} ${dn} attached:${nd.attached ? 1 : 0} parent:${parent(nd.parentIdx)} nextSibling:${nd.nextSibling ? nd.nextSibling.uid : "X"}${lastArg}`);
        }
    }

    function parent(idx) {
        return idx < 0 ? "X" : idx;
    }
}

export const runtime = {
    "ζt": ζt,
    "ζu": ζu,
    "ζinit": ζinit,
    "ζview": ζview,
    "ζviewD": ζviewD,
    "ζend": ζend,
    "ζendD": ζendD,
    "ζelt": ζelt,
    "ζeltD": ζeltD,
    "ζxmlns": ζxmlns,
    "ζxmlnsD": ζxmlnsD,
    "ζtxt": ζtxt,
    "ζtxtD": ζtxtD,
    "ζe": ζe,
    "ζo": ζo,
    "ζfra": ζfra,
    "ζfraD": ζfraD,
    "ζcnt": ζcnt,
    "ζcntD": ζcntD,
    "ζcpt": ζcpt,
    "ζcptD": ζcptD,
    "ζcall": ζcall,
    "ζcallD": ζcallD,
    "ζpnode": ζpnode,
    "ζpnEnd": ζpnEnd,
    "ζatt": ζatt,
    "ζattD": ζattD,
    "ζpro": ζpro,
    "ζproD": ζproD,
    "ζpar": ζpar,
    "ζparD": ζparD,
    "ζbind": ζbind,
    "ζbindD": ζbindD,
    "ζlbl": ζlbl,
    "ζlblD": ζlblD,
    "ζdeco": ζdeco,
    "ζdecoD": ζdecoD,
    "ζdecoCall": ζdecoCall,
    "ζdecoCallD": ζdecoCallD,
    "ζevt": ζevt,
    "ζevtD": ζevtD,
    "ζins": ζins,
    "ζinsD": ζinsD
};