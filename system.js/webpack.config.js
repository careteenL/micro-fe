const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = (env) => {
  return {
    mode: "development",
    output: {
      filename: "index.js",
      path: path.resolve(__dirname, "dest"),
      libraryTarget: env.production ? "system" : "", // 打包的格式  system模块
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: { loader: "babel-loader" },
          exclude: /node_modules/,
        },
      ],
    },
    plugins: [
      !env.production &&
        new HtmlWebpackPlugin({
          template: "./public/index.html",
        }),
    ].filter(Boolean),
    externals: env.production ? ["react", "react-dom"] : [],
  };
};
