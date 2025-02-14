<template>
  <div class="container min-vh-100">
    <div class="row my-5">
      <div class="col-md-6 offset-md-3 mb-3">
        <div v-if="errors.length" class="alert alert-danger" role="alert">
          <ul>
            <li v-for="e in errors">{{ e }}</li>
          </ul>
        </div>
        <div class="card">
          <h5 class="card-header">ĐĂNG KÝ TÀI KHOẢN</h5>
          <div class="card-body">
            <form>
              <fieldset>
                <legend>Thông tin tài khoản</legend>
                <div class="mb-2">
                  <label for="usernameInput">Tên đăng nhập:</label>
                  <input type="text" class="form-control" name="usernameInput" id="usernameInput"
                    v-model="usernameInput">
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-2">
                      <label for="passwordInput">Mật khẩu:</label>
                      <input type="password" class="form-control" name="passwordInput" id="passwordInput"
                        v-model="passwordInput">
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-2">
                      <label for="confirmPasswordInput">Xác nhận mật khẩu:</label>
                      <input type="password" class="form-control" name="confirmPasswordInput" id="confirmPasswordInput"
                        v-model="confirmPasswordInput">
                    </div>
                  </div>
                </div>
              </fieldset>
              <fieldset>
                <legend>Thông tin giao hàng</legend>
                <div class="mb-2">
                  <label for="nameInput">Họ và tên:</label>
                  <input type="text" class="form-control" name="nameInput" id="nameInput" v-model="nameInput">
                </div>
                <div class="mb-2">
                  <label for="emailInput">Địa chỉ Email:</label>
                  <input type="email" class="form-control" name="emailInput" id="emailInput" v-model="emailInput">
                </div>
                <div class="mb-2">
                  <label for="streetAddressInput">Địa chỉ:</label>
                  <input type="text" class="form-control" name="streetAddressInput" id="streetAddressInput"
                    v-model="streetAddressInput">
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-2">
                      <label for="suburbInput">Quận/Huyện:</label>
                      <input type="text" class="form-control" name="suburbInput" id="suburbInput" v-model="suburbInput">
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-2">
                      <label for="postcodeInput">Mã bưu điện:</label>
                      <input type="text" class="form-control" name="postcodeInput" id="postcodeInput"
                        v-model="postcodeInput">
                    </div>
                  </div>
                </div>
                <div class="mb-2">
                  <label for="mobileNumberInput">Số điện thoại:</label>
                  <input type="tel" class="form-control" name="mobileNumberInput" id="mobileNumberInput"
                    v-model="mobileNumberInput">
                </div>
              </fieldset>
              <button type="button" class="btn btn-outline-dark float-end" @click="checkForm">Đăng ký</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { publicRequest } from '../requestMethod';

export default {
  data() {
    return {
      errors: [],
      nameInput: '',
      usernameInput: '',
      passwordInput: '',
      confirmPasswordInput: '',
      emailInput: '',
      streetAddressInput: '',
      suburbInput: '',
      postcodeInput: '',
      mobileNumberInput: '',
      showTerms: false
    }
  },
  methods: {
    checkForm(e) {
      var result = true;
      this.errors = [];

      if (!this.usernameInput.trim() || this.usernameInput.trim().length < 3) {
        result = false;
        this.errors.push("Vui lòng nhập tên đăng nhập ít nhất 3 ký tự.");
      }

      if (!this.passwordInput.trim() || this.passwordInput.trim().length < 8) {
        result = false;
        this.errors.push("Vui lòng nhập mật khẩu ít nhất 8 ký tự.");
      } else if (!/[!$%^&*]/.test(this.passwordInput.trim())) {
        result = false;
        this.errors.push("Mật khẩu phải chứa ít nhất một ký tự đặc biệt: $, %, ^, &, hoặc *");
      }

      if (this.passwordInput !== this.confirmPasswordInput) {
        result = false;
        this.errors.push("Mật khẩu xác nhận không khớp.");
      }

      if (!this.emailInput.trim()) {
        result = false;
        this.errors.push("Vui lòng nhập địa chỉ email.");
      } else if (!/\S+@\S+\.\S+/.test(this.emailInput.trim())) {
        result = false;
        this.errors.push("Vui lòng nhập email hợp lệ.");
      }

      if (!result) {
        e.preventDefault();
        window.scrollTo(0, 0);
        return;
      }

      var shippingAddress = this.streetAddressInput + ', ' + this.suburbInput + ', ' + this.postcodeInput;

      publicRequest.post('/auth/register', {
        username: this.usernameInput,
        password: this.passwordInput,
        fullname: this.nameInput,
        email: this.emailInput,
        phone: this.mobileNumberInput,
        shippingAddress: shippingAddress
      }).then(res => {
        console.log(res);
        this.$store.dispatch('addNotification', 'Đăng ký thành công!');
        this.$router.push('/login');
      }).catch(err => {
        console.log(err);
        this.$store.dispatch('addNotification', 'Đăng ký thất bại!');
      });
    }
  }
}
</script>

<style scoped></style>