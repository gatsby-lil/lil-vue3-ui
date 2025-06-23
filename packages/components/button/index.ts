import { withInstall } from '@lil-ui/utils/withInstall'
import _Button from './src/button.vue'
const Button = withInstall(_Button)
declare module 'vue' {
  export interface GlobalComponents {
    'lil-button': typeof Button
  }
}
export * from './src/button'
export { Button }
export default Button