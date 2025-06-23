import { withInstall } from "@lil-ui/utils/withInstall";
import _FormItem from "./src/form-item.vue";
import _Form from "./src/form.vue";

const FormItem = withInstall(_FormItem);
const Form = withInstall(_Form);
export * from "./src/form";
export * from "./src/form-item";
export {
    FormItem,
    Form
}