import { createApp } from 'vue'
import LilIcon from '@lil-ui/components/icon'
import LilTree from '@lil-ui/components/tree'
import '@lil-ui/theme/src/index.scss'
import './style.css'
import App from './App.vue'

const app = createApp(App)
const components = [LilIcon, LilTree]
components.forEach(comp => {
  app.use(comp)
})
app.mount('#app')
