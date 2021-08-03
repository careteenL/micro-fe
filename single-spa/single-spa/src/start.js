import { reroute } from "./navigation/reroute.js";

export let started = false;
export function start() {
  started = true; // 开始启动了
  reroute();
}
