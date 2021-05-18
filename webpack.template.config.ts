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
    main: ['./template/main.tsx'],
  },
  devtool: devMode ? 'source-map' : false,
  devServer: {
    port: 3536,
  },
  target: 'web',
  resolve: {
    extensions: ['.js', '.json', '.ts', '.jsx', '.tsx'],
    alias: {
      '@': resolve(srcPath, 'template'),
      common: resolve(srcPath, 'common'),
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
      template: './template/index.html',
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
    path: resolve(__dirname, './webpack-dist/template'),
    filename: 'index.js',
  },
} as Configuration
