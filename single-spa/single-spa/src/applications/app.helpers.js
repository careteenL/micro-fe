import { apps } from "./apps.js";

export const NOT_LOADED = "NOT_LOADED"; // 应用默认状态是未加载状态
export const LOADING_SOURCE_CODE = "LOADING_SOURCE_CODE"; // 正在加载文件资源
export const NOT_BOOTSTRAPPED = "NOT_BOOTSTRAPPED"; // 此时没有调用bootstrap
export const BOOTSTRAPPING = "BOOTSTRAPPING"; // 正在启动中,此时bootstrap调用完毕后，需要表示成没有挂载
export const NOT_MOUNTED = "NOT_MOUNTED"; // 调用了mount方法
export const MOUNTED = "MOUNTED"; // 表示挂载成功
export const UNMOUNTING = "UNMOUNTING"; // 卸载中， 卸载后回到NOT_MOUNTED

// 当前应用是否被挂载了 状态是不是MOUNTED
export function isActive(app) {
  return app.status == MOUNTED;
}

// 路径匹配到才会加载应用
export function shouldBeActive(app) {
  // 如果返回的是true 就要进行加载
  return app.activeWhen(window.location);
}
export function getAppChanges() {
  // 拿不到所有app的？
  const appsToLoad = []; // 需要加载的列表
  const appsToMount = []; // 需要挂载的列表
  const appsToUnmount = []; // 需要移除的列表
  apps.forEach((app) => {
    const appShouldBeActive = shouldBeActive(app); // 看一下这个app是否要加载
    switch (app.status) {
      case NOT_LOADED:
      case LOADING_SOURCE_CODE:
        if (appShouldBeActive) {
          appsToLoad.push(app); // 没有被加载就是要去加载的app，如果正在加载资源 说明也没有加载过
        }
        break;
      case NOT_BOOTSTRAPPED:
      case NOT_MOUNTED:
        if (appShouldBeActive) {
          appsToMount.push(app); // 没启动柜， 并且没挂载过 说明等会要挂载他
        }
        break;
      case MOUNTED:
        if (!appShouldBeActive) {
          appsToUnmount.push(app); // 正在挂载中但是路径不匹配了 就是要卸载的
        }
      default:
        break;
    }
  });
  return { appsToLoad, appsToMount, appsToUnmount };
}
