const VueLoaderPlugin = require('vue-loader/lib/plugin')
module.exports = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
    ],
  },
  plugins: [new VueLoaderPlugin()],
  resolve: {
    extensions: ['*', '.js', '.vue', '.json'],
    alias: {
      Entities: path.resolve(__dirname, 'src/entities/'),
      Repository: path.resolve(__dirname, 'src/repository/'),
      vue$: 'vue/dist/vue.esm.js',
    },
  },
}
