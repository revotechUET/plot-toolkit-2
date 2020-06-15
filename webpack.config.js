const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");

const plugins =  [
    new HardSourceWebpackPlugin()
];
module.exports = function(env) {
    let entry = env.MAIN || './src/main/basic.js';
    let isDev = (env.NODE_ENV || 'dev').trim() === "dev" ? true:false;
    console.log(entry);
    return {
        mode: (isDev || true) ? "development":"production",
        devtool: (isDev || true) ? "cheap-module-eval-source-map":false,
        optimization: {
            minimize: isDev ? false:true
        },
        devServer: {
            contentBase: __dirname,
            watchContentBase: true,
            compress: true,
            bonjour: true,
            clientLogLevel: 'debug',
            port: 3001
        },
        entry,
        output: {
            path: __dirname + "/dist",
            filename: 'bundle.js'
        },
        resolve: {
            alias: {
                'vue$': __dirname + '/node_modules/vue/dist/vue.esm.js',
                'd3-scale': 'd3-scale/dist/d3-scale.min.js'
            },
        },
        module: {
            rules: [{
                test: /\.(vue)$/,
                use: ['vue-loader']
            }, {
                test: /\.html$/,
                use: [{
                    loader: 'html-loader',
                    options: {
                        interpolate: true
                    }
                }]
            }, {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader']
            }]
        },
        plugins 
    }
}