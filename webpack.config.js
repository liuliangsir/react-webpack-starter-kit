const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
    name: 'development-cache',
  },
  output: {
    path: resolve('dist'),
    filename: '[name].[contenthash].js',
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
          },
        ],
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Welcome to sivaraj-v github ',
      template: './src/index.html',
      filename: './index.html',
      'meta': {
        'viewport': 'width=device-width, initial-scale=1.0',
        'charset': 'UTF-8'
      }
    }),
    new webpack.ProgressPlugin({ percentBy: "entries" }),
    new MiniCssExtractPlugin({
      filename: `[name].css`,
    }),
  ],
  snapshot: {
    managedPaths: [resolve('./node_modules')],
    immutablePaths: [],
    buildDependencies: {
      hash: true,
      timestamp: true,
    },
    module: {
      timestamp: true,
    },
    resolve: {
      timestamp: true,
    },
    resolveBuildDependencies: {
      hash: true,
      timestamp: true,
    },
  },
  devServer: {
    client: {
      port: '443',
      host: '3000-turquoise-haddock-rgc28dxs.ws-us03.gitpod.io',
    },
    static: [
      {
        directory: resolve('dist'),
      },
    ],
    port: 3000,
    firewall: false,
    host: '0.0.0.0',
  },
  experiments: {
    topLevelAwait: true,
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: (module) => {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            // npm package names are URL-safe, but some servers don't like @ symbols
            return `npm.${packageName.replace('@', '')}`;
          },
        },
      },
    },
  },
  mode: 'development',
  entry: resolve('./src/index.js'),
  infrastructureLogging: { debug: /PackFileCache/ },
};
