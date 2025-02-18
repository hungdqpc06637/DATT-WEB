<template>
  <div class="container mt-5 min-vh-100">
    <div class="row mb-5" v-if="user">
      <div class="col-md-3">
        <div class="card mb-3 text-center">
          <div class="card-body">
            <img src="https://i.pravatar.cc/150" class="rounded-circle mb-3" alt="Ảnh đại diện">
            <h5 class="card-title">{{ user.username }} <i class="bi bi-patch-check-fill"></i></h5>
            <p class="card-text">{{ user.phone }}</p>
            <div class="d-flex justify-content-between">
              <div>
                <span>Thành viên từ</span>
                <span>{{ new Date(user.createdAt).toLocaleDateString() }}</span>
              </div>
              <div>
                <span>Đơn hàng</span>
                <span>3</span>
              </div>
            </div>
          </div>
        </div>
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">Xếp hạng thành viên</h5>
            <p class="card-text">Đồng ({{ user.points }}/1000)</p>
            <div class="progress">
              <div class="progress-bar bg-dark" :style="{ width: (user.points / 10) + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-9">
        <ul class="nav nav-tabs mb-3">
          <li class="nav-item">
            <a class="nav-link active" data-bs-toggle="tab" href="#edit-info">Chỉnh sửa thông tin</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" data-bs-toggle="tab" href="#order-history">Lịch sử đơn hàng</a>
          </li>
        </ul>
        <div class="tab-content mb-3">
          <div class="tab-pane fade show active" id="edit-info">
            <form>
              <div class="mb-3">
                <label for="fullname" class="form-label">Họ và tên</label>
                <input type="text" class="form-control" id="fullname" v-model="nameInput">
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Địa chỉ email</label>
                <input type="email" class="form-control" id="email" v-model="emailInput">
              </div>
              <div class="mb-3">
                <label for="phone" class="form-label">Số điện thoại</label>
                <input type="tel" class="form-control" id="phone" v-model="phoneInput">
              </div>
              <div class="mb-3">
                <label for="address" class="form-label">Địa chỉ giao hàng</label>
                <input type="text" class="form-control" id="address" v-model="shippingAddressInput">
              </div>
              <button type="button" class="btn btn-outline-dark float-end" @click="saveChanges">Lưu thay đổi</button>
            </form>
          </div>
          <div class="tab-pane fade" id="order-history">
            <History :userId="userId" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import History from "../components/History.vue";
import { userRequest } from "../requestMethod.js";
import { useAuth } from "../composables/useAuth"; // ✅ Import useAuth để cập nhật user toàn cục

export default {
  components: { History },
  setup() {
    const { user, updateUser } = useAuth(); // ✅ Lấy user và hàm cập nhật từ useAuth
    const nameInput = ref("");
    const emailInput = ref("");
    const phoneInput = ref("");
    const shippingAddressInput = ref("");
    const userId = ref(null);

    onMounted(() => {
      // Lấy user từ localStorage
      const storedUser = JSON.parse(localStorage.getItem('user'));

      if (storedUser && storedUser.user_id) {
        userId.value = storedUser.user_id; // Lấy user_id từ localStorage
      }

      if (!user.value) {
        window.location.href = "/login"; // Chuyển hướng nếu chưa đăng nhập
      } else {
        nameInput.value = user.value.fullname || "";
        emailInput.value = user.value.email || "";
        phoneInput.value = user.value.phone || "";
        shippingAddressInput.value = user.value.shippingAddress || "";
      }
    });

    const saveChanges = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || !user.value?._id) return;

        const response = await userRequest(token).put(`/users/${user.value._id}`, {
          fullname: nameInput.value,
          email: emailInput.value,
          phone: phoneInput.value,
          shippingAddress: shippingAddressInput.value,
        });

        localStorage.setItem("user", JSON.stringify(response.data));
        updateUser(response.data); // ✅ Cập nhật trạng thái user toàn cục, giúp Navbar nhận biết thay đổi ngay lập tức

        alert("Đã lưu thay đổi.");
      } catch (error) {
        console.error("Lỗi cập nhật:", error);
        alert("Lỗi cập nhật thông tin.");
      }
    };

    return { user, nameInput, emailInput, phoneInput, shippingAddressInput, saveChanges, userId };
  },
};
</script>



<style scoped></style>
