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
      '@assets': path.resolve(__dirname, './src/renderer/assets/index'),
      '@components': path.resolve(__dirname, './src/renderer/components/'),
      '@css': path.resolve(__dirname, './src/renderer/css/'),
      '@entities': path.resolve(__dirname, './src/renderer/entities/'),
      Repositories: path.resolve(__dirname, './renderer/repositories/'),
      '@services': path.resolve(__dirname, 'src/renderer/services/'),
      '@utils': path.resolve(__dirname, 'src/renderer/utils/'),
      vue$: 'vue/dist/vue.esm.js',
    },
  },
}
