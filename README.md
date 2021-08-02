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

先介绍下`SystemJS`

### SystemJS

`SystemJS` 是一个通用的模块加载器，它能在浏览器上动态加载模块。微前端的核心就是
加载微应用，我们将应用打包成模块，在浏览器中通过 `SystemJS` 来加载模块。

## qiankun


