import { join, resolve } from 'path'
import { Configuration } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const srcPath = resolve(__dirname, 'src')
const distPath = resolve(__dirname, 'dist')

export default {
  context: srcPath,
  entry: {
    main: ['./main.tsx'],
  },
  devtool: 'source-map',
  target: 'electron-renderer',
  resolve: {
    extensions: ['.js', '.json', '.ts', '.jsx', '.tsx'],
    alias: {
      '~': srcPath,
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
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
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
  ],
} as Configuration
