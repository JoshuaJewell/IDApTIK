const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/main.ts",
  target: "web",
  output: {
    filename: '[name].js',
    sourceMapFilename: "[file].map",
    path: path.resolve(__dirname, "dist"),
  },
  devtool: "source-map",
  devServer: {
    port: 9000,
    allowedHosts: 'all',
    devMiddleware: {
        writeToDisk: true
    },
    static: {
        directory: path.resolve(__dirname)
    }
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif|bmp|wav|mp3)$/i,
        type: "asset/resource",
      },
      {
        test: /\.js$/,
        use: ["source-map-loader"],
        exclude: [path.resolve(__dirname, "node_modules/excalibur")],
        enforce: "pre",
      },
      {
        test: /\.(ts)?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      '@': path.resolve('src')
    }
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebPackPlugin({
      title: "Excalibur Webpack Sample",
      template: 'index.html',
      inject: 'body'
    }),
  ],
};