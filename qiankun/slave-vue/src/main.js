import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import routes from './router';

// 不能直接挂载 需要切换的时候 调用mount方法时候再去挂载
let history;
let router;
let app;
function render(props = {}) {
  history = createWebHistory('/vue');
  router = createRouter({
    history,
    routes
  });
  app = createApp(App);
  let { container } = props; // 默认他会拿20000端口的html插入到容器中，
  app.use(router).mount(container ? container.querySelector('#app') : '#app')
}

// 乾坤在渲染前 给我提供了一个变量 window.__POWERED_BY_QIANKUN__
if (!window.__POWERED_BY_QIANKUN__) { // 独立运行自己
  render();
}

// 需要暴露接入协议
export async function bootstrap() {
  console.log('vue3 app bootstraped');
}

export async function mount(props) {
  console.log('vue3 app mount',);
  render(props)
}
export async function unmount() {
  console.log('vue3 app unmount');
  history = null;
  app = null;
  router = null;
}