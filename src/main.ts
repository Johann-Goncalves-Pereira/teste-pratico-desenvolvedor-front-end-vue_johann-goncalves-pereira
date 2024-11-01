import './assets/base.css'

import { createApp } from 'vue'
import { i18n } from './stores/static'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(i18n)
app.use(router)

app.mount('#app')
