
import { createApp } from 'vue'
// import App from '../App.vue'
import ElementPlus from 'element-plus'

import 'element-plus/dist/index.css'
import '@/common/styles/reset.css'
import '@/common/styles/global.styl'

import Popup from '@/popup/popup.vue'
import router from './router'

// createApp(App).mount('#app')
const app = createApp(Popup);
app.use(ElementPlus);
app.use(router);
app.mount('#app');