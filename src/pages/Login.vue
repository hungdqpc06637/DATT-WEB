<template>
  <div class="container min-vh-100">
    <div class="row my-5 justify-content-center">
      <div class="col-md-5 mb-3">
        <div v-if="errors.length" class="alert alert-danger" role="alert">
          <ul>
            <li v-for="e in errors">{{e}}</li>
          </ul>
        </div>
        <div class="card">
          <h5 class="card-header">Đăng nhập</h5>
          <div class="card-body">
            <form>
              <div class="mb-3">
                <label for="usernameInput" class="form-label">Tên đăng nhập</label>
                <input type="text" class="form-control" name="usernameInput" id="usernameInput" v-model="usernameInput" placeholder="Nhập tên đăng nhập của bạn">
              </div>
              <div class="mb-3">
                <label for="passwordInput" class="form-label">Mật khẩu</label>
                <input type="password" class="form-control" name="passwordInput" id="passwordInput" v-model="passwordInput" placeholder="Nhập mật khẩu của bạn">
              </div>
              <button type="button" class="btn btn-outline-dark float-end" @click="checkForm" :disabled="isLoading">Đăng nhập</button>
            </form>
          </div>
          <div class="card-footer text-center d-flex justify-content-between">
            <small><router-link to="/register">Chưa có tài khoản?</router-link></small>
            <small><a href="#">Quên mật khẩu?</a></small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { publicRequest } from '../requestMethod.js';

export default {
  data() {
    return {
      errors: [],
      usernameInput: '',
      passwordInput: '',
      isLoading: false,
    }
  },
  methods: {
    checkForm(e) {
      var result = true;
      this.errors = [];

      // Validate username
      if (!this.usernameInput.trim()) {
        result = false;
        this.errors.push("Vui lòng nhập tên đăng nhập.");
      }

      // Validate password
      if (!this.passwordInput.trim()) {
        result = false;
        this.errors.push("Vui lòng nhập mật khẩu.");
      }

      if (!result) {
        e.preventDefault();
        window.scrollTo(0, 0);
      } else {
        this.handleLogin();
      }
    },

    handleLogin() {
      this.isLoading = true;
      const data = {
        username: this.usernameInput,
        password: this.passwordInput
      }
      publicRequest.post('/auth/login', data)
      .then(response => {
        this.$store.dispatch('setUser', response.data);
        this.$store.dispatch('addNotification', "Bạn đã đăng nhập thành công.");
        this.$router.push('/profile');
      })
      .catch(error => {
        console.log(error);
        this.isLoading = false;
        this.$store.dispatch('addNotification', "Đăng nhập thất bại.");
      })
    }
  }
}
</script>

<style scoped>
</style>
