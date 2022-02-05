import 'ant-design-vue/dist/antd.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'
import plugin from './plugin'

createApp(App)
  .use(router)
  .use(Antd)
  .use(plugin)
  .mount('#app')
