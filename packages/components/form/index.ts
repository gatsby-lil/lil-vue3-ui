import { withInstall } from "@lil-ui/utils/withInstall";
import _FormItem from "./src/form-item.vue";
import _Form from "./src/form.vue";

const LilFormItem = withInstall(_FormItem);
const LilForm = withInstall(_Form);
export * from "./src/form";
export * from "./src/form-item";
export {
    LilFormItem,
    LilForm
}