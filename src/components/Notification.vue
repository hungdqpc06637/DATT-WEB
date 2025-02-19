<template>
  <div :id="String(toastId)" class="toast fade show custom-toast" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="toast-header">
      <i class="bi bi-bell me-2 text-warning"></i>
      <strong class="me-auto">Thông Báo</strong>
      <small class="text-muted">{{ timestamp }}</small>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body">
      {{ desc }}
    </div>
  </div>
</template>

<script>
import { Toast } from 'bootstrap';

export default {
  props: {
    toastId: {
      type: Number,
      required: true
    },
    desc: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      timestamp: this.formatTimestamp()
    };
  },
  mounted() {
    this.$nextTick(() => {
      const toastElement = document.getElementById(String(this.toastId));
      if (toastElement) {
        const toast = new Toast(toastElement);
        toast.show();
      }
    });
  },
  methods: {
    formatTimestamp() {
      const now = new Date();
      return now.toLocaleTimeString();
    }
  }
};
</script>

<style scoped>
.custom-toast {
  max-width: 350px;
  background-color: #fffbe6;
  color: #333;
  border-radius: 8px;
  border: 1px solid #ffeb3b;
  font-size: 14px;
}

.toast-header {
  background-color: #ff9800;
  color: white;
}

.toast-body {
  padding: 10px;
  font-size: 14px;
}

.toast-container {
  z-index: 9999;
}
</style>
