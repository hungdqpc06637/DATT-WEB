<template>
  <header>
    <div class="announcement text-white">
      <div class="container">
        <div class="row">
          <div class="text-center p-1 ">
            <p class="mb-0">Miễn phí vận chuyển cho đơn hàng trên 250.000đ</p>
          </div>
        </div>
      </div>
    </div>
  </header>
  <nav class="navbar navbar-expand-lg navbar-light bg-light sticky-top border">
    <div class="container">
      <a class="navbar-brand font-bold" href="#">FASHION SHOP</a>
      <div class="navbar-nav ms-auto">
        <router-link to="/login" class="nav-link" v-if="!user">
          <button class="btn btn-outline-dark">
            <i class="bi bi-door-open-fill"></i> Đăng nhập
          </button>
        </router-link>

        <li class="nav-item dropdown" v-if="user">
          <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
            <img :src="'https://placehold.co/100x100'" width="40" height="40" class="rounded-circle">
            <span class="mx-2">{{ user.username }}</span> <!-- ✅ Hiển thị tên người dùng -->
          </a>
          <div class="dropdown-menu">
            <router-link to="/profile" class="dropdown-item"><i class="bi bi-person-circle mx-1"></i>Trang cá
              nhân</router-link>
            <button class="dropdown-item text-danger" @click="logout"><i class="bi bi-door-closed-fill mx-1"></i>Đăng
              xuất</button>
          </div>
        </li>

        <router-link to="/cart" class="nav-link">
          <button class="btn btn-outline-dark">
            <i class="bi bi-cart-fill me-1"></i>
            <span class="badge bg-dark text-white ms-1 rounded-pill">3</span>
          </button>
        </router-link>
      </div>
    </div>
  </nav>

</template>

<script>
import { onMounted } from "vue";
import { useAuth } from "../composables/useAuth"; // ✅ Import useAuth

export default {
  setup() {
    const { user, loadUser, logout } = useAuth();

    onMounted(loadUser); // ✅ Load user khi component được mount

    return { user, logout };
  },
};
</script>



<style scoped>
.announcement {
  background-color: #000000;
}
</style>
