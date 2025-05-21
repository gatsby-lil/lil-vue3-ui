import path from "path";
import ts from "gulp-typescript";
import { outDir, projectRootPath } from "./utils/path";
import { buildConfig } from "./utils/config";
import { parallel, series, src, dest } from "gulp";
import { withTaskName } from "./utils";

export const buildPackages = function buildPackages(
  dirName: string,
  moduleName: string
) {
  const tsConfig = path.resolve(projectRootPath, "tsconfig.json");
  const inputs = ["**/*.ts", "!gulpfile.ts", "!node_modules"];

  const tasks = Object.entries(buildConfig).map(([_, config]) => {
    const output = path.resolve(dirName, config?.output?.name);
    return series(
      withTaskName(`build: ${moduleName}`, () => {
        return src(inputs)
          .pipe(
            ts.createProject(tsConfig, {
              declaration: true,
              strict: false,
              module: config.module,
            })()
          )
          .pipe(dest(output));
      }),
      withTaskName(`copy: ${moduleName}`, () => {
        return src(`${output}/**`).pipe(
          dest(path.resolve(outDir, config?.output?.name, moduleName))
        );
      })
    );
  });
  return parallel(...tasks);
};
