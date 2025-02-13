<template>
    <div>
        <h2 class="fs-4 fw-bold mb-3">Admin Menu</h2>
        <ul class="list-unstyled">
            <li v-for="item in menuItems" :key="item.path">
                <router-link :to="item.path" class="d-block p-2 text-white text-decoration-none"
                    :class="{ 'bg-secondary': isActive(item.path) }">
                    <span class="me-2">{{ item.icon }}</span> {{ item.label }}
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const menuItems = ref([
    { path: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/admin/products", label: "Products", icon: "🛍" },
    { path: "/admin/orders", label: "Orders", icon: "📦" },
    { path: "/admin/users", label: "Users", icon: "👤" }
]);

const isActive = (path) => {
    return route.path === path;
};
</script>

<style scoped>
.bg-secondary {
    background-color: #4a5568 !important;
}
</style>