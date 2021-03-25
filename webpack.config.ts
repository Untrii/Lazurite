import { join, resolve } from 'path'
import { Configuration } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'

const srcPath = resolve(__dirname, 'src')
const distPath = resolve(__dirname, 'dist')

const devMode = process.env.NODE_ENV != 'production'

export default {
  context: srcPath,
  entry: {
    main: ['./main.tsx'],
  },
  devtool: devMode ? false : 'source-map',
  devServer: {
    port: 3535,
  },
  target: 'electron-renderer',
  resolve: {
    extensions: ['.js', '.json', '.ts', '.jsx', '.tsx'],
    alias: {
      '@': srcPath,
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
      {
        test: /\.s(a|c)ss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jpg|svg|gif|ttf|woff|woff2|eot)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
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
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          keep_classnames: true,
        },
      }),
    ],
  },
  output: {
    path: resolve(__dirname, './webpack-dist'),
    filename: 'renderer.js',
  },
} as Configuration
