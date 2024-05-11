# 微前端

- 方案对比
  - iframe
  - web component
  - esm
  - systemjs
  - single spa
  - qiankun
  - webpack5 模块联邦
- systemjs
  - importmap
    - 解决在浏览器端实现类似于 nodejs 中导入全局模块的方式`import * as lodash from 'lodash'`
    - 因为浏览器不知道从哪里导入全局模块，所以需要 map 来做别名
    - 自己实现了解析 scritp 的 type 为 systemjs-importmap，并将内容存在 map 中
  - register
  - import
    - 递归处理引用
    - jsonp 加载模块
- single spa
  - systemjs 管理模块
    - systemjs 可以解决兼容性问题
    - 也可以采用 webpack 来管理模块，不过会增加主应用和子应用间的工程耦合
  - rollup 打包
  - registerApplication
  - start
  - 状态机
  - reroute 核心方法实现
  - 样式隔离
    - 子应用 webpack 插件加前缀
  - js 隔离
    - 快照
  - 不足
    - 虽然提供了微前端方法，但隔离这块做的不够好
    - 虽然提供了大量实践参考，但给用户增加心智负担，不够完善
- qiankun
  - 基于 single spa
  - 不用 systemjs，而用 fetch 去加载子应用
  - 提供多种样式隔离方案
    - shadow dom
  - 提供多种js隔离方案
    - 宽松沙箱
    - proxy 沙箱
    - 快照沙箱

## 资料

- [微前端框架 single-spa 技术分析](https://www.cnblogs.com/everfind/p/single-spa.html)