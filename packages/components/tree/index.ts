import { withInstall } from '@lil-ui/utils/withInstall'
import _Tree from './src/tree.vue'
const Tree = withInstall(_Tree)
declare module 'vue' {
  export interface GlobalComponents {
    LilTree: typeof Tree
  }
}
export default Tree
