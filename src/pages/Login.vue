<template>
  <div class="container min-vh-100">
    <div class="row my-5 justify-content-center">
      <div class="col-md-5 mb-3">
        <div v-if="errors.length" class="alert alert-danger" role="alert">
          <ul>
            <li v-for="e in errors" :key="e">{{ e }}</li>
          </ul>
        </div>
        <div class="card">
          <h5 class="card-header">Đăng nhập</h5>
          <div class="card-body">
            <form @submit.prevent="checkForm">
              <div class="mb-3">
                <label for="emailInput" class="form-label">Email</label>
                <input type="email" class="form-control" id="emailInput" v-model="emailInput"
                  placeholder="Nhập email của bạn">
              </div>
              <div class="mb-3">
                <label for="passwordInput" class="form-label">Mật khẩu</label>
                <input type="password" class="form-control" id="passwordInput" v-model="passwordInput"
                  placeholder="Nhập mật khẩu của bạn">
              </div>
              <button type="submit" class="btn btn-outline-dark float-end" :disabled="isLoading">
                <span v-if="isLoading" class="spinner-border spinner-border-sm"></span> Đăng nhập
              </button>
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
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../composables/useAuth";

export default {
  setup() {
    const { login } = useAuth(); // ✅ Sử dụng useAuth để cập nhật user

    return { login };
  },
  data() {
    return {
      errors: [],
      emailInput: '',
      passwordInput: '',
      isLoading: false,
    };
  },
  methods: {
    checkForm() {
      this.errors = [];
      if (!this.emailInput.trim()) this.errors.push("Vui lòng nhập email.");
      if (!this.passwordInput.trim()) this.errors.push("Vui lòng nhập mật khẩu.");

      if (this.errors.length === 0) {
        this.handleLogin();
      }
    },
    async handleLogin() {
      this.isLoading = true;
      try {
        const response = await publicRequest.post("/user/login", {
          email: this.emailInput,
          password: this.passwordInput,
        });

        console.log("📥 Response từ server:", response.data); // ✅ In toàn bộ dữ liệu response

        // ✅ Nếu không có token trong response, báo lỗi
        if (!response.data.data) {
          throw new Error(response.data.message || "Đăng nhập thất bại.");
        }

        const token = response.data.data;
        const user = jwtDecode(token);

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
        this.login(user);

        this.$router.push(user.role === "admin" ? "/admin" : "/profile");
      } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        this.errors.push(error.response?.data?.message || "Đăng nhập thất bại.");
        this.isLoading = false;
      }
    }



  }
};
</script>


<style scoped>
.spinner-border {
  margin-right: 5px;
}
</style>
