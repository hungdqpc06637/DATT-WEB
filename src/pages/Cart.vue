<template>
  <div class="container my-5">
    <div class="row min-vh-100">
      <!-- Danh sách sản phẩm trong giỏ hàng -->
      <div class="col-md-8">
        <h1 class="fw-bold text-uppercase mb-4">Giỏ hàng của bạn</h1>
        <hr class="border-gold">

        <!-- Hiển thị sản phẩm trong giỏ hàng -->
        <CartItem v-for="(item, index) in paginatedCart" :key="item.id + '-' + index" :item="item" @remove="removeItem"
          @update="updateQuantity" />


        <!-- Nếu giỏ hàng trống -->
        <div v-if="cart.length === 0" class="text-center mt-5">
          <p class="text-muted">🛒 Giỏ hàng của bạn đang trống.</p>
          <router-link to="/products">
            <button class="btn btn-dark">Tiếp tục mua sắm</button>
          </router-link>
        </div>

        <!-- Nút phân trang -->
        <div v-if="totalPages > 1" class="pagination-container text-center mt-4">
          <button v-for="page in totalPages" :key="page" class="btn btn-light mx-1"
            :class="{ 'btn-dark': currentPage === page }" @click="goToPage(page)">
            {{ page }}
          </button>
        </div>
      </div>

      <!-- Tóm tắt đơn hàng -->
      <div class="col-md-4">
        <div class="card mb-3 sticky-top summary">
          <div class="card-body">
            <h5 class="card-title text-uppercase text-center fw-bold">Tóm tắt đơn hàng</h5>
            <ul class="list-group list-group-flush my-3">
              <li class="list-group-item d-flex justify-content-between align-items-center">
                Tạm tính
                <span>{{ formatPrice(subTotal) }}₫</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center border-top pt-3">
                <strong>Tổng cộng</strong>
                <strong class="text-gold">{{ formatPrice(total) }}₫</strong>
              </li>
            </ul>
            <router-link to="/checkout">
              <button type="button" class="btn btn-gold w-100">Thanh toán ngay</button>
            </router-link>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>


<script>
import CartItem from '../components/CartItem.vue';
import { publicRequest } from "../requestMethod.js";

export default {
  components: {
    CartItem
  },
  data() {
    return {
      cart: [], // Giỏ hàng
      subTotal: 0, // Tổng phụ
      total: 0, // Tổng cộng
      currentPage: 1, // Trang hiện tại
      itemsPerPage: 4, // Số lượng sản phẩm mỗi trang
    };
  },
  computed: {
    paginatedCart() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = this.currentPage * this.itemsPerPage;
      return this.cart.slice(start, end); // Lấy sản phẩm tương ứng với trang
    },
    totalPages() {
      return Math.ceil(this.cart.length / this.itemsPerPage); // Tổng số trang
    },
  },
  mounted() {
    this.userID = this.getUserIDFromLocalStorage(); // Lấy userID từ localStorage
    if (this.userID) {
      this.fetchCartData(); // Gọi API để lấy giỏ hàng nếu có userID
    } else {
      console.error('User ID not found in localStorage');
    }
  },
  methods: {
    formatPrice(value) {
      return new Intl.NumberFormat('vi-VN').format(value);
    },
    goToPage(pageNumber) {
      if (pageNumber >= 1 && pageNumber <= this.totalPages) {
        this.currentPage = pageNumber;
      }
    },
    // Hàm lấy user_id từ localStorage
    getUserIDFromLocalStorage() {
      const user = localStorage.getItem('user'); // Lấy đối tượng user từ localStorage
      if (user) {
        return JSON.parse(user).user_id; // Trả về user_id từ đối tượng user
      }
      return null; // Trả về null nếu không tìm thấy user trong localStorage
    },

    // Lấy dữ liệu giỏ hàng từ API
    async fetchCartData() {
      try {
        // Kiểm tra giá trị của user_id
        if (!this.userID) {
          console.error('User ID is not available.');
          return;
        }

        const response = await publicRequest.get(`/cart/get?user_id=${this.userID}`);

        if (response.data.code === 200) {
          // Kiểm tra nếu dữ liệu giỏ hàng là null hoặc undefined
          if (!response.data.data || response.data.data.length === 0) {
            this.cart = [];
          } else {
            this.cart = response.data.data;
          }

          // Lưu giỏ hàng vào Vuex
          this.$store.commit('cart/setCartItems', this.cart);  // Gọi mutation để cập nhật giỏ hàng vào Vuex
          this.calculateTotal(); // Tính toán lại tổng
        } else {
          console.error("Failed to fetch cart data", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    }
    ,
    async removeItem(productVariantId) {
      const userId = this.getUserIDFromLocalStorage();
      if (!userId) {
        console.error("User ID không tồn tại");
        return;
      }

      const requestData = {
        user_id: userId,
        product_variant_id: productVariantId
      };

      try {
        const response = await publicRequest.delete('/cart/delete', {
          headers: { "Content-Type": "application/json" },
          data: requestData
        });

        console.log("Phản hồi từ API:", response);  // Kiểm tra phản hồi API

        if (response.status === 200) {

          // ✅ Cập nhật Vuex bằng cách lọc sản phẩm vừa xóa
          const updatedCart = this.$store.state.cart.cartItems.filter(item => item.id !== productVariantId);
          this.$store.commit("cart/setCartItems", updatedCart);

          // ✅ Tải lại dữ liệu giỏ hàng
          await this.fetchCartData();

          // ✅ Tính lại tổng giỏ hàng
          this.calculateTotal();
        } else {
          console.error("Có lỗi xảy ra khi xóa sản phẩm:", response.data.message || "Không có thông báo lỗi");
        }
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
      }
    }

    ,
    async updateQuantity(productVariantId, quantity) {
      const userId = this.getUserIDFromLocalStorage(); // Lấy user_id từ localStorage

      // Kiểm tra nếu chưa đăng nhập
      if (!userId) {
        this.$store.dispatch('addNotification', 'Vui lòng đăng nhập để thay đổi số lượng sản phẩm!');
        return;
      }

      // Dữ liệu gửi đến API
      const requestData = {
        user_id: userId,
        product_variant_id: productVariantId,
        quantity: quantity
      };

      try {
        const response = await publicRequest.put("/cart/update", requestData);

        // Kiểm tra phản hồi từ API
        if (response.data.message === 'Cập nhật số lượng sản phẩm thành công') {
          this.$store.dispatch('addNotification', 'Cập nhật số lượng sản phẩm thành công!');
          this.$store.commit('cart/updateCartItem', { productId: productVariantId, quantity });

          // Cập nhật giỏ hàng trong state
          const cartItem = this.cart.find(item => item.product_variants[0]?.variants[0]?.id === productVariantId);
          if (cartItem) {
            cartItem.quantity = quantity;  // Cập nhật số lượng trực tiếp trong giỏ hàng
          }

          // Tính lại tổng giỏ hàng
          this.calculateTotal();
        } else {
          this.$store.dispatch('addNotification', 'Có lỗi xảy ra khi cập nhật số lượng, vui lòng thử lại.');
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật số lượng sản phẩm:", error);
        this.$store.dispatch('addNotification', 'Có lỗi xảy ra, vui lòng thử lại sau.');
      }
    }


    ,
    // Hàm tính tổng
    calculateTotal() {
      this.subTotal = this.cart.reduce((total, item) => {
        const price = item.product_variants[0]?.variants[0]?.price || 0;
        return total + price * item.quantity;
      }, 0);
      this.total = this.subTotal;
    },
  }
};
</script>





<style scoped>
/* Màu vàng ánh kim */
.text-gold {
  color: #d4af37;
}

/* Đường viền vàng */
.border-gold {
  border-top: 2px solid #d4af37;
}

/* Thiết kế Card */
.summary {
  top: 80px;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Button sang trọng */
.btn-gold {
  background: #d4af37;
  color: white;
  font-weight: bold;
  border-radius: 5px;
  padding: 10px;
  transition: 0.3s ease;
}

.btn-gold:hover {
  background: #b5962e;
  color: white;
}
</style>
