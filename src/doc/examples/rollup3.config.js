import typescript from 'rollup-plugin-typescript2';
import copy from 'rollup-plugin-copy'
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import ivy from '../../../rollup-plugin/index';
import { md } from '../../../rollup-plugin/md';

const production = !process.env.ROLLUP_WATCH,
    config = [],
    names = [
        'hello',
        // 'expressions',
        // 'subtemplates',
        // 'loops',
        // 'section',
        // 'events',
        // 'pages',
        // 'trax1',
        // 'trax2',
        // 'menu1',
        // 'menu2',
        // 'controller1',
        // 'controller2',
        // 'photos',
        // 'tabs',
        // 'labels1',
        // 'labels2',
        // 'labels3',
        // 'forms1',
        // 'forms2',
        // 'forms3',
        // 'select',
        // 'dbmon',
        // 'todomvc',
        // 'triangles',
        // 'clock',
        // 'innerHTML',
        // 'fragment1',
        // 'fragment2',
        // 'preprocessors'
    ];

for (let name of names) {
    config.push({
        input: `src/doc/examples/${name}/${name}.ts`,
        output: {
            name: name,
            dir: `public/examples/${name}`,
            format: 'iife', // immediately-invoked function expression
            sourcemap: false
        },
        plugins: [
            postcss({
                extract: `public/examples/${name}/styles.css`,
                minimize: production
            }),
            ivy({
                preProcessors: { "@@md": md }
            }),
            typescript({
                clean: production,
                objectHashIgnoreUnknownHack: true,
                typescript: require('typescript'),
                tsconfig: "src/doc/examples/tsconfig.json"
            }),
            copy({
                targets: [{ src: [`src/doc/examples/${name}/index.html`], dest: `public/examples/${name}` }] // warning: those files are not watched!
            }),
            production && terser() // minify, but only in production
        ]
    });
}

export default config;