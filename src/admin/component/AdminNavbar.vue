<template>
    <nav class="navbar navbar-expand text-white shadow-sm px-4 d-flex justify-content-between align-items-center w-100"> 
        <button class="btn btn-outline-light" @click="goHome">
            <i class="bi bi-house-door me-2"></i> Trang chủ
        </button> 
        <div class="d-flex align-items-center">  
            <span class="me-3">Xin chào, {{ username }}</span>   
            <span class="me-3">{{ currentTime }}</span> 
            <button class="btn btn-outline-light d-flex align-items-center" @click="logout">
                <i class="bi bi-box-arrow-right me-2"></i> Đăng xuất
            </button>
        </div>
    </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter(); 
const user = JSON.parse(localStorage.getItem('user'));
const username = user ? user.username : 'Guest'; 
const currentTime = ref('');

const updateTime = () => {
    currentTime.value = new Intl.DateTimeFormat('vi-VN', {
        timeZone: 'Asia/Bangkok',
        weekday: 'short', // Hiển thị thứ (T2, T3,...)
        day: '2-digit', // Ngày (02, 15,...)
        month: '2-digit', // Tháng (03, 12,...)
        year: 'numeric', // Năm (2025)
        hour: '2-digit', // Giờ (08, 21,...)
        minute: '2-digit', // Phút (05, 45,...)
        second: '2-digit', // Giây (09, 30,...)
        hour12: false // Sử dụng định dạng 24 giờ
    }).format(new Date());
};
 
let interval;
onMounted(() => {
    updateTime();
    interval = setInterval(updateTime, 1000);
});
 
onUnmounted(() => {
    clearInterval(interval);
});

const goHome = () => {
    router.push('/');
};

const logout = () => { 
    localStorage.removeItem('user');
    router.push('/login');
};
</script>
