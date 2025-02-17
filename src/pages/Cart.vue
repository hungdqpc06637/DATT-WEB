<template>
  <div class="container my-5">
    <div class="row min-vh-100">
      <!-- Danh sách sản phẩm trong giỏ hàng -->
      <div class="col-md-8">
        <h1 class="fw-bold text-uppercase mb-4">Giỏ hàng của bạn</h1>
        <hr class="border-gold">
        <!-- Hiển thị sản phẩm trong giỏ hàng -->
        <CartItem v-for="(item, index) in cart" :key="item.id + '-' + index" :item="item" @remove="removeItem(item.id)"
          @update="updateQuantity(item.id, $event)" />

        <div v-if="cart.length === 0" class="text-center mt-5">
          <p class="text-muted">🛒 Giỏ hàng của bạn đang trống.</p>
          <router-link to="/products">
            <button class="btn btn-dark">Tiếp tục mua sắm</button>
          </router-link>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card mb-3 sticky-top summary">
          <div class="card-body">
            <h5 class="card-title text-uppercase text-center fw-bold">Tóm tắt đơn hàng</h5>
            <ul class="list-group list-group-flush my-3">
              <li class="list-group-item d-flex justify-content-between align-items-center">
                Tạm tính
                <span>{{ subTotal.toFixed(2) }}₫</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center border-top pt-3">
                <strong>Tổng cộng</strong>
                <strong class="text-gold">{{ total.toFixed(2) }}₫</strong>
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
    };
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

        if (response.data.code === 200 && response.data.data) {
          this.cart = response.data.data; // Lưu dữ liệu giỏ hàng
          this.calculateTotal(); // Tính toán lại tổng
        } else {
          console.error("Failed to fetch cart data", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    },

    // Cập nhật giỏ hàng khi xóa sản phẩm
    removeItem(id) {
      // Lọc giỏ hàng và loại bỏ sản phẩm với id được chọn
      this.cart = this.cart.filter(item => item.id !== id);
      this.calculateTotal(); // Tính lại tổng sau khi xóa sản phẩm
    },

    updateQuantity(id, amount) {
      const product = this.cart.find(item => item.id === id);
      if (product) {
        product.quantity += amount;
        if (product.quantity < 1) product.quantity = 1; // Số lượng tối thiểu là 1
        this.calculateTotal(); // Tính lại tổng sau khi thay đổi số lượng
      }
    },
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
