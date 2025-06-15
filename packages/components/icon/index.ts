import { withInstall } from '@lil-ui/utils/withInstall'
import Icon from './src/icon.vue'
const LilIcon = withInstall(Icon)
export * from './src/icon'
export { LilIcon }
export default LilIcon
declare module 'vue' {
  export interface GlobalComponents {
    // 我们的接口可以自动合并
    'lil-icon': typeof LilIcon
  }
}
