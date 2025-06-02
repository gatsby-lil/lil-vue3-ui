import path from "path";
import fs from "fs/promises";
import { series, parallel, src, dest } from "gulp";
import { glob } from "fast-glob";
import { ModuleKind, Project, ScriptTarget, SourceFile } from "ts-morph";
import { lilUiRoot, outDir, projectRootPath } from "./utils/path";
import { run } from "./utils";
import { buildConfig } from "./utils/config";

type ModuleType = "cjs" | "esm";

async function getTypes() {
  const files = await glob("*.ts", {
    cwd: lilUiRoot,
    absolute: true,
    onlyFiles: true,
  });
  const project = new Project({
    // 生成.d.ts  需要配置选项
    compilerOptions: {
      allowJs: true,
      declaration: true,
      emitDeclarationOnly: true,
      noEmitOnError: false,
      outDir: path.resolve(outDir, "entry/types"),
      baseUrl: projectRootPath,
      strict: false,
      module: ModuleKind.ESNext,
      target: ScriptTarget.ESNext,
      rootDir: lilUiRoot,
    },
    tsConfigFilePath: path.resolve(projectRootPath, "tsconfig.json"),
    skipAddingFilesFromTsConfig: true,
  });
  const sourceFiles: SourceFile[] = [];
  files.map(async (file: string) => {
    const sourceFile = project.addSourceFileAtPath(file);
    sourceFiles.push(sourceFile);
  });
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
      await fs.writeFile(
        filePath,
        outputFile.getText().replaceAll("@lil-ui", "."),
        "utf-8"
      );
    });
    await Promise.all(tasks);
  });
  await Promise.all(tasks);
}

function copyEntryTypes() {
  let srcPath = path.resolve(outDir, "entry/types");
  const copy = (module: ModuleType) => {
    let target = path.resolve(outDir, buildConfig[module]?.output?.path);
    return () => src(`${srcPath}/**`).pipe(dest(target));
  };
  return series(copy("esm"), copy("cjs"));
}

export const genEntryTypes = series(getTypes, copyEntryTypes());
