
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
let regexp = /\d\d[:-]\d\d/g;
console.log( "Breakfast at 09:00. Dinner at 21-30".match(regexp) ); // 09:00, 21-30