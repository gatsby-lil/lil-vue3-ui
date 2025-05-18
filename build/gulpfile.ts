import { series, parallel } from "gulp";
import { withTaskName, run } from "./utils";

// 1. 打包样式
// * 打包工具
// 2.打包所有组件
// 3. 打包每个组件
// 4. 生成一个组件库
// 5. 发布
export default series(
  withTaskName("clear", () => {
    run("rm -rf ./dist");
  }),
  withTaskName("buildPackages", () => {
    run("pnpm run --filter ./packages --parallel build");
  })
);
