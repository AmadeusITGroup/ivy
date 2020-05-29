const path = require("path");

module.exports = [{
    name: 'mocha',
    mode: 'development',
    target: 'node',
    entry: {
        "mocha.specs": "./src/test/runtime/testapp.ts"
    },
    // devtool: "inline-source-map",
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader",
                exclude: /node_modules/,
                options: {
                    configFile: "tsconfig.webpack.json"
                }
            },
            {
                test: /\.(ts|js)$/,
                loader: "./webpack-loader/index.js"
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist")
    }
}, {
    name: 'samples',
    mode: 'production',
    target: 'web',
    entry: {
        "flex": "./src/samples/flex/flex.ts",
        "tree": "./src/samples/tree/tree.ts",
        "largetable": "./src/samples/largetable/largetable.ts",
        "rows": "./src/samples/rows/rows.ts",
        "list-bench": "./src/samples/list-bench/list-bench.ts",
        "inputs": "./src/samples/inputs/inputs.ts"
    },
    module: {
        rules: [{
            test: /\.ts$/,
            loader: "ts-loader",
            exclude: /node_modules/,
            options: {
                configFile: "tsconfig.webpack.json"
            }
        }, {
            test: /\.(ts|js)$/,
            loader: "./webpack-loader/index.js"
        }, {
            test: /\.(html|css|svg|data)$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: 'samples/[folder]/[name].[ext]',
                }
            }]
        }]
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    output: {
        filename: "samples/[name]/[name].js",
        path: path.resolve(__dirname, "public")
    }
}];