<template>
  <div class="container my-5 min-vh-100">
    <div class="row g-5">
      <!-- Hiển thị giỏ hàng -->
      <div class="col-md-5 col-lg-4 order-md-last">
        <h4 class="d-flex justify-content-between align-items-center mb-3">
          <span>Giỏ hàng của bạn</span>
        </h4>
        <ul class="list-group mb-3">
          <li class="list-group-item d-flex align-items-center gap-3" v-for="item in items" :key="item.id">
            <img :src="`/images/${item.product_variants[0]?.images?.[0] || 'default.jpg'}`" alt="Hình ảnh sản phẩm"
              class="img-thumbnail" style="width: 80px; height: 80px; object-fit: cover;" />
            <div class="flex-grow-1">
              <h6 class="product-name text-truncate" ref="productName" :title="item.product_variants[0]?.name">
                {{ item.product_variants[0]?.name }}
              </h6>
              <small class="text-muted"> x {{ item.quantity }}</small>
            </div>
            <span class="fw-bold">
              {{ (item.product_variants[0]?.base_price * item.quantity).toLocaleString() }} VNĐ
            </span>
          </li>
          <li class="list-group-item d-flex justify-content-between">
            <span><strong>Tổng cộng</strong></span>
            <strong>{{ total.toLocaleString() }} VNĐ</strong>
          </li>
        </ul>
      </div>

      <!-- Thông tin giao hàng -->
      <div class="col-md-7 col-lg-8">
        <h4 class="mb-3">Thông tin giao hàng</h4>
        <form class="needs-validation" novalidate>
          <div class="row g-3">
            <div class="col-sm-6">
              <label for="name" class="form-label">Họ và tên</label>
              <input type="text" class="form-control" id="name" v-model="user.name" required />
            </div>
            <div class="col-sm-6">
              <label for="phone" class="form-label">Số điện thoại</label>
              <input type="text" class="form-control" id="phone" v-model="user.phone" required />
            </div>
            <div class="col-12">
              <label class="form-label">Địa chỉ giao hàng</label>
              <div v-if="user.addresses && user.addresses.length">
                <div class="form-check" v-for="address in user.addresses" :key="address.id">
                  <input class="form-check-input" type="radio" :id="'address-' + address.id" :value="address.id"
                    v-model="user.shippingAddress" />
                  <label class="form-check-label" :for="'address-' + address.id">
                    {{ address.full_address }}, {{ address.city }}, {{ address.postal_code }}, {{ address.country }}
                    <span v-if="address.is_default" class="badge bg-info text-dark ms-1">Mặc định</span>
                  </label>
                  <!-- Nút xoá địa chỉ kiểu đen -->
                  <button type="button" class="btn btn-sm btn-dark ms-2" @click.prevent="deleteAddress(address.id)">
                    Xoá
                  </button>
                  <!-- Nút sửa địa chỉ kiểu đen -->
                  <button type="button" class="btn btn-sm btn-dark ms-2" @click.prevent="openEditModal(address)">
                    Sửa
                  </button>
                </div>
              </div>
              <div v-else>
                <p>Không có địa chỉ giao hàng nào. Vui lòng thêm địa chỉ.</p>
              </div>
              <button type="button" class="btn btn-sm btn-dark ms-2" @click="openAddModal">
                Thêm địa chỉ mới
              </button>
            </div>
          </div>

          <hr class="my-4" />

          <h4 class="mb-3">Phương thức thanh toán</h4>
          <div class="my-3">
            <div class="form-check">
              <input id="cash" value="Thanh toán khi nhận hàng" type="radio" class="form-check-input"
                v-model="methodInput" checked />
              <label class="form-check-label" for="cash">Thanh toán khi nhận hàng</label>
            </div>
          </div>

          <hr class="my-4" />
          <button class="w-100 btn btn-outline-dark flex-shrink-0 btn-lg" type="button" @click="checkout">
            Thanh toán ngay
          </button>
        </form>
      </div>
    </div>

    <!-- Modal của ant vẫn được dùng cho form thêm/sửa địa chỉ nếu cần -->
    <a-modal v-model:open="modalVisible" centered @ok="handleModalOk" @cancel="handleModalCancel">
      <template #title>
        <div>Thông tin địa chỉ</div>
      </template>
      <a-form layout="vertical">
        <a-form-item label="Địa chỉ">
          <a-input v-model:value="addressForm.full_address" />
        </a-form-item>
        <a-form-item label="Thành phố">
          <a-input v-model:value="addressForm.city" />
        </a-form-item>
        <a-form-item label="Mã bưu điện">
          <a-input v-model:value="addressForm.postal_code" />
        </a-form-item>
        <a-form-item label="Quốc gia">
          <a-input v-model:value="addressForm.country" />
        </a-form-item>
        <a-form-item label="Đặt làm mặc định">
          <a-switch v-model:checked="addressForm.is_default" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { publicRequest } from "../requestMethod.js";
// Loại bỏ import ant-design-vue notifications (Modal, message)

export default {
  name: "Checkout",
  data() {
    return {
      couponCode: "",
      noteInput: "",
      user: {
        name: "",
        phone: "",
        addresses: [], // Danh sách địa chỉ load từ API
        shippingAddress: null,
      },
      methodInput: "Thanh toán khi nhận hàng",
      // Dữ liệu cho modal thêm/sửa địa chỉ
      modalVisible: false,
      addressForm: {
        id: null,
        full_address: "",
        city: "",
        postal_code: "",
        country: "",
        is_default: false,
      },
      isEditing: false, // Xác định modal đang ở trạng thái thêm hay sửa
    };
  },
  computed: {
    items() {
      return this.$store.state.cart.cartItems;
    },
    total() {
      return this.items.reduce((acc, item) => {
        const price = item.product_variants[0]?.variants[0]?.price || 0;
        return acc + price * item.quantity;
      }, 0);
    },
  },
  mounted() {
    this.fetchShippingAddresses();
  },
  methods: {
    async fetchShippingAddresses() {
      const userData = localStorage.getItem("user");
      if (!userData) return;
      const parsedUser = JSON.parse(userData);
      const userId = parsedUser.user_id;
      try {
        const response = await publicRequest.post("/address/get", { user_id: userId });
        if (response.data && Array.isArray(response.data.data)) {
          this.user.addresses = response.data.data;
          if (this.user.addresses.length) {
            this.user.shippingAddress = this.user.addresses[0].id;
          }
        } else {
          this.user.addresses = [];
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
        this.$store.dispatch("notifications/addNotification", { desc: "Không lấy được địa chỉ giao hàng từ hệ thống!" });
      }
    },
    openAddModal() {
      this.isEditing = false;
      this.addressForm = {
        id: null,
        full_address: "",
        city: "",
        postal_code: "",
        country: "",
        is_default: false,
      };
      this.modalVisible = true;
    },
    openEditModal(address) {
      this.isEditing = true;
      this.addressForm = { ...address };
      this.modalVisible = true;
    },
    async handleModalOk() {
      const userData = localStorage.getItem("user");
      if (!userData) {
        this.$store.dispatch("notifications/addNotification", { desc: "Bạn cần đăng nhập!" });
        return;
      }
      const parsedUser = JSON.parse(userData);
      const userId = parsedUser.user_id;
      try {
        if (this.isEditing) {
          await publicRequest.put("/address/update", {
            id: this.addressForm.id,
            user_id: userId,
            full_address: this.addressForm.full_address,
            city: this.addressForm.city,
            postal_code: this.addressForm.postal_code,
            country: this.addressForm.country,
            is_default: this.addressForm.is_default,
          });
          this.$store.dispatch("notifications/addNotification", { desc: "Cập nhật địa chỉ thành công!" });
        } else {
          await publicRequest.post("/address/create", {
            user_id: userId,
            full_address: this.addressForm.full_address,
            city: this.addressForm.city,
            postal_code: this.addressForm.postal_code,
            country: this.addressForm.country,
            is_default: this.addressForm.is_default,
          });
          this.$store.dispatch("notifications/addNotification", { desc: "Thêm địa chỉ thành công!" });
        }
        this.modalVisible = false;
        this.fetchShippingAddresses();
      } catch (error) {
        console.error("Error saving address:", error);
        this.$store.dispatch("notifications/addNotification", { desc: "Lỗi khi lưu địa chỉ!" });
      }
    },
    handleModalCancel() {
      this.modalVisible = false;
    },
    async deleteAddress(addressId) {
      const userData = localStorage.getItem("user");
      if (!userData) {
        this.$store.dispatch("notifications/addNotification", { desc: "Bạn cần đăng nhập!" });
        return;
      }
      const parsedUser = JSON.parse(userData);
      const userId = parsedUser.user_id;
      try {
        await publicRequest.delete("/address/delete", {
          data: { id: addressId, user_id: userId },
        });
        this.$store.dispatch("notifications/addNotification", { desc: "Xoá địa chỉ thành công!" });
        this.fetchShippingAddresses();
      } catch (error) {
        console.error("Error deleting address:", error);
        this.$store.dispatch("notifications/addNotification", { desc: "Xoá địa chỉ thất bại!" });
      }
    },
    async checkout() {
      const userData = localStorage.getItem("user");
      if (!userData) {
        this.$store.dispatch("notifications/addNotification", { desc: "Vui lòng đăng nhập để đặt hàng!" });
        return;
      }
      const parsedUser = JSON.parse(userData);
      const userId = parsedUser.user_id;
      if (!this.user.name || !this.user.phone) {
        this.$store.dispatch("notifications/addNotification", { desc: "Vui lòng nhập đầy đủ thông tin người nhận (Họ tên và SĐT)!" });
        return;
      }
      try {
        const response = await publicRequest.post("/order/create", {
          user_id: userId,
          recipient_name: this.user.name,
          recipient_phone: this.user.phone,
          shipping_address_id: this.user.shippingAddress,
        });
        const orderId = response.data.data?.order_id;
        if (!orderId) {
          console.error("order_id bị undefined! API trả về:", response.data);
          this.$store.dispatch("notifications/addNotification", { desc: "Đặt hàng thất bại, vui lòng thử lại!" });
          return;
        }
        this.$store.dispatch("cart/resetCart");
        this.$store.dispatch("notifications/addNotification", { desc: `🎉 Đặt hàng thành công! Mã đơn hàng: #${orderId}` });
        // Sau 3 giây chuyển trang
        setTimeout(() => {
          this.$router.push(`/receipt/${orderId}`);
        }, 3000);
      } catch (error) {
        console.error("Lỗi khi đặt hàng:", error.response?.data?.message || error.message);
        this.$store.dispatch("notifications/addNotification", { desc: "Có lỗi xảy ra khi đặt hàng: " + (error.response?.data?.message || error.message) });
      }
    },
  },
};
</script>

<style scoped>
.product-name {
  max-width: 130px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  vertical-align: middle;
}
</style>
