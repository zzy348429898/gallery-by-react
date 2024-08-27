const merge = require('webpack-merge');//webpack配置文件合并工具
const baseConfig = require('./webpack.base.js');//基础配置
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

let config = {
  mode:'production',
  output: {
    path: path.resolve(__dirname, '../dist'),
    // filename: 'bundle.js',
    // filename: '[name]_[id]_[hash]',
    filename: '[name]_[contenthash].js',
    publicPath: ''
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash]_[hash].css',
      chunkFilename: '[id].css'
    })
  ]
};
// console.log(merge(baseConfig, config));
module.exports = merge(baseConfig, config);