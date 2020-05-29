/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export declare class TableCell {
    row: number;
    col: number;
    value: string;
    constructor(row: number, col: number, value: string);
}
export declare let maxRow: number;
export declare let maxCol: number;
export declare const emptyTable: TableCell[][];
export declare function buildTable(): TableCell[][];
