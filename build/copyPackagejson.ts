import { dest, series, src } from "gulp";
import { lilUiRoot, outDir } from "./utils/path";

export function copyJson() {
  return () => src(`${lilUiRoot}/package.json`).pipe(dest(outDir));
}

export const copyPackageJson = series(copyJson());
