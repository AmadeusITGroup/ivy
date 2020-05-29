/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export declare function getIntParameter(name: string): number;
export declare function getStringParameter(name: string): any;
export declare function bindAction(selector: string, callback: () => void): void;
export declare function profile(create: () => void, destroy: () => void, name: string): () => void;
