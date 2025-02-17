<template>
    <nav class="navbar navbar-expand text-white shadow-sm px-4 d-flex justify-content-between align-items-center w-100">
        <!-- Nút Trang chủ nằm bên trái -->
        <button class="btn btn-outline-light" @click="goHome">
            <i class="bi bi-house-door me-2"></i> Trang chủ
        </button>

        <!-- Hiển thị thông tin người dùng -->
        <div class="d-flex align-items-center">
            <span class="me-3">Hello, {{ username }}</span> <!-- Hiển thị tên người dùng -->

            <!-- Nút Đăng xuất -->
            <button class="btn btn-outline-light d-flex align-items-center" @click="logout">
                <i class="bi bi-box-arrow-right me-2"></i> Đăng xuất
            </button>
        </div>
    </nav>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

// Lấy thông tin người dùng từ localStorage
const user = JSON.parse(localStorage.getItem('user'));

// Kiểm tra và lấy tên người dùng
const username = user ? user.username : 'Guest';

const goHome = () => {
    router.push('/');
};

const logout = () => {
    // Xoá thông tin người dùng khỏi localStorage khi đăng xuất
    localStorage.removeItem('user');
    router.push('/login');
};
</script>

<style scoped>
/* Đảm bảo không có xung đột với CSS dropdown */
</style>