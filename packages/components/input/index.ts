import { withInstall } from "@lil-ui/utils/withInstall";
import _Input from "./src/input.vue";

const Input = withInstall(_Input);
declare module 'vue' {
  export interface GlobalComponents {
    'lil-input': typeof Input;
  }
}
export * from "./src/input";
export default Input;
export { Input };