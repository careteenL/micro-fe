import {
  BOOTSTRAPPING,
  getAppChanges,
  LOADING_SOURCE_CODE,
  MOUNTED,
  NOT_BOOTSTRAPPED,
  NOT_LOADED,
  NOT_MOUNTED,
  shouldBeActive,
  UNMOUNTING,
} from "../applications/app.helpers.js";
import { apps } from "../applications/apps.js";
import { started } from "../start.js";
import "./navigation-events.js";
import { capturedEventListeners, callCapturedEventListeners } from "./navigation-events.js";

function flattenFnArray(fns) {
  // vue3 路由钩子的组合  koa中的组件 redux中的
  fns = Array.isArray(fns) ? fns : [fns];
  return function (customProps) {
    // promise 将多个promise组合成一个promise链
    return fns.reduce(
      (resultPromise, fn) => resultPromise.then(() => fn(customProps)),
      Promise.resolve()
    );
  };
}

function toLoadPromise(app) {
  return Promise.resolve().then(() => {
    // 获取应用的钩子方法 接入协议
    if (app.status !== NOT_LOADED) {
      // 只有当他是NOT_LOADED 的时候才需要加载
      return app;
    }
    app.status = LOADING_SOURCE_CODE;
    return app.loadApp().then((val) => {
      let { bootstrap, mount, unmount } = val; // 获取应用的接入协议，子应用暴露的方法
      app.status = NOT_BOOTSTRAPPED;
      app.bootstrap = flattenFnArray(bootstrap);
      app.mount = flattenFnArray(mount);
      app.unmount = flattenFnArray(unmount);

      return app;
    });
  });
}

function toUnmountPromise(app) {
  return Promise.resolve().then(() => {
    // 如果不是挂载状态 直接跳出
    if (app.status !== MOUNTED) {
      return app;
    }
    app.status = UNMOUNTING; // 标记成正在卸载，调用卸载逻辑 ， 并且标记成 未挂载
    return app.unmount(app.customProps).then(() => {
      app.status = NOT_MOUNTED;
    });
  });
}

function toBootStrapPromise(app) {
  return Promise.resolve().then(() => {
    if (app.status !== NOT_BOOTSTRAPPED) {
      return app;
    }
    app.status = BOOTSTRAPPING;
    return app.bootstrap(app.customProps).then(() => {
      app.status = NOT_MOUNTED;
      return app;
    });
  });
}
function toMountPromise(app) {
  return Promise.resolve().then(() => {
    if (app.status !== NOT_MOUNTED) {
      return app;
    }
    return app.mount(app.customProps).then(() => {
      app.status = MOUNTED;
      return app;
    });
  });
}
// a -> b b->a a->b
function tryBootstrapAndMount(app, unmountPromises) {
  return Promise.resolve().then(() => {
    if (shouldBeActive(app)) {
      return toBootStrapPromise(app).then((app) =>
        unmountPromises.then(() => {
          capturedEventListeners.hashchange.forEach((item) => item());
          return toMountPromise(app);
        })
      );
    }
  });
}
export function reroute() {
  // reroute中 我需要知道 我要挂载哪个应用，要卸载哪个应用

  // 根据当所有应用过滤出 不同的应用类型
  const { appsToLoad, appsToMount, appsToUnmount } = getAppChanges(); // 每次都得知道当前应用是否要挂载

  // 需要去加载应用, 预先加载

  if (started) {
    return performAppChanges();
  }
  // 需要加载的apps
  return loadApps(); // 应用加载 就是把应用的钩子拿到 （systemjs  jsonp  fetch）

  function loadApps() {
    const loadPromises = appsToLoad.map(toLoadPromise); // NOT_BOOTSTRAPED
    // return Promise.all(loadPromises).then(callCapturedEventListeners);
    return Promise.all(loadPromises);
  }

  function performAppChanges() {
    // 需要调用bootstrap 调用，mount和umnout
    // 应用启动了 需要卸载不需要的应用  卸载
    // ？应用可能没有加载过 (如果没加载，还是需要加载的) => 启动并挂载需要的
    // let unmountPromises = Promise.all(appsToUnmount.map(toUnmountPromise)).then(callCapturedEventListeners); // 卸载，我就启动
    let unmountPromises = Promise.all(appsToUnmount.map(toUnmountPromise));

    // toLoadPromise(app) 需要拿到加载完的app继续.then  NOT_BOOTSTRAPED
    appsToLoad.map((app) =>
      toLoadPromise(app).then((app) =>
        tryBootstrapAndMount(app, unmountPromises)
      )
    );

    // 有可能start是异步加载的 此时loadApp已经被调用过了， 需要直接挂载就可以了
    appsToMount.map((app) => tryBootstrapAndMount(app, unmountPromises));
  }
}
// registerApplication 目的就是注册应用实现应用的加载 （获取钩子）
// start 方法目的就是 启动应用和 执行 用户的钩子 (可能钩子不存在，需要去加载)
