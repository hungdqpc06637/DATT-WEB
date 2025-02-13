<template>
  <div class="container my-5">
    <div class="row min-vh-100">
      <!-- Danh sách sản phẩm trong giỏ hàng -->
      <div class="col-md-8">
        <h1 class="fw-bold text-uppercase mb-4">Giỏ hàng của bạn</h1>
        <hr class="border-gold">
        <CartItem v-for="item in cart" :key="item.id" :item="item" />
        
        <div v-if="cart.length === 0" class="text-center mt-5">
          <p class="text-muted">🛒 Giỏ hàng của bạn đang trống.</p>
          <router-link to="/shop">
            <button class="btn btn-dark">Tiếp tục mua sắm</button>
          </router-link>
        </div>
      </div>

      <!-- Tổng hợp đơn hàng -->
      <div class="col-md-4">
        <div class="card mb-3 sticky-top summary">
          <div class="card-body">
            <h5 class="card-title text-uppercase text-center fw-bold">Tóm tắt đơn hàng</h5>
            <ul class="list-group list-group-flush my-3">
              <li class="list-group-item d-flex justify-content-between align-items-center">
                Tạm tính
                <span>${{ subTotal.toFixed(2) }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center">
                Phí vận chuyển
                <span>${{ shipping }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center">
                Giảm giá
                <span>- $0.00</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center border-top pt-3">
                <strong>Tổng cộng</strong>
                <strong class="text-gold">${{ total }}</strong>
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

export default {
  components: {
    CartItem
  },
  data() {
    return {
      cart: [],
      shipping: 9.99,
      subTotal: 0,
      total: 0
    }
  },
  created() {
    this.cart = this.$store.getters.getCart;
    this.calculateTotal();
  },
  methods: {
    calculateTotal() {
      this.subTotal = this.$store.getters.getCartTotal;
      this.total = (this.subTotal + this.shipping).toFixed(2);
    }
  },
  watch: {
    '$store.getters.getCartSize': function() {
      this.calculateTotal();
    }
  }
}
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
