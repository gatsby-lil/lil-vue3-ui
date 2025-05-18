// 打包样式
import path from "path";
import gulpSass from "gulp-sass";
import dartSass from "sass";
import autoPrefixer from "gulp-autoprefixer";
import cleanCss from "gulp-clean-css";
import { series, src, dest } from "gulp";

function compile() {
  const sass = gulpSass(dartSass);
  return src(path.resolve(__dirname, "/src/*.scss"))
    .pipe(sass.sync())
    .pipe(autoPrefixer())
    .pipe(cleanCss())
    .pipe(dest("./dist/css"));
}

function copyfont() {
  return src(path.resolve(__dirname, "/src/font/**"))
    .pipe(cleanCss())
    .pipe(dest("./dist/fonts"));
}

function copyfullStyle() {
  return src(path.resolve(__dirname, "./dist/**")).pipe(
    dest(path.resolve(__dirname, "../../dist/theme"))
  );
}

export default series(compile, copyfont, copyfullStyle);
