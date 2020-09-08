var path = require("path");
var webpack = require("webpack");

module.exports = {
  context: __dirname,
  debug: true,
  devtool: "#inline-source-map",
  entry: {
    Simple: __dirname + "/Simple/index.js",
  },
  output: {
    path: __dirname,
    filename: "[name]/build.js",
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  resolve: {
    alias: {
      "react-dnd-line": path.join(__dirname, "..", "lib/"),
    },
    extensions: ["", ".js"],
  },

  stats: {
    colors: true,
    chunks: false,
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ["babel-loader"],
        include: [__dirname, path.join(__dirname, "..", "src")],
      },
      {
        test: /\.scss$/,
        loaders: ["style", "css", "sass"],
        include: [__dirname, path.join(__dirname, "..", "node_modules")],
      },
    ],
  },
};
