import { withInstall } from '@lil-ui/utils/withInstall'
import _checkbox from './src/checkbox.vue'
// 本质是给组件扩展了一个install方法
const Checkbox = withInstall(_checkbox)
// 把组件类型导出
export * from './src/checkbox'
declare module 'vue' {
  export interface GlobalComponents {
    'lil-checkbox': typeof Checkbox
  }
}
// 导出组件
export default Checkbox
export { Checkbox }
