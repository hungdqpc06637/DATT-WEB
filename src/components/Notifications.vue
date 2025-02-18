<template>
  <div class="toast">
    <div class="toast-body">
      <!-- Kiểm tra nếu desc là đối tượng, lấy desc.desc, nếu là chuỗi, hiển thị trực tiếp -->
      <span v-if="typeof desc === 'object'">{{ desc.desc }}</span>
      <span v-else>{{ desc }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    toastId: {
      type: [String, Number],
      required: true
    },
    desc: {
      type: [String, Object], // Chấp nhận cả String hoặc Object
      required: true
    }
  }
}
</script>

<style scoped>
/* Style cho toast nếu cần */
</style>
