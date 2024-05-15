# import-html-entry

- 作用：代替 system.js 功能，去实现加载子应用，并解析出 template、script、css

## 前置

- 大量使用正则表达式来处理
- [\s\S] 表示任意字符包含换行 \n
- /s 修饰符 搭配 . 的时候可以匹配任意字符且包含换行\n

- 修饰符
- 边界 \b
- 范围 []
  - IE 不支持 unicode 属性，需要使用 XRegExp 做兼容
    - 多年来，他的命名捕获、等功能被 RegExp 收纳实现
  - 包含 [a-z]
  - 不包含 ^
    - [^0-9] 同 \D
  - 不需要转义
    - [-().^+]
    - 为了以防万一转义他们 也不会存在问题
- 量词

## 资料

- [正则表达式详解](https://zh.javascript.info/regular-expressions)
