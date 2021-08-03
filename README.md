# 深入浅出微前端

- 背景？
- 什么是微前端？
- 对比各方案优缺点？
- systemjs是什么？
- single-spa使用和原理？
- qiankun使用和原理？
- umi-qiankun如何工作？
- webpack5 module federation是什么？
- emp实践
- 智慧案场微前端方案
  - 架构设计？umi-qiankun
  - 子产品接入指南？
  - 如何借助@focus/cli更好的工作？
  - @focus/pro-com

## 背景

在微前端出现之前，一个系统的前端开发模式基本都是单仓库，包含了所有的功能、代码...

很多企业也基本在物理上进行了应用代码隔离，实行单个应用单个库，闭环部署更新测试环境和正式环境。

比如我们公司的权限管理后台，首页中罗列了各个系统的入口，每个系统由单独仓库管理，点击具体系统，打开新窗口进行访问。

![admin-panel](./assets/admin-panel.jpg)

由于多个应用一级域名一致，使用不同二级域名区分。`cookie`存放在一级域名下，所以各应用可以借此实现用户信息的一致性。但是对于**头部、左侧菜单**通用的模块，以及多个应用之间如何实现资源共享？

我们尝试采用**npm包形式**对**头部、左侧菜单**抽离成npm包的形式进行管理和使用。但是却带来了**发布效率低下**的问题；

> 如果需要迭代npm包内的逻辑业务，需要先发布npm包之后，再每个使用了该npm包的应用都更新一次npm包版本，再各自构建发布一次，过程繁琐。如果涉及到的应用更多的话，花费的人力和精力就更多了。

不仅如此，我们可能还有下面几个诉求：

- 不同团队间开发同一个应用技术栈不同怎么办？
- 希望每个团队都可以独立开发，独立部署怎么办？（上述方式虽然可以解决，但是体验不好）
- 项目中还需要老的应用代码怎么办？

## 什么是微前端

在2016年，微前端的概念诞生。[micro-frontends](https://micro-frontends.org/)中定义`Techniques, strategies and recipes for building a modern web app with multiple teams that can ship features independently.`翻译成中文为`用来构建能够让 多个团队 独立交付项目代码的 现代web app 技术，策略以及实践方法`。

![micro-service](./assets/micro-service.jpg)

微前端也是借鉴后端微服务的思想。微前端就是将不同的功能按照不同的纬度拆分成多个子应用。通过主应用来加载这些子应用。

微前端的核心在于**先拆后合**。

### 微前端优势

- 同步更新
- 增量升级
- 简单、解耦的代码库
- 独立开发、部署

### 微前端解决方案

- 基座模式：通过搭建基座、配置中心来管理子应用。如基于`single spa`的`qiankun`方案。
- 自组织模式：通过约定进行互相调用，但会遇到处理第三方依赖的问题。
- 去中心模式：脱离基座模式，每个应用之间都可以批次分享资源。如基于`webpack5 module federation`实现的`EMP微前端方案`，可以实现多个应用彼此共享资源。


## 为什么不是TA
### 为什么不是 iframe

`qiankun技术圆桌`中有一篇关于微前端[Why Not Iframe](https://www.yuque.com/kuitos/gky7yw/gesexv)的思考，下面贴一下`iframe`的优缺点

- iframe 提供了浏览器原生的硬隔离方案，不论是样式隔离、 js 隔离这类问题统统都能被完美解决。
- url 不同步。浏览器刷新 iframe url 状态丢失、后退前进按钮无法使用。
- UI 不同步，DOM 结构不共享。想象一下屏幕右下角 1/4 的 iframe 里来一个带遮罩层的弹框，同时我们要求这个弹框要浏览器居中显示，还要浏览器 resize 时自动居中..
- 全局上下文完全隔离，内存变量不共享。iframe 内外系统的通信、数据同步等需求，主应用的 cookie 要透传到根域名都不同的子应用中实现免登效果。
- 慢。每次子应用进入都是一次浏览器上下文重建、资源重新加载的过程。

因为这些原因，最终大家都舍弃了 iframe 方案。

### 为什么不是 Web Component

[MDN Web Components](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components)由三项主要技术组成，它们可以一起使用来创建封装功能的定制元素，可以在你喜欢的任何地方重用，不必担心代码冲突。

- **Custom elements（自定义元素）**：一组JavaScript API，允许您定义custom elements及其行为，然后可以在您的用户界面中按照需要使用它们。

- **Shadow DOM（影子DOM）**：一组JavaScript API，用于将封装的“影子”DOM树附加到元素（与主文档DOM分开呈现）并控制其关联的功能。通过这种方式，您可以保持元素的功能私有，这样它们就可以被脚本化和样式化，而不用担心与文档的其他部分发生冲突。

- **HTML templates（HTML模板）**： `<template> 和 <slot> `元素使您可以编写不在呈现页面中显示的标记模板。然后它们可以作为自定义元素结构的基础被多次重用。

官方提供的示例[web-components-examples](https://github.com/mdn/web-components-examples)。

但是兼容性很差，查看[can i use WebComponents](https://caniuse.com/?search=WebComponents)。

![web-component](./assets/web-component.png)

### 为什么不是ESM

`ESM`即`ES Module`，是一种前端模块化手段。他能做到微前端的几个核心点

- **无技术栈限制**： ESM加载的只是js内容，无论哪个框架，最终都要编译成js，因此，无论哪种框架，ESM都能加载。
- **应用单独开发**： ESM只是js的一种规范，不会影响应用的开发模式。
- **多应用整合**： 只要将微应用以ESM的方式暴露出来，就能正常加载。
- **远程加载模块**: ESM能够直接请求cdn资源，这是它与生俱来的能力。

但是可惜的是兼容性不好，查看[can i use import](https://caniuse.com/mdn-javascript_statements_import)。

![es-module](./assets/es-module.png)

## single spa

查看`single-spa`配置文件[rollup.config.js](https://github.com/single-spa/single-spa/blob/master/rollup.config.js#L44)可得知，使用了`rollup`做打包工具，并采用的`system`模块规范做输出。

> 感兴趣可查看对[@careteen/rollup](https://github.com/careteenL/rollup)的简易实现。

那我们就很有必要先介绍下`SystemJS`的相关知识。

### SystemJS使用

`SystemJS` 是一个通用的模块加载器，它能在浏览器上动态加载模块。微前端的核心就是加载微应用，我们将应用打包成模块，在浏览器中通过 `SystemJS` 来加载模块。

> 下方示例存放在[@careteen/micro-fe/system.js](https://github.com/careteenL/micro-fe/tree/master/system.js)，感兴趣可以前往调试。

#### 新建项目并配置

安装依赖

```shell
$ mkdir system.js
$ yarn init
$ yarn add webpack webpack-cli webpack-dev-server babel-loader @babel/core @babel/preset-env @babel/preset-react html-webpack-plugin -D
$ yarn add react react-dom
```

配置`webpack.config.js`文件，采用`system.js`模块规范作为`output.libraryTarget`，并不打包`react/react-dom`。

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = (env) => {
  return {
    mode: "development",
    output: {
      filename: "index.js",
      path: path.resolve(__dirname, "dest"),
      libraryTarget: env.production ? "system" : "",
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
```

配置`.babelrc`文件

```json
{
  "presets":[
    "@babel/preset-env",
    "@babel/preset-react"
  ]
}
```

配置`package.json`文件

```json
"scripts": {
  "dev": "webpack serve",
  "build": "webpack --env production"
},
```

#### 编写js、html代码

新建`src/index.js`入口文件

```js
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <h1>hello system.js</h1>,
  document.getElementById('root')
)
```

新建`public/index.html`文件，以cdn的形式引入`system.js`，并且将`react/react-dom`作为前置依赖配置到`systemjs-importmap`中。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>system.js demo</title>
  </head>

  <body>
    <script type="systemjs-importmap">
      {
        "imports": {
          "react": "https://cdn.bootcdn.net/ajax/libs/react/17.0.2/umd/react.production.min.js",
          "react-dom": "https://cdn.bootcdn.net/ajax/libs/react-dom/17.0.2/umd/react-dom.production.min.js"
        }
      }
    </script>
    <div id="root"></div>
    <script src="https://cdn.bootcdn.net/ajax/libs/systemjs/6.10.1/system.min.js"></script>
    <script>
      System.import("./index.js").then(() => {});
    </script>
  </body>
</html>
```

然后命令行运行

```shell
$ npm run dev # or build
```

打开浏览器访问，可正常显示文本。

#### 查看dest目录

观察`dest/index.js`文件，可发现通过`system.js`打包后会根据`webpack`配置而先`register`预加载`react/react-dom`然后返回`execute`执行函数。

```js
System.register(["react","react-dom"], function(__WEBPACK_DYNAMIC_EXPORT__, __system_context__) {
  return {
    setters: [
      // ...
    ],
    execute: function() {
      // ...
    }
  };
});
```

并且我们在使用时是通过`System.import("./index.js").then(() => {});`这个形式。

基于上述观察，我们了解到`system.js`两个核心`api`

- System.import ：加载入口文件
- System.register ：预加载

下面将做个简易实现。

### SystemJS原理

> 下方实现原理代码存放在[@careteen/micro-fe/system.js/dest/index.html](https://github.com/careteenL/micro-fe/blob/master/system.js/dest/index.html)，感兴趣可以前往调试。

首先提供构造函数，并将`window`的属性存一份，目的是查找对`window`属性进行的修改。

```js
function SystemJS() {}
let set = new Set();
const saveGlobalPro = () => {
  for (let p in window) {
    set.add(p);
  }
};
const getGlobalLastPro = () => {
  let result;
  for (let p in window) {
    if (set.has(p)) continue;
    result = window[p];
    result.default = result;
  }
  return result;
};

saveGlobalPro();
```

实现`register`方法，主要是对前置依赖做存储，方便后面加载文件时取值加载。

```js
let lastRegister;
SystemJS.prototype.register = function (deps, declare) {
  // 将本次注册的依赖和声明 暴露到外部
  lastRegister = [deps, declare];
};
```

使用`JSONP`提供`load`创建`script`脚本函数。

```js
function load(id) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = id;
    script.async = true;
    document.head.appendChild(script);
    script.addEventListener("load", function () {
      // 加载后会拿到 依赖 和 回调
      let _lastRegister = lastRegister;
      lastRegister = undefined;

      if (!_lastRegister) {
        resolve([[], function () {}]); // 表示没有其他依赖了
      }
      resolve(_lastRegister);
    });
  });
}
```

实现`import`方法，传参为`id`即入口文件，加载入口文件后，解析[查看dest目录](#查看dest目录)中的`setters和execute`。

由于`react` 和 `react-dom` 会给全局增添属性 `window.React`,`window.ReactDOM`属性，所以可以通过`getGlobalLastPro`获取到这些新增的依赖库。

```js
SystemJS.prototype.import = function (id) {
  return new Promise((resolve, reject) => {
    const lastSepIndex = window.location.href.lastIndexOf("/");
    const baseURL = location.href.slice(0, lastSepIndex + 1);
    if (id.startsWith("./")) {
      resolve(baseURL + id.slice(2));
    }
  }).then((id) => {
    let exec;
    // 可以实现system模块递归加载
    return load(id)
      .then((registerition) => {
        let declared = registerition[1](() => {});
        // 加载 react 和 react-dom  加载完毕后调用setters
        // 调用执行函数
        exec = declared.execute;
        return [registerition[0], declared.setters];
        // {setters:[],execute:function(){}}
      })
      .then((info) => {
        return Promise.all(
          info[0].map((dep, i) => {
            var setter = info[1][i];
            // react 和 react-dom 会给全局增添属性 window.React,window.ReactDOM
            return load(dep).then((r) => {
              // console.log(r);
              let p = getGlobalLastPro();
              // 这里如何获取 react和react-dom?
              setter(p); // 传入加载后的文件
            });
          })
        );
      })
      .then(() => {
        exec();
      });
  });
};
```

上述简单实现了`system.js`的核心方法，可注释掉cdn引入形式，使用自己实现的进行测试，可正常展示。

```js
let System = new SystemJS();
System.import("./index.js").then(() => {});
```

### single spa使用

> 下方示例代码存放在[@careteen/micro-fe/single-spa](https://github.com/careteenL/micro-fe/tree/master/single-spa)，感兴趣可以前往调试。

安装脚手架，方便快速创建应用。
```shell
$ npm i -g create-single-spa
```
#### 创建基座

```shell
$ create-single-spa base
```

![create-single-spa-base](./assets/create-single-spa-base.png)

在`src/careteen-root-config.js`文件中新增下面子应用配置

```js
registerApplication({
  name: "@careteen/vue", // 应用名字
  app: () => System.import("@careteen/vue"), // 加载的应用
  activeWhen: ["/vue"], // 路径匹配
  customProps: {
    name: 'single-spa-base',
  },
});

registerApplication({
  name: "@careteen/react",
  app: () => System.import("@careteen/react"),
  activeWhen: ["/react"],
  customProps: {
    name: 'single-spa-base',
  },
});
start({
  urlRerouteOnly: true, // 全部使用SingleSpa中的reroute管理路由
});
```

提供`registerApplication`方法注册并加载应用，`start`方法启动应用

查看`src/index.ejs`文件

```html
<script type="systemjs-importmap">
  {
    "imports": {
      "single-spa": "https://cdn.jsdelivr.net/npm/single-spa@5.9.0/lib/system/single-spa.min.js"
    }
  }
</script>
<link rel="preload" href="https://cdn.jsdelivr.net/npm/single-spa@5.9.0/lib/system/single-spa.min.js" as="script">

<script>
  System.import('@careteen/root-config');
</script>
```

可得知需要`single-spa`作为前置依赖，并且实现`preload`预加载，最后加载基座应用`System.import('@careteen/root-config');`。

下面继续使用脚手架创建子应用

#### 创建vue项目

```shell
$ create-single-spa slave-vue
```

![create-single-spa-vue](./assets/create-single-spa-vue.png)

此处选择`vue3.x`版本。新建`vue.config.js`配置文件，配置开发端口号为`3000`

```js
module.exports = {
  devServer: {
    port: 3000,
  },
}
```

还需要修改`src/router/index.js`

```js
const router = createRouter({
  history: createWebHistory('/vue'),
  routes,
});
```

在基座中配置

```html
<script type="systemjs-importmap">
  {
    "imports": {
      "@careteen/root-config": "//localhost:9000/careteen-root-config.js",
      "@careteen/slave-vue": "//localhost:3000/js/app.js"
    }
  }
</script>
```

#### 创建react项目

```shell
$ create-single-spa slave-react
```

![create-single-spa-react](./assets/create-single-spa-react.png)

修改开发端口号为`4000`

```json
"scripts": {
  "start": "webpack serve --port 4000",
}
```

创建下面路由

```js
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from 'react-router-dom'
import Home from './components/Home.js'
import About from './components/About.js'

export default function Root(props) {
  return <Router basename="/react">
    <div>
      <Link to="/">Home React</Link>
      <Link to="/about">About React</Link>
    </div>
    <Switch>
      <Route path="/"  exact={true} component={Home}></Route>
      <Route path="/about" component={About}></Route>
      <Redirect to="/"></Redirect>
    </Switch>
  </Router>
}
```

在基座中配置`react/react-dom`以及`@careteen/react`

```html
<script type="systemjs-importmap">
  {
    "imports": {
      "single-spa": "https://cdn.jsdelivr.net/npm/single-spa@5.9.0/lib/system/single-spa.min.js",
      "react":"https://cdn.bootcdn.net/ajax/libs/react/17.0.2/umd/react.production.min.js",
      "react-dom":"https://cdn.bootcdn.net/ajax/libs/react-dom/17.0.2/umd/react-dom.production.min.js"        
    }
  }
</script>
<script type="systemjs-importmap">
  {
    "imports": {
      "@careteen/root-config": "//localhost:9000/careteen-root-config.js",
      "@careteen/slave-vue": "//localhost:3000/js/app.js",
      "@careteen/react": "//localhost:4000/careteen-react.js"
    }
  }
</script>
```

#### 启动项目

```shell
$ cd base && yarn start
$ cd ../slave-vue && yarn start
$ cd ../slave-react && yarn start
```

浏览器打开 http://localhost:9000/

![single-spa-base](./assets/single-spa-base.png)

手动输入 http://localhost:9000/vue/

![single-spa-vue](./assets/single-spa-vue.png)

手动输入 http://localhost:9000/react/

![single-spa-react](./assets/single-spa-react.png)

### single spa原理



## qiankun


