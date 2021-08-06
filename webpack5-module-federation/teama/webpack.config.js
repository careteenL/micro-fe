let HtmlWebpackPlugin = require("html-webpack-plugin");
const { experiments } = require("webpack");
let ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
    mode: "development",
    devtool: false,
    //teama port 3000 host 
    //teamb port 8000 container remote
    devServer: {
        port: 3000
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
        new ModuleFederationPlugin({
            name: 'teama',//应用的唯一标识
            filename: 'remoteEntry.js',//生成的文件名
            //library: { type: 'umd', name: 'varTeamb' }//teama加载teamb的时候 ，加载的结果 其实就是得到一个全局变量
            remotes: {
                //@后面是远程JS文件的经对路径
                teamb: "varTeamb@http://localhost:8000/remoteEntry.js"
            },
            shared: ["is-array"]
        })
    ],
    experiments: {
        topLevelAwait: true //支持顶级wait import
    }

}