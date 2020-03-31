const VueLoaderPlugin = require('vue-loader/lib/plugin');
module.exports = {
    mode: "development",
    entry: "./src/main.js",
    output: {
        path: __dirname + "/dist",
        filename: 'bundle.js'
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        },
        extensions: ['*', '.js', '.vue', '.json']
    },
    module: {
        rules: [{
            test: /\.(vue)$/,
            use: ['vue-loader']
        }, {
            test: /\.html$/,
            use: ['html-loader']
        }]
    },
    plugins: [
        new VueLoaderPlugin()
    ]
}