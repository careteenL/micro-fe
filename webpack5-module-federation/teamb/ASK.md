xport default ArrowIcon
那这个玩意咋能是react呢
这里主要是把一个模块演示成shared module，用什么模块并不重要，你用react也行，就是大了一点。
代表 代表 代表
代表的引用模块
为啥导出字符串，怎么用？
导出什么不重要。重要的是导出的东西对isArray模块存在引用
为什么要await import
为什么要awaitimport
import是promise啊
峰2598送给老师一朵
写错地方了
地方错了
为啥不用umd打包
window.varTeamb
这里感觉和


The top-level-await experiment is not enabled


这里感觉和output的配置的library差不多 是的
output:{
    library:
    libraryTarget:
}
如果都没提供呢
这个要webpack 开启
笔记用啥写的
老师你说的这些划分模块splitChunks都可以做到，有啥区别？
bootstrap.js是什么用呀
本地模块需要异步引入吗？
本地模块可以同步引入，也可以异步引入
远程模块只能异步引入
可以异步，也可以同步
你们都能听懂？

这个什么意思
就是导出了对引用模块的使用  代表使用了引用的模块就行了
这个远程地址应该会直接替换掉import 里的teamb吧
远程路径必须写死吗
远程地址@前面的表示啥意思
远程去加载teamb，加载完成后window上多了个varTeamb属性。
为什么webpack打包后的文件，每一行都有 /******/ 这些注释？
有注释插件的，忘了叫啥名字了
teamA的@前面的名字可以和temb提供的不同吗？
一定要相同 
这样每次打包的时候都要把依赖应用start起来 那如果依赖很多的话 不是也很麻烦？
一般来说
每个项目 是单独构建，单独打包，单独上线

嗷 这么看不能
import(teams/xxx)这种用法对ts


import(teams/xxx)这种用法对ts不友好啊

EMP里会有对就在
感觉这个联邦模块，不会普及。。。
如果都没提供共享模块呢
为啥为啥异步加载
远程模块也没办法 同步引入啊
生产环境 怎么配置啊
那技术盏不同的remote怎么处理，讲一下emp吧
如果teamB更新了  teamA怎么感知到呢？缓存策略是？


异步模式有三种
加载远程 模式有三种方式
require.f.j 加载的当前的项目的模式 src_LoginModal_js.js ./src/bootstrap.js
require.f.remotes 远程模块 teamb/Button teamb/Dropdown
require.f.consumes is-array 共享模块



没有用webpack5的项目 如何引入？？？共享？
不会有跨域的问题吗？
感觉js文件加载数量会爆炸
异步加载js文件，不会有跨域的问题吗？
图片标签，script标签不会跨域
jsonp呢
component as service
远程模块加载到本地，再怎么处理这里没理解~求解
teamb 可以 按需加载组件吗？能细颗粒度进行codw split吗
不同项目teamb重复咋办
名字
a里使用远程b，b远程模块会阻碍页面加载？
没有webpack5，低于5的项目的如何引进共享模块了？
emp讲一讲
不同框架可以用互用组件吗
傻了好像可以，都是编译结果使用吧
window.teamb(xxx)
只要点就可以了，不要.get()


傻了好像可以，都是编译结果使用吧
window.teamb(xxx)
只要点就可以了，不要.get()
这个是不是对不同技术栈整合不太友好？？
shine送给老师一朵
胡汉三送给老师一朵
谢谢老师老师辛苦
晓码送给老师一朵
zcj送给老师一朵
直接import引入，是异步引入？