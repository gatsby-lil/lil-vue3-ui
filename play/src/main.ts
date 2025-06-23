import { createApp } from 'vue'
import LilIcon from '@lil-ui/components/icon'
import LilTree from '@lil-ui/components/tree'
import LilCheckBox from '@lil-ui/components/checkbox'
import LilButton from '@lil-ui/components/button'
import '@lil-ui/theme/src/index.scss'
import App from './App.vue'

const app = createApp(App)
const components = [LilIcon, LilTree, LilCheckBox, LilButton]
components.forEach(comp => {
  app.use(comp)
})
app.mount('#app')
