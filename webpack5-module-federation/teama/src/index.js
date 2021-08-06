await import('./bootstrap');
//浏览器里 import加载的优先级是最低slowest
//import from 同步的,返回的就是代码本身
//import('') 异步的，会jsonp异步加载，而且会返promise