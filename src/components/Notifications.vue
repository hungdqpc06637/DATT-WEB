<template>
  <div class="toast-container position-fixed bottom-0 end-0 p-3">
    <Notification v-for="toast in notifications" :key="toast.id" :toastId="toast.id" :desc="toast.desc" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import Notification from '@/components/Notification.vue';

const store = useStore();
const notifications = computed(() => store.getters['notifications/getNotifications']);
</script>

<style scoped>
.toast-container {
  z-index: 1050;
}
</style>
