const VueLoaderPlugin = require('vue-loader/lib/plugin');
module.exports = function(env) {
  let entry = env.MAIN || './src/main/basic.js';
  console.log(entry);
  return {
    mode: "development",
    entry,
    output: {
      path: __dirname + "/dist",
      filename: 'bundle.js'
    },
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        'd3-scale': 'd3-scale/dist/d3-scale.min.js'
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
      }, {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      }]
    },
    plugins: [
      new VueLoaderPlugin()
    ]
  }
}
