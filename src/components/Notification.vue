<template>
  <div :id="String(toastId)" class="toast fade show custom-toast" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="3000">
    <div class="toast-header">
      <i class="bi bi-bag-check me-2 text-gold"></i>
      <strong class="me-auto text-uppercase">Thông Báo</strong>
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
      default: -1
    },
    desc: {
      type: String,
      default: 'Your fashion item has been added to the cart!'
    }
  },
  data() {
    return {
      timestamp: this.formatTimestamp()
    };
  },
  mounted () {
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
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    }
  }
}
</script>

<style scoped>
.custom-toast {
  max-width: 400px;
  background-color: #f0f8ff;
  color: #333;
  border-radius: 10px;
  border: 1px solid #e0e0e0;
  font-size: 14px;
}

.toast-header {
  background-color: #4caf50;
  color: white;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.toast-body {
  padding: 15px;
  font-size: 16px;
  line-height: 1.4;
}

.btn-close {
  color: white;
  opacity: 0.7;
}

.custom-toast .toast-header i {
  font-size: 18px;
}

.toast-body {
  font-size: 14px;
  font-weight: 500;
}

.toast-body p {
  margin: 0;
}

.toast-container {
  z-index: 9999;
}

.toast {
  opacity: 1 !important;
  transition: opacity 0.3s ease-in-out !important;
}
</style>
