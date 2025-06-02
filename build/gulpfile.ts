import { series } from "gulp";
import { withTaskName, run } from "./utils";
export * from "./fullComponent";
export * from "./buildComponent";
export * from "./genTypes";

// 1. 打包样式
// * 打包工具
// 2.打包所有组件
// 3. 打包每个组件
// 4. 生成一个组件库
// 5. 发布
export default series(
  withTaskName("clear", async () => {
    run("rm -rf ./dist");
  }),
  withTaskName("buildPackages", async () => {
    run("pnpm run --filter ./packages/** --parallel build");
  }),
  withTaskName("buildFullComponent", async () => {
    run("pnpm run build buildFullComponent");
  }),
  withTaskName("buildComponent", async () => {
    run("pnpm run build buildComponent");
  }),
  withTaskName("buildEntryTypes", async () => {
    run("pnpm run build genEntryTypes");
  })
);
