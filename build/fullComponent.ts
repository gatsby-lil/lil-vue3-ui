import path from "path";
import { parallel } from "gulp";
import { OutputOptions, rollup } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import vue from "rollup-plugin-vue";
import typescript from "rollup-plugin-typescript2";
import { lilUiRoot } from "./utils/path";
import { buildFullComponentConfig } from "./utils/config";

const buildFull = async () => {
  try {
    const config = {
      input: path.resolve(lilUiRoot, "index.ts"),
      plugins: [typescript(), vue(), nodeResolve(), commonjs()],
      external: (id: any) => /^vue/.test(id),
    };
    const bundle = await rollup(config);
    return Promise.all(
      buildFullComponentConfig.map((config) => {
        return bundle.write(config as OutputOptions);
      })
    );
  } catch (error) {
    console.log(error, "eeeeee");
  }
};
// gulp适合流程控制和转义
export const buildFullComponent = parallel(buildFull);
