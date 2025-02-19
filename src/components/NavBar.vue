<template>
  <header>
    <div class="announcement text-white">
      <div class="container">
        <div class="row">
          <div class="text-center p-1">
            <p class="mb-0">Miễn phí vận chuyển cho đơn hàng trên 250.000đ</p>
          </div>
        </div>
      </div>
    </div>
  </header>

  <nav class="navbar navbar-expand-lg navbar-light bg-light sticky-top border">
    <div class="container">
      <!-- Logo -->
      <a class="navbar-brand" href="/">
        <img src="/images/logohl.png" alt="Fashion Shop Logo" width="150" height="auto">
        FASHION SHOP
      </a>

      <!-- Nút toggler trên mobile -->
      <button class="navbar-toggler" type="button" @click="toggleNavbar">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div :class="['collapse', 'navbar-collapse', { show: isNavbarOpen }]" id="navbarNav">
        <!-- Dropdown Sản phẩm -->
        <ul class="navbar-nav me-auto">
          <li class="nav-item dropdown">
            <a class="nav-link nav-underline" href="#" data-bs-toggle="dropdown" @click.prevent="goToProducts">
              SẢN PHẨM
            </a>
            <ul class="dropdown-menu">
              <li v-for="category in categories" :key="category.id">
                <router-link class="dropdown-item d-flex align-items-center" :to="`/products?category=${category.id}`">
                  <!-- ✅ Hiển thị hình ảnh -->
                  <img :src="`/images/${category.image_url}`" class="me-2 rounded" width="25" height="25"
                    alt="category.name">
                  {{ category.name }}
                </router-link>
              </li>
            </ul>
          </li>



          <!-- Dropdown Giới thiệu -->
          <li class="nav-item dropdown">
            <a class="nav-link nav-underline" href="#" data-bs-toggle="dropdown">
              GIỚI THIỆU
            </a>
            <!-- <ul class="dropdown-menu">
              <li><router-link class="dropdown-item" to="#">Về chúng tôi</router-link></li>
              <li><router-link class="dropdown-item" to="#">Liên hệ</router-link></li>
            </ul> -->
          </li>
        </ul>

        <!-- 🔘 Nút đăng nhập / tài khoản -->
        <ul class="navbar-nav ms-auto">
          <li class="nav-item" v-if="!user">
            <router-link to="/login" class="nav-link">
              <button class="btn btn-outline-dark">
                <i class="bi bi-door-open-fill"></i> Đăng nhập
              </button>
            </router-link>
          </li>

          <li class="nav-item dropdown" v-if="user">
            <a class="nav-link" href="#" data-bs-toggle="dropdown">
              <img :src="'https://placehold.co/40x40'" class="rounded-circle" width="40" height="40">
              <span class="mx-2">{{ user.username }}</span>
            </a>
            <ul class="dropdown-menu">
              <li><router-link class="dropdown-item" to="/profile"><i class="bi bi-person-circle"></i> Trang cá
                  nhân</router-link></li>
              <li>
                <button class="dropdown-item text-danger" @click="confirmLogout">
                  <i class="bi bi-door-closed-fill"></i> Đăng xuất
                </button>
              </li>
            </ul>
          </li>

          <!-- 🛒 Giỏ hàng -->
          <li class="nav-item">
            <router-link to="/cart" class="nav-link">
              <button class="btn btn-outline-dark">
                <i class="bi bi-cart-fill"></i>
                <span class="badge bg-dark text-white ms-1 rounded-pill">{{ cartItemCount }}</span>
              </button>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { onMounted, ref, computed, watch } from "vue";
import { useAuth } from "../composables/useAuth";
import { useRouter } from "vue-router";
import { publicRequest } from "../requestMethod.js";
import { useStore } from "vuex"; // Import `useStore` từ Vuex
import { Modal } from "ant-design-vue";

export default {
  setup() {
    const { user, loadUser, logout } = useAuth();
    const router = useRouter();
    const store = useStore(); // Truy cập Vuex store

    const isNavbarOpen = ref(false);
    const categories = ref([]); // ✅ Danh sách danh mục sản phẩm

    // Lấy số lượng sản phẩm trong giỏ hàng từ Vuex
    const cartItemCount = computed(() => store.getters['cart/cartItemCount']);

    const confirmLogout = () => {
      Modal.confirm({
        title: "Xác nhận đăng xuất",
        content: "Bạn có chắc chắn muốn đăng xuất không?",
        okText: "Đăng xuất",
        okType: "danger",
        cancelText: "Hủy",
        zIndex: 2000, // Tăng zIndex cao hơn navbar
        onOk() {
          logout();
        },
      });
    };

    // Hàm tải giỏ hàng từ API và lưu vào Vuex
    const fetchCartData = async () => {
      if (!user.value?.user_id) {
        //console.warn("⚠️ Không có user_id, không thể lấy giỏ hàng.");
        return;
      }
      try {
        const response = await publicRequest.get(`/cart/get?user_id=${user.value.user_id}`);

        if (response.data.code === 200) {
          store.commit("cart/setCartItems", response.data.data || []);
        } else {
          console.error("❌ Lỗi khi lấy giỏ hàng:", response.data.message);
        }
      } catch (error) {
        console.error("❌ Lỗi khi gọi API giỏ hàng:", error);
      }
    };

    // Gọi API lấy danh mục sản phẩm
    const fetchCategories = async () => {
      try {
        const response = await publicRequest.get("/caterogy/get");
        categories.value = response.data.data; // Lưu danh mục vào biến
      } catch (error) {
        console.error("❌ Lỗi khi lấy danh mục:", error);
      }
    };

    // Theo dõi thay đổi trong giỏ hàng để debug
    watch(() => store.state.cart.cartItems, (newCart) => {
      //console.log("📢 Cập nhật giỏ hàng trong Vuex:", newCart);
    });

    // Gọi API khi component được mount
    onMounted(async () => {
      await loadUser(); // Load thông tin người dùng
      await fetchCategories(); // Lấy danh mục sản phẩm
      await fetchCartData(); // Lấy dữ liệu giỏ hàng
    });

    return {
      user,
      logout,
      goToProducts: () => router.push("/products"),
      toggleNavbar: () => (isNavbarOpen.value = !isNavbarOpen.value),
      isNavbarOpen,
      categories,
      cartItemCount,
      confirmLogout,
    };
  },
};

</script>


<style scoped>
.announcement {
  background-color: #000;
  text-align: center;
  font-size: 14px;
  padding: 8px 0;
}

.navbar-nav {
  list-style: none !important;
  padding-left: 0;
}

.navbar-nav .nav-item {
  padding-left: 15px;
}

.navbar-nav .nav-link {
  font-size: 16px;
  font-weight: 600;
}

.dropdown-menu {
  list-style: none !important;
  border-radius: 8px;
  padding: 5px;
}

.navbar-nav .btn-outline-dark {
  font-size: 14px;
  padding: 5px 12px;
  border-radius: 8px;
}

.nav-underline::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -3px;
  width: 0;
  height: 1px;
  background-color: black;
  transition: width 0.3s ease-in-out;
}

.nav-underline:hover::after {
  width: 100%;
}

.nav-item.dropdown:hover .dropdown-menu {
  display: block;
}

.dropdown-menu {
  display: none;
  position: absolute;
  background-color: white;
  min-width: 160px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1050;
}

.nav-item.dropdown:hover .dropdown-menu {
  display: block;
}

.navbar-nav {
  list-style: none;
  padding-left: 0;
  margin-left: 0;
}


.search-bar {
  max-width: 300px;
  margin-left: 15px;
}

.search-bar input {
  border-radius: 8px;
}

.search-bar button {
  border-radius: 8px;
}

.navbar {
  transition: all 0.3s ease-in-out;
}

.navbar:hover {
  background-color: #f8f9fa;
}

.navbar-brand img {
  width: 50px;
  height: auto;
}

.navbar-brand {
  letter-spacing: 4px;
}

/* Đảm bảo menu không bị chồng lên hoặc bị khóa khi toggle */
.navbar-collapse {
  transition: all 0.3s ease-in-out;
}

.navbar-toggler {
  z-index: 1051;
  /* Đảm bảo nút toggle nổi bật hơn các phần tử khác */
}
</style>
