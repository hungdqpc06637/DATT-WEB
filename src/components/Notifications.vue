<template>
  <div class="toast-container position-fixed bottom-0 end-0 p-3">
    <!-- Render thông báo từ Vuex store -->
    <Notification v-for="notification in notifications" :key="notification.id" :toastId="notification.id"
      :desc="notification.desc" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Notification from '../components/Notification.vue';

export default {
  components: {
    Notification
  },
  computed: {
    ...mapState({
      // Map `notifications.data` từ Vuex store
      notifications: state => state.notifications.data
    })
  }
}
</script>

<style scoped></style>
