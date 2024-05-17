/**
 * @desc 迭代器 iterator
 */
// Case 1 如果让一个对象变成可迭代
// const range = {
//     from: 1,
//     to: 5,
//     [Symbol.iterator]: function() {
//         return {
//             current: this.from,
//             last: this.to,
//             next() {
//                 if (this.current < this.last) {
//                     return {
//                         done: false,
//                         value: this.current++
//                     }
//                 } else {
//                     return {done: true}
//                 }
//             }
//         }
//     }
// }
// for (const item of range) {
//     console.log(item)
// }

// Case 2 使用 while 模拟 forof
// const str = 'Careteen'
// // for(const item of str) {
// //     console.log(item)
// // }
// const iterator = str[Symbol.iterator]()
// while(true) {
//     let result = iterator.next()
//     if (result.done) break
//     console.log(result.value)
// }