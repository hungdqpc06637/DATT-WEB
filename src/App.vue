<script setup>
import { useRoute } from 'vue-router'; // Import useRoute từ Vue Router
import NavBar from './components/NavBar.vue';
import Footer from './components/Footer.vue';
import Notifications from './components/Notifications.vue';

const route = useRoute(); // Khai báo route
</script>

<template>
  <div>
    <!-- Chỉ hiển thị NavBar và Footer khi không phải trang admin -->
    <NavBar v-if="!route.path.startsWith('/admin')" />
    
    <router-view />
    
    <Footer v-if="!route.path.startsWith('/admin')" />
    <Notifications />
  </div>
</template>


<script>
import { userRequest } from './requestMethod.js';

export default {
	beforeCreate() {
		this.$store.dispatch('loadProducts');
    
    // reset notifications
    this.$store.dispatch('resetNotifications');
	},
  mounted() {
    // check valid token
    var token = this.$store.getters.getToken;
    if(token == null || token == undefined) return;

    userRequest(token).get('/auth/test')
    .then(res => {
      console.log(res.data);
    })
    .catch(err => {
      console.log(err);
      this.$store.dispatch('addNotification', "Invalid Token");
      this.$store.dispatch('logout');
      this.$router.push('/login');
    })
  }
}
</script>

<style scoped>
</style>
