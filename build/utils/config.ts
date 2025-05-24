import path, { format } from "path";
import { outDir } from "./path";
export const buildConfig = {
  esm: {
    module: "ESNext",
    format: "esm",
    output: {
      name: "es",
      path: path.resolve(outDir, "es"),
    },
    bundle: {
      path: `lil-ui/es`,
    },
  },
  cjs: {
    module: "CommonJS",
    format: "cjs",
    output: {
      name: "lib",
      path: path.resolve(outDir, "lib"),
    },
    bundle: {
      path: `lil-ui/lib`,
    },
  },
};

export const buildFullComponentConfig = [
  {
    format: "umd",
    file: path.resolve(outDir, "index.js"),
    name: "lil-ui",
    exports: "named",
    global: {
      vue: "vue",
    },
  },
  {
    format: "esm",
    file: path.resolve(outDir, "index.esm.js"),
  },
];

export type BuildConfig = typeof buildConfig;
export type BuildFullComponentConfig = typeof buildFullComponentConfig;
