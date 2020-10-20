const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// the path(s) that should be cleaned
let pathsToClean = ['dist'];

// the clean options to use
let cleanOptions = {
  root: path.resolve(__dirname),
  // exclude: ['shared.js'],
  verbose: true,
  dry: false,
};
module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx'],
    modules: ['src']
  },
  externals: ['vue-router', 'lodash', 'qs', 'axios', 'element-ui', 'nprogress', 'blueimp-md5', 'vue', '@stl/request'],
  // devtool: 'source-map',// 打包出的js文件是否生成map文件（方便浏览器调试）
  mode: 'production',
  entry: {
    index: './src/index.ts'
  },
  output: {
    filename: '[name].js',// 生成的fiename需要与package.json中的main一致
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
    libraryExport: "default",
    library: "PowerPlugin"
  },
  module: {
    rules: [
      { parser: { system: false } },
      {
        test: /\.ts?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              // 指定特定的ts编译配置，为了区分脚本的ts配置
              configFile: path.resolve(__dirname, './tsconfig.json'),
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css?$/,
        use: [
          { loader: 'style-loader' },
          // css-loader
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          },
          // sass-loader
          { loader: 'sass-loader' }
        ]
      },
    ],
  },
  plugins: [new CleanWebpackPlugin()],
};