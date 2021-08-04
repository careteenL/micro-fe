module.exports = {
  publicPath: '//localhost:20000', //保证子应用静态资源都是像20000端口上发送的
  devServer: {
    port: 20000, // fetch
    headers:{
      'Access-Control-Allow-Origin': '*'
    }
  },
  configureWebpack: { // 需要获取我打包的内容  systemjs=》 umd格式
    output: {
      libraryTarget: 'umd',
      library: 'slave-vue'// window['slave-vue']
    }
  }
}

// 3000 -> 20000 基座回去找20000端口中的资源，  publicPath  /
