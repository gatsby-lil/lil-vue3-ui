import { withInstall } from "@lil-ui/utils/withInstall";
import _VirtualList from "./src/virtual";
const LilVirtualList = withInstall(_VirtualList);
export default LilVirtualList;
export {
    LilVirtualList
}
declare module 'vue' {
  export interface GlobalComponents {
    'lil-virtual-list': typeof LilVirtualList
  }
}