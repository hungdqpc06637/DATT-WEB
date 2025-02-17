<script setup>
import { useRoute, useRouter } from 'vue-router';
import NavBar from './components/NavBar.vue';
import Footer from './components/Footer.vue';
import Notifications from './components/Notifications.vue';

const route = useRoute();

</script>

<template>
  <div>
    <!-- Chỉ hiển thị NavBar và Footer khi không phải trang admin -->
    <NavBar v-if="!route.path.startsWith('/admin')" />

    <router-view :key="route.path" />

    <Footer v-if="!route.path.startsWith('/admin')" />
    <Notifications />
  </div>
</template>

<style scoped></style>
