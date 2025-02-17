<template>
  <div class="vh-100 d-flex flex-column justify-content-center align-items-center text-white"
    style="background: linear-gradient(135deg, #667eea, #764ba2);">
    <div class="text-center w-75">
      <h1 class="fw-bold display-4 mb-3">
        <i class="bi bi-person-gear me-2"></i>Chào mừng, Quản trị viên!
      </h1>
      <p class="fs-5 mb-4">
        <i class="bi bi-lightbulb me-2"></i>Bạn đã sẵn sàng khám phá hệ thống quản trị?
        Điều hành mọi thứ trong tầm tay bạn.
      </p>

      <div class="d-flex justify-content-center gap-4">
        <router-link to="/admin/dashboard" class="btn btn-light btn-lg fw-bold shadow-sm" style="border-radius: 30px;">
          <i class="bi bi-speedometer2"></i> Bắt đầu ngay
        </router-link>
        <router-link to="/admin/help" class="btn btn-outline-light btn-lg fw-bold shadow-sm"
          style="border-radius: 30px;">
          <i class="bi bi-question-circle"></i> Trợ giúp
        </router-link>
      </div>
    </div>

    <div class="mt-5 d-flex gap-4">
      <i class="bi bi-gear-fill fs-1"></i>
      <i class="bi bi-bar-chart-fill fs-1"></i>
      <i class="bi bi-people-fill fs-1"></i>
      <i class="bi bi-shield-lock-fill fs-1"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminWelcome"
};
</script>

<style>

h1,
p,
.btn,
.bi {
  animation: fadeIn 1.2s ease-in-out;
}

.content[data-v-3b12e1ce] {
  padding: 0 !important;
  background-color: transparent !important;
  overflow: hidden !important;
}
</style>
