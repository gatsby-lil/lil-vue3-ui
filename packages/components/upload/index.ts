import { withInstall } from "@lil-ui/utils/withInstall";
import _upload from "./src/upload.vue";
const upload = withInstall(_upload)
declare module 'vue' {
  export interface GlobalComponents {
    'lil-upload': typeof upload
  }
}
export * from "./src/upload";
export default upload
export {
    upload
}