<template>
    <div class="layout">
        <!-- Sidebar -->
        <aside class="sidebar">
            <AdminSidebar />
        </aside>

        <!-- Nội dung chính -->
        <div class="main-content">
            <header class="navbar">
                <AdminNavbar />
            </header>

            <main class="content">
                <router-view />
            </main>
        </div>
    </div>
</template>


<script setup>
import AdminSidebar from "@/admin/component/AdminSidebar.vue";
import AdminNavbar from "@/admin/component/AdminNavbar.vue";
</script>


<style scoped>
.layout {
    display: flex;
    height: 100vh;
}

.sidebar {
    width: 250px;
    background-color: #2d3748;
    color: white;
    padding: 16px;
    flex-shrink: 0;
}

.main-content {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}

.navbar {
    height: 60px;
    background-color: #1a202c;
    color: white;
    display: flex;
    align-items: center;
    padding: 0 16px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.content {
    flex-grow: 1;
    padding: 24px;
    background-color: #f7fafc;
    overflow: auto;
}
</style>