const path = require('path')

const devMode = process.env.NODE_ENV != 'production'

module.exports = {
  resolve: {
    extensions: ['.ts', '.js'],
  },
  devtool: devMode ? false : 'source-map',
  entry: devMode ? './src-main/index.dev.ts' : './src-main/index.ts',
  target: 'electron-main',
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, './webpack-dist'),
    filename: '[name].js',
  },
}
