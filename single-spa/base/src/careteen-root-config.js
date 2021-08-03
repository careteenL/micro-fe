import { registerApplication, start } from "single-spa";

registerApplication({
  name: "@single-spa/welcome",
  app: () =>
    System.import(
      "https://unpkg.com/single-spa-welcome/dist/single-spa-welcome.js"
    ),
  activeWhen: ["/"],
});

registerApplication({
  name: "@careteen/vue",
  app: () => System.import("@careteen/slave-vue"),
  activeWhen: ["/vue"],
  customProps: {
    name: 'single-spa-base',
  },
});

registerApplication({
  name: "@careteen/react",
  app: () => System.import("@careteen/react"),
  activeWhen: ["/react"],
  customProps: {
    name: 'single-spa-base',
  },
});

start({
  urlRerouteOnly: true,
});
