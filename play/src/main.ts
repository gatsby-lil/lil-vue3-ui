import { createApp } from 'vue'
import LilIcon from '@lil-ui/components/icon'
import LilTree from '@lil-ui/components/tree'
import LilCheckBox from '@lil-ui/components/checkBox'
import '@lil-ui/theme/src/index.scss'
import App from './App.vue'

const app = createApp(App)
const components = [LilIcon, LilTree, LilCheckBox]
components.forEach(comp => {
  app.use(comp)
})
app.mount('#app')
