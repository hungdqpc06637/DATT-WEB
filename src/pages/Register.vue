<template>
  <div class="container min-vh-100">
    <div class="row my-5">
      <div class="col-md-6 offset-md-3 mb-3">
        <!-- 🔴 Hiển thị lỗi -->
        <div v-if="errors.length" class="alert alert-danger">
          <ul>
            <li v-for="(e, index) in errors" :key="index">{{ e }}</li>
          </ul>
        </div>

        <div class="card">
          <div class="card-header bg-primary text-white text-center">
            <h4>ĐĂNG KÝ TÀI KHOẢN</h4>
          </div>
          <div class="card-body">
            <form @submit.prevent="register">
              <!-- 🔹 Email -->
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" v-model.trim="email" required />
              </div>

              <!-- 🔹 Mật khẩu -->
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Mật khẩu</label>
                  <input type="password" class="form-control" v-model.trim="password" required />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Xác nhận mật khẩu</label>
                  <input type="password" class="form-control" v-model.trim="confirmPassword" required />
                </div>
              </div>

              <!-- 🔹 Họ và tên -->
              <div class="mb-3">
                <label class="form-label">Họ và tên</label>
                <input type="text" class="form-control" v-model.trim="fullName" required />
              </div>

              <!-- 🔹 Số điện thoại -->
              <div class="mb-3">
                <label class="form-label">Số điện thoại</label>
                <input type="tel" class="form-control" v-model.trim="phone" required />
              </div>

              <!-- 🔹 Nút đăng ký -->
              <button type="submit" class="btn btn-primary w-100" :disabled="isLoading">
                <span v-if="isLoading" class="spinner-border spinner-border-sm"></span>
                Đăng ký
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from "vue";
import { publicRequest } from "../requestMethod";

// 🔹 Khai báo biến
const fullName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const phone = ref("");
const errors = ref([]);
const isLoading = ref(false);

// ✅ Hàm đăng ký
const register = async () => {
  errors.value = [];

  // ✅ Kiểm tra dữ liệu nhập
  if (!fullName.value || !email.value || !password.value || !phone.value) {
    errors.value.push("Vui lòng nhập đầy đủ thông tin.");
    return;
  }

  if (password.value.length < 8) errors.value.push("Mật khẩu ít nhất 8 ký tự.");
  if (password.value !== confirmPassword.value) errors.value.push("Mật khẩu xác nhận không khớp.");
  if (!/\S+@\S+\.\S+/.test(email.value)) errors.value.push("Email không hợp lệ.");
  if (!/^\d{10}$/.test(phone.value)) errors.value.push("Số điện thoại phải có 10 chữ số.");

  if (errors.value.length > 0) {
    console.warn("⚠️ Lỗi nhập liệu:", errors.value);
    return;
  }

  isLoading.value = true;

  const requestData = {
    name: fullName.value,
    email: email.value,
    password: password.value,
    phone: phone.value,
  };

  console.log("📤 Gửi API với body:", JSON.stringify(requestData));

  try {
    const response = await publicRequest.post("/user/register", requestData);

    console.log("📌 API Response:", response);

    if (response.data.code === 200) {
      alert("Đăng ký thành công! Chuyển hướng đến đăng nhập...");
      setTimeout(() => (window.location.href = "/login"), 1500);
    } else {
      console.warn("⚠️ API trả về lỗi:", response.data);
      errors.value.push(response.data.message || "Đăng ký thất bại.");
    }
  } catch (err) {
    console.error("❌ Lỗi khi gọi API:", err);

    if (err.response) {
      console.warn("⚠️ API Response Error:", err.response);

      // ✅ Xử lý lỗi email trùng
      if (err.response.data.message.includes("Duplicate entry")) {
        errors.value.push("Email đã tồn tại, vui lòng dùng email khác.");
      } else {
        const errorMsg = err.response.data.message || "Lỗi từ server.";
        errors.value.push(errorMsg);
      }
    } else {
      errors.value.push("Không thể kết nối đến server.");
    }
  }


  isLoading.value = false;
};
</script>
