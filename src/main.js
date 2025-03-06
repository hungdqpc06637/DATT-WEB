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

const app = createApp(App) // Tạo app trước

const draggable = {
    mounted(el) {
        el.style.cursor = 'move';
        el.addEventListener('mousedown', (e) => {
            // Tìm phần tử modal container từ header
            let modal = el.closest('.ant-modal-content');
            if (!modal) {
                modal = document.querySelector('.ant-modal-content');
            }
            if (!modal) {
                console.warn('Không tìm thấy modal container');
                return;
            }

            // Lưu vị trí chuột ban đầu
            const startX = e.clientX;
            const startY = e.clientY;

            // Lấy giá trị transform hiện tại (nếu có), nếu không thì mặc định 0
            let currentTranslate = { x: 0, y: 0 };
            const transform = window.getComputedStyle(modal).transform;
            if (transform && transform !== 'none') {
                const values = transform.split('(')[1].split(')')[0].split(',');
                if (values.length >= 6) {
                    currentTranslate.x = parseFloat(values[4]);
                    currentTranslate.y = parseFloat(values[5]);
                }
            }

            const onMouseMove = (e) => {
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
                modal.style.transform = `translate(${currentTranslate.x + deltaX}px, ${currentTranslate.y + deltaY}px)`;
            };

            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }
}


app.directive('draggable', draggable)
app.use(store)
app.use(Antd)
app.use(router)
useCustomeDirective(app)
app.mount('#app')
