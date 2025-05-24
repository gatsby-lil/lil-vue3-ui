import path from "path";
import { series } from "gulp";
import { OutputOptions, rollup } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import vue from "rollup-plugin-vue";
import typescript from "rollup-plugin-typescript2";
import { sync } from "fast-glob";
import { compRoot } from "./utils/path";
import { buildConfig } from "./utils/config";
import { pathReWriter } from "./utils";

// 打包每个组件 --> dist/cpmponents
const buildEachComponent = async () => {
  const files = sync("*", {
    cwd: compRoot,
    onlyDirectories: true,
  });
  const builds = files.map(async (file: string) => {
    // 每个组件的入口
    const input = path.resolve(compRoot, file, "index.ts");
    const config = {
      input,
      plugins: [typescript(), vue(), nodeResolve(), commonjs()],
      external: (id: string) => /^vue/.test(id) || /^@lil-ui/.test(id),
    };
    const bundle = await rollup(config);
    const bundleOptions = Object.values(buildConfig).map((config) => {
      return {
        format: config.format,
        file: path.resolve(config.output.path, `components/${file}/index.js`),
        paths: pathReWriter(config.output.name), // @lil-ui --> lil-ui/es... || lil-ui/lib
      };
    });
    return await Promise.all(
      bundleOptions.map((option) => bundle.write(option as OutputOptions))
    );
  });
  return Promise.all(builds);
};
export const buildComponent = series(buildEachComponent);
