import typescript from 'rollup-plugin-typescript2';
import copy from 'rollup-plugin-copy'
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import ivy from '../../rollup-plugin/index';
import { extract } from '../../rollup-plugin/extract';
import { md } from '../../rollup-plugin/md';
import { ts } from '../../rollup-plugin/ts'

const production = !process.env.ROLLUP_WATCH;

export default {
    input: 'src/doc/main.ts',
    output: {
        name: 'main',
        dir: 'public',
        format: 'esm', // iife (immediately-invoked function expression) incompatible with code-splitting modules
        sourcemap: false
    },
    plugins: [
        postcss({
            extract: "public/styles.css",
            minimize: production
        }),
        ivy({
            preProcessors: { "@@extract": extract, "@@md": md, "@@ts": ts }
        }),
        typescript({
            clean: production,
            objectHashIgnoreUnknownHack: true,
            typescript: require('typescript'),
            tsconfig: "tsconfig.rollup.json"
        }),
        copy({
            targets: [ // warning: those files are not watched!
                { src: ['src/doc/index.html'], dest: 'public' },
                { src: ['src/doc/api/mvc.png'], dest: 'public' }
            ] 
        }),
        production && terser() // minify, but only in production
    ]
};
