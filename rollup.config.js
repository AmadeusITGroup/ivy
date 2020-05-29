import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';
import fs from "fs";

// Rollup plugin local package.json
fs.mkdirSync('rollup-plugin', { recursive: true });
fs.writeFileSync('rollup-plugin/package.json', `{
    "main": "index.js",
    "module": "index.mjs"
}`);

// Webpack loader local package.json
fs.mkdirSync('webpack-loader', { recursive: true });
fs.writeFileSync('webpack-loader/package.json', `{
    "main": "index.js"
}`);

// Runtime typings file
fs.mkdirSync('runtime', { recursive: true });
fs.writeFileSync('runtime/index.d.ts', 'export * from "../typings/iv";');
fs.writeFileSync('runtime/package.json', `{
    "main": "index.js",
    "types": "index.d.ts"
}`);

export default [
    {
        // @@ts pre-processor
        input: 'src/pre-processors/ts.ts',
        output: {
            file: 'rollup-plugin/ts.js',
            format: 'es'
        },
        external: [
            'typescript',
            'fs',
            'path',
            'vscode-textmate'
        ],
        plugins: [
            json(),
            typescript({
                tsconfig: "tsconfig.rollup.json"
            })
        ]
    }, {
        // @@extract pre-processor
        input: 'src/pre-processors/extract.ts',
        output: {
            file: 'rollup-plugin/extract.js',
            format: 'es'
        },
        external: [
            'typescript',
            'fs',
            'path',
            'vscode-textmate'
        ],
        plugins: [
            json(),
            typescript({
                tsconfig: "tsconfig.rollup.json"
            })
        ]
    }, {
        // @@md pre-processor
        input: 'src/pre-processors/md.ts',
        output: {
            file: 'rollup-plugin/md.js',
            format: 'es'
        },
        external: [
            'typescript',
            'marked'
        ],
        plugins: [
            json(),
            typescript({
                tsconfig: "tsconfig.rollup.json"
            })
        ]
    }, {
        // rollup plugin
        input: 'src/iv/rollup/rollup-plugin-ivy.ts',
        output: [
            {
                file: 'rollup-plugin/index.mjs',
                format: 'esm',
                sourcemap: false
            },
            {
                file: 'rollup-plugin/index.js',
                format: 'cjs',
                sourcemap: false
            }
        ],
        external: [
            'typescript',
            'vscode-textmate',
            'rollup-pluginutils',
            'fs'
        ],
        plugins: [
            typescript({
                tsconfig: "tsconfig.rollup.json"
            })
        ]
    }, {
        // webpack loader
        input: 'src/iv/webpack/loader.ts',
        output: {
            file: 'webpack-loader/index.js',
            format: 'cjs'
        },
        external: [
            'typescript',
            'vscode-textmate',
            'rollup-pluginutils',
            'fs'
        ],
        plugins: [
            typescript({
                tsconfig: "tsconfig.rollup.json"
            })
        ]
    }, 
    {
        // runtime - main
        input: 'src/iv/index.ts',
        output: [
            {
                file: 'runtime/index.mjs',
                format: 'esm',
                sourcemap: false
            },
            {
                file: 'runtime/index.js',
                format: 'cjs',
                sourcemap: false
            },
        ],
        plugins: [
            typescript({
                tsconfig: "tsconfig.rollup.json"
            })
        ]
    }
];