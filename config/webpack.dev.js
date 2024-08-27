const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.js');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

let config = {
  mode: 'development',
  output: {
    path: path.resolve(__dirname, '../dist')
  },
  // mode: 'production',
  devtool: 'eval-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, '../dist'),
    host: 'localhost',
    compress: true,
    port: 8888,
    historyApiFallback: true
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'server',
      analyzerHost: '127.0.0.1',
      analyzerPort: 8889,
      reportFilename: 'report.html',
      defaultSizes: 'parsed',
      openAnalyzer: true,
      generateStatsFile: false,
      statsFilename: 'stats.json',
      statsOptions: null,
      logLevel: 'info'
    })
  ]
};
module.exports = merge(baseConfig, config);