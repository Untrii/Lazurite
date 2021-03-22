const path = require('path')

module.exports = {
  resolve: {
    extensions: ['.ts', '.js'],
  },
  devtool: 'source-map',
  entry: './src-main/index.dev.ts',
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
    path: path.resolve(__dirname, './dist/main'),
    filename: '[name].js',
  },
}
