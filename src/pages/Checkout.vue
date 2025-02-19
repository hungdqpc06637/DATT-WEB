<template>
  <div class="container my-5 min-vh-100">
    <div class="row g-5">
      <div class="col-md-5 col-lg-4 order-md-last">
        <h4 class="d-flex justify-content-between align-items-center mb-3">
          <span>Giỏ hàng của bạn</span>
        </h4>
        <ul class="list-group mb-3">
          <li class="list-group-item d-flex justify-content-between lh-sm" v-for="item in items" :key="item.id">
            <div>
              <h6 class="my-0">{{ item.title }}</h6>
              <small class="text-body-secondary">Số lượng: {{ item.quantity }}</small>
            </div>
            <span class="text-body-secondary">{{ (item.price * item.quantity).toLocaleString() }} VNĐ</span>
          </li>
          <li class="list-group-item d-flex justify-content-between bg-body-tertiary">
            <div class="text-success">
              <h6 class="my-0">Giảm giá</h6>
              <small>MÃ KHUYẾN MÃI</small>
            </div>
            <span class="text-success">−5.000 VNĐ</span>
          </li>
          <li class="list-group-item d-flex justify-content-between">
            <span>Tổng cộng</span>
            <strong>{{ total.toLocaleString() }} VNĐ</strong>
          </li>
        </ul>

        <div class="card p-2 mb-3">
          <div class="input-group">
            <input type="text" class="form-control" placeholder="Nhập mã giảm giá">
            <button type="submit" class="btn btn-outline-secondary">Áp dụng</button>
          </div>
        </div>
        <div class="card p-2">
          <textarea class="form-control" id="comment" rows="3" placeholder="Ghi chú đơn hàng..."
            v-model="noteInput"></textarea>
        </div>
      </div>

      <div class="col-md-7 col-lg-8">
        <h4 class="mb-3">Thông tin giao hàng</h4>
        <form class="needs-validation" novalidate>
          <div class="row g-3">
            <div class="col-sm-6">
              <label for="name" class="form-label">Họ và tên</label>
              <input type="text" class="form-control" id="name" placeholder="Nguyễn Văn A" v-model="user.name" required>
            </div>
            <div class="col-sm-6">
              <label for="phone" class="form-label">Số điện thoại</label>
              <input type="text" class="form-control" id="phone" placeholder="Số điện thoại..." v-model="user.phone"
                required>
            </div>
            <div class="col-12">
              <label class="form-label">Địa chỉ giao hàng</label>
              <div class="form-check" v-for="address in user.addresses" :key="address.id">
                <input class="form-check-input" type="radio" :id="'address-' + address.id" :value="address"
                  v-model="user.shippingAddress">
                <label class="form-check-label" :for="'address-' + address.id">{{ address }}</label>
              </div>
            </div>
          </div>

          <hr class="my-4">

          <h4 class="mb-3">Phương thức thanh toán</h4>
          <div class="my-3">
            <div class="form-check">
              <input id="cash" value="Tiền mặt" type="radio" class="form-check-input" v-model="methodInput" checked>
              <label class="form-check-label" for="cash">Tiền mặt</label>
            </div>
            <div class="form-check">
              <input id="vnpay" value="VNPay" type="radio" class="form-check-input" v-model="methodInput">
              <label class="form-check-label" for="vnpay">VNPay</label>
            </div>
          </div>

          <hr class="my-4">
          <button class="w-100 btn btn-outline-dark flex-shrink-0 btn-lg" type="button" @click="checkout">Thanh toán
            ngay</button>
        </form>
      </div>
    </div>
  </div>
</template>


<script>
import { publicRequest, userRequest } from '../requestMethod';

export default {
  data() {
    return {
      items: [],
      user: {},
      noteInput: '',
      methodInput: 'Ví điện tử',
      total: 0,
      shipping: 15000, // Phí vận chuyển 15,000 VNĐ
    }
  },
  beforeCreate() {

  },
  mounted() {
    this.items = this.$store.getters.getCart;
    this.user = this.$store.getters.getUser;
  },
  methods: {
    checkout() {
      this.calculateTotal();

      var token = this.$store.getters.getToken;
      userRequest(token).post('/orders', {
        customerId: this.user._id,
        items: this.items,
        shipping: this.shipping,
        shippingAddress: this.user.shippingAddress,
        note: this.noteInput,
        paymentMethod: this.methodInput,
        total: this.total,
      })
        .then(res => {
          this.$store.dispatch('addNotification', 'Đơn hàng của bạn đã được đặt thành công!');
          this.$store.dispatch('resetCart');
          this.$router.push('/receipt/' + res.data._id);
        })
        .catch(err => {
          this.$store.dispatch('addNotification', 'Đặt hàng thất bại. Vui lòng thử lại!');
        });
    },
    calculateTotal() {
      this.subTotal = this.$store.getters.getCartTotal;
      this.total = this.subTotal + this.shipping;
      this.total = parseInt(this.total);
    }
  }
}
</script>

<style></style>
