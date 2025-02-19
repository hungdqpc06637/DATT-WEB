import { createApp } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css' // Bootstrap CSS
import 'bootstrap-icons/font/bootstrap-icons.css' // Bootstrap Icons
import "ant-design-vue/dist/reset.css"; // Ant Design CSS

import 'bootstrap' // Bootstrap JS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Thêm Popper.js vào

import App from './App.vue'
import useCustomeDirective from './directives'
import store from './vuex'
import router from './router/index.js'
import Antd from "ant-design-vue";
store.dispatch('notifications/resetNotifications');
const app = createApp(App)
app.use(store)
app.use(Antd)
app.use(router)
useCustomeDirective(app);
app.mount('#app')
