import type { App } from "vue";
import { LilIcon } from "@lil-ui/components";

const components = [LilIcon];

const install = (app: App) => {
  components.forEach((component) => {
    app.use(component);
  });
};

export default {
  install,
};

export * from "@lil-ui/components";
