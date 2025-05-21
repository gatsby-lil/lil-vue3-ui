import { spawn } from "child_process";
import { projectRootPath } from "./path";

export const withTaskName = (displayName: string, cb: () => void) =>
  Object.assign(cb, { displayName });

export const run = (command: string) => {
  return new Promise((resolve) => {
    const [cmd, ...args] = command.split(" ");
    // 添加一个子进程
    const app = spawn(cmd, args, {
      cwd: projectRootPath,
      stdio: "inherit",
      shell: true,
    });
    app.on("close", resolve);
  });
};
