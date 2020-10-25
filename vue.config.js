const path = require('path')
module.exports = {
  lintOnSave: false,
  configureWebpack: {
    target: 'electron-renderer',
    resolve: {
      alias: {
        '@/': path.resolve(__dirname, 'src/'),
      },
    },
  },
}
