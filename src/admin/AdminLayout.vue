<template>
    <div class="layout">
        <aside class="sidebar">
            <AdminSidebar />
        </aside>

        <div class="main-content">
            <video autoplay loop muted playsinline preload="auto" class="background-video"
                @loadeddata="handleVideoLoaded">
                <source src="/videos/vecteezy_network-connections-technology-digital-cyberspace-and_52182076.mov"
                    type="video/mp4" />
            </video>

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

const handleVideoLoaded = (event) => {
    event.target.style.opacity = "1";
};
</script>

<style scoped>
.layout {
    display: flex;
    height: 100vh;
}

.sidebar {
    width: 300px;
    background-color: #2d3748;
    color: white;
    padding: 16px;
    flex-shrink: 0;
}

.main-content {
    position: relative;
    flex-grow: 1;
    overflow: hidden;
}

.background-video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
    opacity: 0;
    transition: opacity 1s ease-in-out;
}

.navbar {
    height: 60px;
    background-color: rgba(26, 32, 44, 0.9);
    color: white;
    display: flex;
    align-items: center;
    padding: 0 16px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1;
}

.content {
    flex-grow: 1;
    padding: 24px;
    background: transparent;
    overflow: auto;
    z-index: 1;
}
</style>