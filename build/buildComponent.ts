import path from "path";
import fs from "fs/promises";
import { parallel, series } from "gulp";
import { OutputOptions, rollup } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import vue from "rollup-plugin-vue";
import typescript from "rollup-plugin-typescript2";
import { glob, sync } from "fast-glob";
import { Project, SourceFile } from "ts-morph";
import * as VueCompiler from "@vue/compiler-sfc";
import { compRoot, outDir, projectRootPath } from "./utils/path";
import { buildConfig } from "./utils/config";
import { pathReWriter, run } from "./utils";

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

async function getTypes() {
  const project = new Project({
    // 生成.d.ts  需要配置选项
    compilerOptions: {
      allowJs: true,
      declaration: true,
      emitDeclarationOnly: true,
      noEmitOnError: true,
      outDir: path.resolve(outDir, "types"),
      baseUrl: projectRootPath,
      paths: {
        "@lil-ui/*": ["packages/*"],
      },
      include: ["packages/**/*.ts"], // 包含目标文件
      skipLibCheck: true,
      strict: false,
      noEmit: false,
    },
    tsConfigFilePath: path.resolve(projectRootPath, "tsconfig.json"),
    skipAddingFilesFromTsConfig: true,
  });
  const filePath = await glob("**/*", {
    cwd: compRoot,
    onlyFiles: true,
    absolute: true, // 绝对路径
  });
  const sourceFiles: SourceFile[] = [];
  await Promise.all(
    filePath.map(async (file: string) => {
      if (file.endsWith(".vue")) {
        const content = await fs.readFile(file, "utf-8");
        const sfc = VueCompiler.parse(content);
        const { script } = sfc.descriptor;
        if (script) {
          const sourceFileVue = project.createSourceFile(
            file + ".ts",
            script.content
          );
          sourceFiles.push(sourceFileVue);
        }
      } else if (file.endsWith(".ts")) {
        // 把所有ts文件放在一起, 发射成.d.ts文件
        const sourceFile = project.addSourceFileAtPath(file);
        sourceFiles.push(sourceFile);
      }
    })
  );

  await project.emit({
    emitOnlyDtsFiles: true,
  });

  const tasks = sourceFiles.map(async (sourceFile: SourceFile) => {
    const emitOutput = sourceFile.getEmitOutput();
    const tasks = emitOutput.getOutputFiles().map(async (outputFile: any) => {
      const filePath = outputFile.getFilePath();
      await fs.mkdir(path.dirname(filePath), {
        recursive: true,
      });
      await fs.writeFile(filePath, pathReWriter("es")(outputFile.getText()));
    });
    await Promise.all(tasks);
  });
  await Promise.all(tasks);
}

function copyTypes() {
  const src = path.resolve(outDir, "types/components");
  const copy = (moduleName: string) => {
    const output = path.resolve(outDir, moduleName, "components");
    return () => run(`cp -r ${src}/* ${output}`);
  };
  return parallel(copy("es"), copy("lib"));
}

async function buildComponentEntry() {
  const config = {
    input: path.resolve(compRoot, "index.ts"),
    plugins: [typescript()],
    external: () => true,
  };
  const bundle = await rollup(config);
  return Promise.all(
    Object.values(buildConfig)
      .map((config) => {
        return {
          format: config.format,
          file: path.resolve(config.output.path, "components/index.js"),
        };
      })
      .map((config) => {
        return bundle.write(config as OutputOptions);
      })
  );
}

export const buildComponent = series(
  buildEachComponent,
  getTypes,
  copyTypes(),
  buildComponentEntry
);
