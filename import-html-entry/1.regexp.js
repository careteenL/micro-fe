
/**
 * @desc match 使用
 */
// Case 1
// let str = "We will, we will rock you";
// console.log(str.match(/we/gi)) ; // We,we（由两个匹配的子字符串构成的数组）

// Case 2
// let str = "aa We will, we will rock you";
// let result = str.match(/we/i); // 没有修饰符 g
// console.log( result, result[0] );     // We（第一个匹配项）
// console.log( result.length ); // 1
// // 详细信息：
// console.log( result.index );  // 0（匹配项的位置）
// console.log( result.input );  // We will, we will rock you（源字符串）

/**
 * @desc replace 使用
 */
// Case 1
// console.log( "I love HTML ha".replace(/HTML/, "$& $` $' and $$ JavaScript") );


/**
 * @desc /s修饰符
 */
// console.log( "A\nB".match(/A.B/) ); // null（无匹配项）
// console.log( "A\nB".match(/A.B/s) ); // A\nB（匹配了！）
// console.log( "A\nB".match(/A[\s\S]B/) ); // A\nB（匹配了！）

/**
 * @desc /u修饰符
 * unicode 属性可用于被查找\p{L...}
 */
// Case 1 \p{L} 配合 u 使用
// let str = "A ბ ㄱ";
// console.log( str.match(/\p{L}/gu) ); // A,ბ,ㄱ
// console.log( str.match(/\p{L}/g) ); // null（没有匹配项，因为没有修饰符 "u"）
// console.log( '1 一'.match(/\p{N}/gu) );

// Case 2 中文
// let regexp = /\p{sc=Han}/gu; // 返回中文象形文字
// let str = `Hello Привет 你好 123_456`;
// console.log( str.match(regexp) ); // 你,好

// Case 3 货币单位 
// let regexp = /\p{Sc}\d/gu;
// let str = `Prices: $2, €1, ¥9`;
// console.log( str.match(regexp) ); // $2,€1,¥9

/**
 * @desc \b 边界
 */
// console.log('a 12:34 123:45'.match(/\b\d\d:\d\d\b/g))

/**
 * @desc 范围
 * 配合 unicode 修饰符 找到 中文 字母 数字 其他语言
 * Alpha 字母（中文+希腊字母）
 */
// Case 1
// let regexp = /[\p{Alpha}\p{M}\p{Nd}\p{Pc}\p{Join_C}]/gu;
// let str = `Hi 你好 12`;
// // 找出所有字母和数字：
// console.log( str.match(regexp) ); // H,i,你,好,1,2

// Case 2
// console.log( '𝒳'.match(/[𝒳𝒴]/u) ); // 显示了一个奇怪的字符，像 [?]，需要加 u 修饰符
//（搜索执行不正确，返回了半个字符）

// Case 3
// console.log( "JavaScript".match(/Java[^script]/) ); // "JavaS"

// Case 4 找到 hh:mm 或者 hh-mm 格式的时间
// let regexp = /\d\d[:-]\d\d/g;
// console.log( "Breakfast at 09:00. Dinner at 21-30".match(regexp) ); // 09:00, 21-30

/**
 * @desc 量词
 */
// Case 1
// console.log( "I'm 12345 years old".match(/\d{5}/) ); //  "12345"
// console.log( "I'm a12345 years old".match(/\b\d{5}\b/) ); //  null

// Case 2
// console.log('<h1>hi Careteen</h1>'.match(/<([a-z]+[a-z0-9]*)>(.*)<\/\1>/gi))
// console.log(/<([a-z]+[a-z0-9]*)>(.*)<\/\1>/gi.exec('<h1>hi Careteen</h1>')) // 可以拿到分组细节
// '<h1>hi Careteen</h1>',
//   'h1',
//   'hi Careteen',
//   index: 0,
//   input: '<h1>hi Careteen</h1>',
//   groups: undefined

// Case 3 针对 HTML 颜色的正则表达式
// let regexp = /#[0-9a-f]{6}\b/ig
// let str = "color:#121212; background-color:#AA00ef bad-colors:f#fddee #fd2 #12345678";
// console.log( str.match(regexp) )  // #121212,#AA00ef

/**
 * @desc 贪婪模式+惰性模式
 */
// Case 1
// let str = '...<a href="link1" class="doc">... <a href="link2" class="doc">...';
// let regexp = /<a href=".*?" class="doc">/g;
// // 蛤！一个匹配项中有两个链接！
// console.log( str.match(regexp) ); // <a href="link1" class="doc">... <a href="link2" class="doc">

// Case 2
// let str = '...<a href="link1" class="wrong">... <p style="" class="doc">...';
// let regexp = /<a href=".*?" class="doc">/g;
// // 错误的匹配！
// console.log( str.match(regexp) ); // <a href="link1" class="wrong">... <p style="" class="doc">

// Case 3
// let str1 = '...<a href="link1" class="wrong">... <p style="" class="doc">...';
// let str2 = '...<a href="link1" class="doc">... <a href="link2" class="doc">...';
// let regexp = /<a href="[^"]*" class="doc">/g
// // 有效！
// console.log( str1.match(regexp) ); // null，无匹配项，这是对的
// console.log( str2.match(regexp) ); // <a href="link1" class="doc">, <a href="link2" class="doc">

// Case 4 查找 HTML 注释
// let regexp = /<!--.*?-->/sg;
// let str = `... <!-- My -- comment
//  test --> ..  <!----> ..
// `;
// console.log( str.match(regexp) ); // '<!-- My -- comment \n test -->', '<!---->'

// Case 5 寻找 HTML 标签
// let regexp = /<[a-z][a-z0-9]*.*?>/g;
// let regexp = /<[^<>]+>/g
// let str = '<> <a href="/"> <input type="radio" checked> <b>';
// console.log( str.match(regexp) ); // '<a href="/">', '<input type="radio" checked>', '<b>'

/**
 * @desc 捕获分组
 */
// Case 1 校验邮箱
// let regexp = /[-.\w]+@([\w-]+\.)+[\w-]+/g;
// console.log("my@mail.com @ his@site.com.uk".match(regexp)); // my@mail.com, his@site.com.uk

// Case 2 matchAll
// let results = '<h1> <h2>'.matchAll(/<(.*?)>/gi);
// // results —— 不是数组，而是一个迭代对象 可以使用 forof 进行遍历
// console.log(results); // [object RegExp String Iterator]
// console.log(results[0]); // undefined (*)
// results = Array.from(results); // 让我们将其转换为数组
// console.log(results[0]); // <h1>,h1（第一个标签）
// console.log(results[1]); // <h2>,h2（第二个标签）

// Case 3 命名组
// let dateRegexp = /(?<year>[0-9]{4})-(?<month>[0-9]{2})-(?<day>[0-9]{2})/;
// let str = "2019-04-30";
// let groups = str.match(dateRegexp).groups;
// console.log(groups)
// console.log(groups.year); // 2019
// console.log(groups.month); // 04
// console.log(groups.day); // 30

// Case 4 替换中的捕获组
// let regexp = /(?<year>[0-9]{4})-(?<month>[0-9]{2})-(?<day>[0-9]{2})/g
// let str = '2018-10-30 2020-01-01'
// console.log(str.replace(regexp, '$<day>,$<month>,$<year>')) // 30,10,2018 01,01,2020

// Case 5 非捕获组
// let str = 'Gogogo Careteen'
// let regexp = /(?:go)+ (\w+)/i
// console.log(str.match(regexp)) // 结果排除了 go 这个捕获组

// Case 6 检查 mac 地址
// let regexp = /^([0-9a-f]{2})(:[0-9a-f]{2}){5}$/i;
// console.log( regexp.test('01:32:54:67:89:AB') ); // true
// console.log( regexp.test('0132546789AB') ); // false (没有冒号分隔)
// console.log( regexp.test('01:32:54:67:89') ); // false (5 个数字，必须为 6 个)
// console.log( regexp.test('01:32:54:67:89:ZZ') ) // false (尾部为 ZZ)

// Case 7 找出十六进制的 色值 3 位或者 6 位
// let regexp = /#([0-9a-f]{3}){1,2}\b/gi;
// let str = "color: #3f3; background-color: #AA00ef; and: #abcd";
// console.log( str.match(regexp) ); // #3f3 #AA00ef

// Case 8 找出所有的数字，包含整数、浮点数、负数
// let regexp = /-?\d+(\.?\d+)?/g
// let str = '-1.5 0 2 -123.4.'
// console.log(str.match(regexp))

// Case 9 解析表达式
// function parse(str) {
//     const result = str.match(/(?<a>-?\d+(\.?\d+)?)\s*(?<op>[-+*/])\s*(?<b>-?\d+(\.?\d+)?)/)
//     if (!result) return []
//     return [result.groups.a, result.groups.op, result.groups.b]
// }
// let result = parse("-1.2 * -30");
// console.log(result); // -1.2 * -30

/**
 * @desc 反向引用
 */
// Case 1
// let str = `He said: "She's the one!".`;
// let regexp = /(["'])(.*?)\1/g
// let regexp1 = /(?<quote>["'])(.*?)\k<quote>/g // 命名反向引用
// console.log(str.match(regexp))

/**
 * @desc 选择 |
 */
// Case 1 更精准的时间
// let regexp = /\d\d:\d\d/g
// let regexp = /([0-1]\d|2[0-3]):([0-5]\d)/g
// console.log("00:00 10:10 23:59 25:99 1:2".match(regexp)); // 00:00,10:10,23:59

// Case 2 找到 Java、JavaScript、PHP、C 或 C++
// let regexp = /Java(Script)?|PHP|C(\+\+)?/ig
// console.log('Java、JavaScript、PHP、C 或 C++'.match(regexp))

// Case 3
// let regexp = /(\[(?<name>url|b)\])(.*?)\[\/\k<name>\]/gs;
// let str = "..[url][b]http://google.com[/b][/url]..";
// // let str = "..[url]http://google.com[/url]..";
// console.log( str.match(regexp) ); // [url][b]http://google.com[/b][/url]

// Case 4 查找完整标签
// let regexp = /<style\b.*?>/g;
let regexp = /<style(>|\s.*?>)/g;
console.log( '<style> <styler> <style test="...">'.match(regexp) ); // <style>, <style test="...">
