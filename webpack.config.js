'use strict';

const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const SRC_DIR = path.resolve(__dirname, 'client/src');
const OUT_DIR = path.resolve(__dirname, 'client/dist');

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: SRC_DIR + '/index.html',
  filename: 'index.html',
  favicon: SRC_DIR + '/favicon.ico',
  inject: 'body'
});

const config = {
  entry: SRC_DIR + '/index.jsx',
  output: {
    path: OUT_DIR,
    publicPath: '/', // Need to define this in case the URL resolves to nested
                     // assets
    filename: 'app.js'
  },
  plugins: [
    new ExtractTextPlugin('app.css'),
    // TODO: Change this on deploy
    new webpack.DefinePlugin({
      ENVIRONMENT: JSON.stringify('development'),
      SERVER_URL: JSON.stringify('http://127.0.0.1:3334'),
    }),
    HtmlWebpackPluginConfig
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: SRC_DIR,
        loader: 'babel-loader',
        query: {
            presets: ['es2015', 'react']
        }
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({ fallback: 'style-loader',
                                            use: 'css-loader' })
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({ fallback: 'style-loader',
                                            use: 'css-loader!sass-loader' })
      }
    ]
  }
};

module.exports = config;

