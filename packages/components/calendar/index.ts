import { withInstall } from "@lil-ui/utils/withInstall";
import _Calendar from "./src/calendar.vue";
const calendar = withInstall(_Calendar)
declare module 'vue' {
  export interface GlobalComponents {
    'lil-calendar': typeof calendar
  }
}
export * from './src/calendar'
export default calendar
export {
    calendar
}