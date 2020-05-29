/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export declare class TreeNode {
    value: string;
    depth: number;
    maxDepth: number;
    left: TreeNode | null;
    right: TreeNode | null;
    transitiveChildCount: number;
    children: TreeNode[];
    constructor(value: string, depth: number, maxDepth: number, left: TreeNode | null, right: TreeNode | null);
    readonly style: string;
}
export declare let maxDepth: number;
export declare const emptyTree: TreeNode;
export declare function buildTree(): TreeNode;
export declare function flattenTree(node: TreeNode, target?: TreeNode[]): TreeNode[];
