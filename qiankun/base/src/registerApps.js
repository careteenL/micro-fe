import { registerMicroApps, start } from "qiankun"; // 底层是基于single-spa

const loader = (loading) => {
  console.log('loading', loading);
};
registerMicroApps(
  [
    {
      name: "slave-vue",
      entry: "//localhost:20000",
      container: "#container",
      activeRule: "/vue",
      loader,
    },
    {
      name: "slave-react",
      entry: "//localhost:30000",
      container: "#container",
      activeRule: "/react",
      loader,
    },
  ],
  {
    beforeLoad: () => {
      console.log("加载前");
    },
    beforeMount: () => {
      console.log("挂载前");
    },
    afterMount: () => {
      console.log("挂载后");
    },
    beforeUnmount: () => {
      console.log("销毁前");
    },
    afterUnmount: () => {
      console.log("销毁后");
    },
  }
);
start({
  sandbox: {
    // experimentalStyleIsolation:true
    strictStyleIsolation: true,
  },
});
