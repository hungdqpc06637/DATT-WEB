<template>
    <div class="sidebar">
        <h2 class="sidebar-title">📌 QUẢN TRỊ VIÊN 📌</h2>
        <ul class="sidebar-list">
            <li v-for="item in menuItems" :key="item.path">
                <router-link :to="item.path" class="sidebar-item" :class="{ 'active': isActive(item.path) }">
                    <span class="icon">{{ item.icon }}</span> <span class="label">{{ item.label }}</span>
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const menuItems = ref([
    { path: "/admin/dashboard", label: "Thống kê", icon: "📊" },
    { path: "/admin/products", label: "Quản lí sản phẩm", icon: "🛍" },
    { path: "/admin/orders", label: "Quản lí đơn hàng", icon: "📦" },
    { path: "/admin/users", label: "Quản lí người dùng", icon: "👤" }
]);

const isActive = (path) => route.path === path;
</script>

<style scoped>
/* Sidebar */
.sidebar {
    width: 250px; /* Đảm bảo kích thước cố định */
    padding: 10px 15px;
    border-radius: 12px;
}

.sidebar[data-v-3b12e1ce] {
    width: 250px;
    background-color: #2d3748;
    color: white;
    padding: 0; /* Xóa padding */
    flex-shrink: 0;
}



/* Tiêu đề */
.sidebar-title {
    font-size: 1.4rem;
    font-weight: bold;
    color: #ffffff;
    text-transform: uppercase;
    margin-bottom: 15px;
    text-align: center;
}

/* Danh sách menu */
.sidebar-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

/* Mục menu */
.sidebar-item {
    display: flex;
    align-items: center;
    padding: 12px 18px;
    color: #ffffff;
    text-decoration: none;
    font-size: 1rem;
    font-weight: 500;
    transition: all 0.3s ease-in-out;
    position: relative;
}

/* Icon */
.icon {
    font-size: 1.3rem;
    margin-right: 10px;
}

/* Hiệu ứng hover */
.sidebar-item:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateX(5px);
}

/* Mục đang active */
.active {
    background: #4f46e5;
    font-weight: bold;
    box-shadow: 0px 0px 8px rgba(79, 70, 229, 0.8);
}
</style>
