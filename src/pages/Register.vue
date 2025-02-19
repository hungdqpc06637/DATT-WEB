<template>
  <div class="container min-vh-100 d-flex justify-content-center align-items-center">
    <div class="row w-100">
      <div class="col-md-6 offset-md-3 mb-3">

        <!-- Hiển thị lỗi chung từ server -->
        <div v-if="errors.length" class="ant-alert ant-alert-error ant-alert-show-icon">
          <span class="ant-alert-icon">❌</span>
          <ul class="ant-alert-message">
            <li v-for="(e, index) in errors" :key="index">{{ e }}</li>
          </ul>
        </div>

        <a-card>
          <template #title>
            <h4 class="text-center">ĐĂNG KÝ TÀI KHOẢN</h4>
          </template>
          <a-form layout="vertical" @submit.prevent="register">
            <a-form-item label="Email" :validate-status="emailError ? 'error' : ''" :help="emailError">
              <a-input v-model:value="email" type="email" required />
            </a-form-item>

            <div class="row">
              <div class="col-md-6">
                <a-form-item label="Mật khẩu">
                  <a-input-password v-model:value="password" required />
                </a-form-item>
              </div>
              <div class="col-md-6">
                <a-form-item label="Xác nhận mật khẩu">
                  <a-input-password v-model:value="confirmPassword" required />
                </a-form-item>
              </div>
            </div>

            <a-form-item label="Họ và tên">
              <a-input v-model:value="fullName" required />
            </a-form-item>

            <a-form-item label="Số điện thoại" :validate-status="phoneError ? 'error' : ''" :help="phoneError">
              <a-input v-model:value="phone" required />
            </a-form-item>

            <a-button type="primary" html-type="submit" block :loading="isLoading">
              Đăng ký
            </a-button>
          </a-form>
        </a-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { publicRequest } from "../requestMethod";
import "ant-design-vue/dist/reset.css";

const fullName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const phone = ref("");
const errors = ref([]);
const isLoading = ref(false);

const emailError = ref("");
const phoneError = ref("");

const register = async () => {
  errors.value = [];
  emailError.value = "";
  phoneError.value = "";

  isLoading.value = true;

  const requestData = {
    name: fullName.value,
    email: email.value,
    password: password.value,
    phone: phone.value,
  };

  try {
    const response = await publicRequest.post("/user/register", requestData);

    if (response.data.code === 200) {
      alert("🎉 Đăng ký thành công! Chuyển hướng đến đăng nhập...");
      setTimeout(() => (window.location.href = "/login"), 1500);
    } else {
      errors.value.push(response.data.message || "❌ Đăng ký thất bại.");
    }
  } catch (err) {
    console.error("🔥 Lỗi API chi tiết:", err.response?.data || err.message);

    if (err.response && err.response.data) {
      const errorMsg = err.response.data.message || "Lỗi không xác định từ server.";

      if (errorMsg.includes("email đã tồn tại")) {
        emailError.value = "📧 Email đã được sử dụng. Vui lòng thử email khác.";
      } else if (errorMsg.includes("số điện thoại đã tồn tại")) {
        phoneError.value = "📞 Số điện thoại đã được sử dụng. Vui lòng thử số khác.";
      } else {
        errors.value.push(`⚠️ Lỗi từ server: ${errorMsg}`);
      }
    } else {
      errors.value.push(`⚠️ Không thể kết nối đến server: ${err.message}`);
    }
  }

  isLoading.value = false;
};
</script>
