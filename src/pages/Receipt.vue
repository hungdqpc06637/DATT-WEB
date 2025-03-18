<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Spinner from '../components/Spinner.vue';
import { publicRequest } from '../requestMethod';

const isLoading = ref(true);
const order = ref({});
const products = ref([]);

const storedUser = JSON.parse(localStorage.getItem('user'));
const userId = storedUser ? storedUser.user_id : null;

const route = useRoute();
const orderId = route.params.id;

onMounted(() => {

  if (!orderId) {
    console.error("❌ Không tìm thấy orderId từ route params.");
    return;
  }

  if (!userId) {
    console.error("❌ Không tìm thấy user_id trong localStorage.");
    return;
  }

  // Gọi API để lấy chi tiết đơn hàng
  publicRequest
    .get(`/order/getorderid/${orderId}`)
    .then((response) => {
      if (!response.data || !response.data.data) {
        console.error("❌ API không trả về dữ liệu đơn hàng hợp lệ!", response.data);
        return;
      }

      const data = response.data.data;

      order.value = {
        ...data,
        createdAt: data.created_at,
        total: data.total_price,
        shippingAddress: data.shipping_address
          ? `${data.shipping_address.full_address}, ${data.shipping_address.city}, ${data.shipping_address.country}`
          : "Địa chỉ giao hàng chưa được cập nhật",
      };

      products.value = (data.order_details || []).map(item => ({
        title: item.product_variant?.product?.name || "Sản phẩm không xác định",
        img: (item.product_variant?.product_images?.length > 0)
          ? `/images/${item.product_variant.product_images[0].image_url}`
          : '', // Ảnh mặc định nếu không có ảnh
        price: item.unit_price || 0,
        quantity: item.quantity || 1,
        size: item.product_variant?.size || "Không xác định",
        color: item.product_variant?.color || "Không xác định",
      }));

      isLoading.value = false;
    })
    .catch((error) => {
      console.error("❌ Lỗi khi tải đơn hàng:", error);
      isLoading.value = false;
    });
});


// Hàm tính toán chiều rộng thanh tiến trình dựa trên trạng thái
const getProgress = (status) => {
  switch (status) {
    case 'Chờ xác nhận':
      return 20;
    case 'Chuẩn bị hàng':
      return 40;
    case 'Đang giao':
      return 60;
    case 'Đã giao':
      return 80;
    case 'Đã hủy':
      return 100;
    default:
      return 0;
  }
};

// Hàm định dạng tiền tệ VND
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};


</script>

<template>
  <div class="container my-5">
    <div class="row min-vh-100 d-flex justify-content-center">
      <Spinner v-if="isLoading" />
      <div class="col-lg-10 col-xl-8" v-else>
        <div class="card" style="border-radius: 10px;">
          <div class="card-header px-4 py-3">
            <h5 class="text-muted mb-0 text-center">Cảm ơn bạn đã đặt hàng, <span>{{ order.recipient_name }}</span>!
            </h5>
          </div>
          <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <p class="lead fw-normal mb-0">Hóa đơn</p>
              <p class="small text-muted mb-0">Mã đơn hàng: {{ order.id }}</p>
            </div>
            <div class="card shadow-0 border mb-4">
              <div class="card-body">
                <div class="row mb-1" v-for="product in products" :key="product.title">
                  <div class="col-md-2">
                    <img :src="product.img" class="img-fluid" :alt="product.title || 'Sản phẩm không có tiêu đề'">
                  </div>
                  <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
                    <p class="text-muted mb-0">{{ product.title }}</p>
                  </div>
                  <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
                    <p class="text-muted mb-0 small">Kích thước: {{ product.size }}</p>
                  </div>
                  <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
                    <p class="text-muted mb-0 small">Màu sắc: {{ product.color }}</p>
                  </div>
                  <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
                    <p class="text-muted mb-0 small">Số lượng: {{ product.quantity }}</p>
                  </div>
                  <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
                    <p class="text-muted mb-0 small">Giá: {{ formatCurrency(product.quantity * product.price) }}</p>
                  </div>
                </div>
                <hr class="mb-4" style="background-color: #e0e0e0; opacity: 1;">
                <div class="row d-flex align-items-center">
                  <div class="col-md-2">
                    <p class="text-muted mb-0 small">Theo dõi đơn hàng</p>
                  </div>
                  <div class="col-md-10">
                    <div class="progress" style="height: 6px; border-radius: 16px;">
                      <div class="progress-bar bg-dark"
                        :style="{ width: getProgress(order.status) + '%', borderRadius: '16px' }" role="progressbar"
                        :aria-valuenow="getProgress(order.status)" aria-valuemin="0" aria-valuemax="100">
                      </div>
                    </div>
                    <div class="d-flex justify-content-around mb-1">
                      <p class="text-muted mt-1 mb-0 small ms-xl-5"
                        :class="{ 'fw-bold': order.status === 'Chờ xác nhận' }">Chờ xác nhận</p>
                      <p class="text-muted mt-1 mb-0 small ms-xl-5"
                        :class="{ 'fw-bold': order.status === 'Chuẩn bị hàng' }">Chuẩn bị hàng</p>
                      <p class="text-muted mt-1 mb-0 small ms-xl-5"
                        :class="{ 'fw-bold': order.status === 'Đang giao' }">Đang giao</p>
                      <p class="text-muted mt-1 mb-0 small ms-xl-5" :class="{ 'fw-bold': order.status === 'Đã giao' }">
                        Đã giao</p>
                      <p class="text-muted mt-1 mb-0 small ms-xl-5" :class="{ 'fw-bold': order.status === 'Đã hủy' }">Đã
                        hủy</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Thông tin chi tiết đơn hàng -->
            <div class="d-flex justify-content-between pt-2">
              <p class="fw-bold mb-0">Chi tiết đơn hàng</p>
              <p class="text-muted mb-0"><span class="fw-bold me-4">Tạm tính</span> {{ formatCurrency(order.total) }}
              </p>
            </div>

            <div class="d-flex justify-content-between pt-2">
              <p class="text-muted mb-0">Ngày lập hóa đơn: {{ new Date(order.createdAt).toLocaleString() }}</p>
            </div>

            <div class="d-flex justify-content-between mb-5">
              <p class="text-muted mb-0">Địa chỉ giao hàng: {{ order.shippingAddress }}</p>
              <p class="text-muted mb-0"><span class="fw-bold me-4">Phí vận chuyển</span> VND</p>
            </div>

            <div class="d-flex justify-content-between mb-5">
              <p class="text-muted mb-0">Trạng thái đơn hàng: {{ order.status }}</p>
            </div>
          </div>
          <div class="card-footer border-0 px-4 py-3 bg-dark">
            <h5 class="d-flex align-items-center justify-content-end text-white text-uppercase mb-0">Tổng thanh toán:
              <span class="mb-0 ms-2">{{ formatCurrency(order.total_price) }}</span>
            </h5>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
