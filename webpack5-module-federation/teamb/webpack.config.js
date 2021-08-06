let HtmlWebpackPlugin = require("html-webpack-plugin");
const { experiments } = require("webpack");
let ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
    mode: "development",
    devtool: false,
    //teama port 3000 host 
    //teamb port 8000 container remote
    devServer: {
        port: 8000
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
        new ModuleFederationPlugin({
            name: 'teamb',//应用的唯一标识
            filename: 'remoteEntry.js',//生成的文件名
            library: { type: 'umd', name: 'varTeamb' },//teama加载teamb的时候 ，加载的结果 其实就是得到一个全局变量
            exposes: {//作为容器，需要向外暴露的模块或者说组件 key就是别名，值就是本地引入的路径
                './Dropdown': "./src/Dropdown.js",
                './Button': "./src/Button.js",
                './store': './src/store.js'
            },
            shared: ["is-array"]
        })
    ],
    experiments: {
        topLevelAwait: true //支持顶级wait import
    }

}