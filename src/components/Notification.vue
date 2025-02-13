<template>
  <div :id="String(toastId)" class="toast fade show custom-toast" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="3000">
    <div class="toast-header">
      <i class="bi bi-bag-check me-2 text-gold"></i>
      <strong class="me-auto text-uppercase">Fashion Alert</strong>
      <small class="text-muted">Just now</small>
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
  mounted () {
    this.$nextTick(() => {
      const toastElement = document.getElementById(String(this.toastId));
      if (toastElement) {
        const toast = new Toast(toastElement);
        toast.show();
      }
    });
  }
}
</script>

<style scoped>
/* Màu sắc sang trọng */
.text-gold {
  color: #d4af37;
}

/* Tùy chỉnh Toast */
.custom-toast {
  background: #fff8e1;
  border-left: 5px solid #d4af37;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

/* Header đẹp hơn */
.toast-header {
  background: #000;
  color: #fff;
  font-weight: bold;
  border-radius: 10px 10px 0 0;
}

/* Nội dung toast */
.toast-body {
  font-size: 1rem;
  color: #333;
}
</style>
