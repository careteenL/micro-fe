import { reroute } from "./reroute.js";

function urlRoute() {
  reroute();
}
// 浏览器兼容问题 如果不支持要退会hash， 在reroute方法中要实现批处理 防抖
window.addEventListener("hashchange", urlRoute);
window.addEventListener("popstate", urlRoute);

const routerEventsListeningTo = ["hashchange", "popstate"];

// 子应用 里面也可能会有路由系统，我需要先加载父应用的事件 在去调用子应用
// 需要先加载父应用 在加载子应用

export const capturedEventListeners = {
  // 父应用加载完子应用后再触发
  hashchange: [],
  popstate: [],
};
const originalAddEventListener = window.addEventListener;
const originalRemoveEventLister = window.removeEventListener;

window.addEventListener = function (eventName, fn) {
  if (
    routerEventsListeningTo.includes(eventName) &&
    !capturedEventListeners[eventName].some((l) => fn == l)
  ) {
    return capturedEventListeners[eventName].push(fn);
  }
  return originalAddEventListener.apply(this, arguments);
};

window.removeEventListener = function (eventName, fn) {
  if (routerEventsListeningTo.includes(eventName)) {
    return (capturedEventListeners[eventName] = capturedEventListeners[
      eventName
    ].filter((l) => fn != l));
  }
  return originalRemoveEventLister.apply(this, arguments);
};

// 如果使用的是history.pushState 可以实现页面跳转，但是他不会触发popstate

// history.pushState = function () {
//   // 解决 historyApi调用时 可以触发popstate
//   window.dispatchEvent(new PopStateEvent("popstate"));
// };

function patchedUpdateState(updateState, methodName) {
  return function() {
    // 例如 vue-router内部会通过pushState() 不改路径改状态，所以还是要处理下
    const urlBefore = window.location.href;
    const result = updateState.apply(this, arguments);
    const urlAfter = window.location.href;
    if (urlBefore !== urlAfter) {
      window.dispatchEvent(new PopStateEvent("popstate"));// 路径 不一样，继续重启应用
    }
    return result;
  }
}
window.history.pushState = patchedUpdateState(window.history.pushState, 'pushState');
window.history.replaceState = patchedUpdateState(window.history.replaceState, 'replaceState')

export function callCapturedEventListeners(eventArguments) { // 触发捕获的事件
  if (eventArguments) {
    const eventType = eventArguments[0].type;
    // 触发缓存中的方法
    if (routingEventsListeningTo.includes(eventType)) {
      capturedEventListeners[eventType].forEach(listener => {
        listener.apply(this, eventArguments);
      })
    }
  } 
}

setTimeout(() => {
  console.log(capturedEventListeners);
}, 1000);
