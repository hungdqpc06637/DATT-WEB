<template>
  <div class="container my-5 min-vh-100">
    <div class="row g-5">
      <!-- Giỏ hàng của bạn -->
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
              {{ (item.product_variants[0]?.variants[0].price * item.quantity).toLocaleString() }} VNĐ
            </span>
          </li>
          <li class="list-group-item d-flex justify-content-between">
            <span><strong>Tổng tiền hàng</strong></span>
            <strong>{{ total.toLocaleString() }} VNĐ</strong>
          </li>
          <li class="list-group-item d-flex justify-content-between">
            <span><strong>Phí vận chuyển</strong></span>
            <strong>{{ shippingFee.toLocaleString() }} VNĐ</strong>
          </li>
          <!-- Hiển thị danh sách dịch vụ nếu có -->
          <li class="list-group-item" v-if="shippingServices.length">
            <label for="shippingService" class="form-label"><strong>Dịch vụ vận chuyển</strong></label>
            <select id="shippingService" class="form-select" v-model="selectedService">
              <option v-for="service in shippingServices" :key="service.service_id" :value="service">
                {{ formatShippingService(service) }}
              </option>
            </select>
          </li>
        </ul>
        <!-- Nếu muốn ẩn nút, bạn có thể xóa dòng dưới -->
        <!-- <button class="btn btn-outline-primary w-100" @click="calculateShippingFee">
          Tính phí vận chuyển
        </button> -->
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
                    {{ address.full_address }}
                    <span v-if="address.is_default" class="badge bg-info text-dark ms-1">Mặc định</span>
                  </label>
                  <button type="button" class="btn btn-sm btn-dark ms-2" @click.prevent="deleteAddress(address.id)">
                    Xoá
                  </button>
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

    <!-- Modal cho form thêm/sửa địa chỉ -->
    <a-modal v-model:open="modalVisible" centered @ok="handleModalOk" @cancel="handleModalCancel">
      <template #title>
        <div>Thông tin địa chỉ</div>
      </template>
      <a-form layout="vertical">
        <!-- Chọn Tỉnh / Thành phố -->
        <a-form-item label="Tỉnh / Thành phố">
          <a-select v-model:value="addressForm.ghn_province_id" @change="handleProvinceChange($event)">
            <a-select-option v-for="prov in provinces" :key="prov.ProvinceID" :value="prov.ProvinceID">
              {{ prov.ProvinceName }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <!-- Chọn Quận / Huyện -->
        <a-form-item label="Quận / Huyện">
          <a-select v-model:value="addressForm.ghn_district_id" @change="handleDistrictChange($event)">
            <a-select-option v-for="district in districts" :key="district.DistrictID" :value="district.DistrictID">
              {{ district.DistrictName }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <!-- Chọn Phường / Xã -->
        <a-form-item label="Phường / Xã">
          <a-select v-model:value="addressForm.ghn_ward_code" @change="handleWardChange($event)">
            <a-select-option v-for="ward in wards" :key="ward.WardCode" :value="ward.WardCode">
              {{ ward.WardName }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <!-- Mã bưu điện -->
        <a-form-item label="Mã bưu điện">
          <a-input v-model:value="addressForm.postal_code" />
        </a-form-item>

        <!-- Đặt làm mặc định -->
        <a-form-item label="Đặt làm mặc định">
          <a-switch v-model:checked="addressForm.is_default" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { publicRequest } from "../requestMethod.js";
import ghnRequest from "../ghnRequest.js";
const GHN_SHOP_ID = import.meta.env.VITE_GHN_SHOP_ID;

export default {
  name: "Checkout",
  data() {
    return {
      couponCode: "",
      noteInput: "",
      user: {
        name: "",
        phone: "",
        addresses: [],
        shippingAddress: null,
      },
      methodInput: "Thanh toán khi nhận hàng",
      modalVisible: false,
      shippingFee: 0,
      // Danh sách dịch vụ vận chuyển lấy từ GHN
      shippingServices: [],
      // Lưu đối tượng dịch vụ được chọn (chứa service_id & service_type_id)
      selectedService: null,
      // Dữ liệu form địa chỉ (các trường chứa id từ API GHN)
      addressForm: {
        id: null,
        ghn_province_id: null,
        ghn_district_id: null,
        ghn_ward_code: null,
        postal_code: "",
        is_default: false,
      },
      isEditing: false,
      // Danh sách tỉnh/quận/phường
      provinces: [],
      districts: [],
      wards: [],
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
    grandTotal() {
      return this.total + this.shippingFee;
    },
  },
  mounted() {
    this.fetchShippingAddresses();
  },
  // Watcher để tự động cập nhật phí và dịch vụ khi địa chỉ giao hàng thay đổi
  watch: {
    "user.shippingAddress"(newVal, oldVal) {
      if (newVal) {
        this.calculateShippingFee();
      }
    },
  },
  methods: {
    // Hàm lấy danh sách tỉnh từ API GHN
    async loadProvinces() {
      try {
        const response = await ghnRequest.get("/master-data/province");
        if (response.data && response.data.data) {
          this.provinces = response.data.data;
        } else {
          console.error("Không có data province. Response:", response.data);
        }
      } catch (error) {
        console.error("Lỗi tải tỉnh/thành:", error);
      }
    },
    async handleProvinceChange(selectedProvinceId) {
      try {
        const response = await ghnRequest.post("/master-data/district", { province_id: selectedProvinceId });
        this.districts = response.data.data;
        this.addressForm.ghn_district_id = null;
        this.addressForm.ghn_ward_code = null;
        this.wards = [];
      } catch (error) {
        console.error("Lỗi tải quận/huyện:", error);
      }
    },
    async handleDistrictChange(selectedDistrictId) {
      try {
        const response = await ghnRequest.post("/master-data/ward", { district_id: selectedDistrictId });
        this.wards = response.data.data;
        this.addressForm.ghn_ward_code = null;
      } catch (error) {
        console.error("Lỗi tải phường/xã:", error);
      }
    },
    handleWardChange(selectedWardCode) {
      const selectedWard = this.wards.find((w) => w.WardCode === selectedWardCode);
      if (selectedWard) {
        this.addressForm.postal_code = selectedWard.PostCode || "";
      }
    },
    openAddModal() {
      this.isEditing = false;
      this.addressForm = { id: null, ghn_province_id: null, ghn_district_id: null, ghn_ward_code: null, postal_code: "", is_default: false };
      this.modalVisible = true;
      this.loadProvinces();
      this.districts = [];
      this.wards = [];
    },
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
          await this.mapAddressNames();
        } else {
          this.user.addresses = [];
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
        this.$store.dispatch("notifications/addNotification", { desc: "Không lấy được địa chỉ giao hàng từ hệ thống!" });
      }
    },
    async mapAddressNames() {
      if (this.provinces.length === 0) {
        await this.loadProvinces();
      }
      for (let address of this.user.addresses) {
        let provinceName = "", districtName = "", wardName = "";
        if (address.province) {
          const prov = this.provinces.find((p) => p.ProvinceID.toString() === address.province);
          if (prov) {
            provinceName = prov.ProvinceName;
            try {
              const districtRes = await ghnRequest.post("/master-data/district", { province_id: prov.ProvinceID });
              const districts = districtRes.data.data;
              if (address.district) {
                const dist = districts.find((d) => d.DistrictID.toString() === address.district);
                if (dist) {
                  districtName = dist.DistrictName;
                  try {
                    const wardRes = await ghnRequest.post("/master-data/ward", { district_id: dist.DistrictID });
                    const wards = wardRes.data.data;
                    if (address.ward) {
                      const wardObj = wards.find((w) => w.WardCode.toString() === address.ward);
                      if (wardObj) {
                        wardName = wardObj.WardName;
                      }
                    }
                  } catch (errWard) {
                    console.error("Lỗi tải phường/xã:", errWard);
                  }
                }
              }
            } catch (errDistrict) {
              console.error("Lỗi tải quận/huyện:", errDistrict);
            }
          }
        }
        address.full_address = `${wardName}, ${districtName}, ${provinceName}`;
      }
    },
    openEditModal(address) {
      this.isEditing = true;
      this.addressForm = {
        id: address.id,
        ghn_province_id: address.province || null,
        ghn_district_id: address.district || null,
        ghn_ward_code: address.ward || null,
        postal_code: address.postal_code || "",
        is_default: address.is_default || false,
      };
      this.modalVisible = true;
      this.loadProvinces();
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
        const payload = {
          id: this.addressForm.id,
          user_id: userId,
          province: this.addressForm.ghn_province_id ? this.addressForm.ghn_province_id.toString() : "",
          district: this.addressForm.ghn_district_id ? this.addressForm.ghn_district_id.toString() : "",
          ward: this.addressForm.ghn_ward_code ? this.addressForm.ghn_ward_code.toString() : "",
          postal_code: this.addressForm.postal_code,
          is_default: this.addressForm.is_default,
        };
        if (this.isEditing) {
          await publicRequest.put("/address/update", payload);
          this.$store.dispatch("notifications/addNotification", { desc: "Cập nhật địa chỉ thành công!" });
        } else {
          await publicRequest.post("/address/create", payload);
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
        await publicRequest.delete("/address/delete", { data: { id: addressId, user_id: userId } });
        this.$store.dispatch("notifications/addNotification", { desc: "Xoá địa chỉ thành công!" });
        this.fetchShippingAddresses();
      } catch (error) {
        console.error("Error deleting address:", error);
        this.$store.dispatch("notifications/addNotification", { desc: "Xoá địa chỉ thất bại!" });
      }
    },
    async fetchShippingServices() {
      const selectedAddress = this.user.addresses.find((addr) => addr.id === this.user.shippingAddress);
      if (!selectedAddress) {
        console.error("Không tìm thấy địa chỉ giao hàng phù hợp.");
        return;
      }
      if (!selectedAddress.district) {
        console.error("Địa chỉ này chưa có district (id từ GHN).");
        return;
      }
      const payload = {
        shop_id: Number(GHN_SHOP_ID) || 0,
        from_district: 1572, // ID quận của cửa hàng
        to_district: parseInt(selectedAddress.district, 10) || 0,
      };
      try {
        const response = await ghnRequest.post("/v2/shipping-order/available-services", payload, {
          headers: { ShopId: GHN_SHOP_ID },
        });
        if (response.data && response.data.data) {
          this.shippingServices = response.data.data;
          if (!this.selectedService && this.shippingServices.length) {
            this.selectedService = this.shippingServices[0];
          }
        } else {
          console.error("GHN API không trả về danh sách dịch vụ:", response.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dịch vụ vận chuyển:", error);
      }
    },
    async calculateShippingFee() {
      const selectedAddress = this.user.addresses.find((addr) => addr.id === this.user.shippingAddress);
      if (!selectedAddress) {
        console.error("Không tìm thấy địa chỉ giao hàng phù hợp.");
        return;
      }
      if (!selectedAddress.district || !selectedAddress.ward) {
        console.error("Địa chỉ này chưa có district hoặc ward (id từ GHN).");
        return;
      }
      await this.fetchShippingServices();
      if (!this.selectedService && this.shippingServices.length) {
        this.selectedService = this.shippingServices[0];
      }
      if (!this.selectedService) {
        console.error("Không có dịch vụ vận chuyển nào được trả về từ GHN.");
        return;
      }
      if (!this.selectedService.service_type_id) {
        console.error("Đối tượng dịch vụ không có service_type_id, gán giá trị mặc định.");
        this.selectedService.service_type_id = 2;
      }
      const payload = {
        shop_id: Number(GHN_SHOP_ID) || 0,
        service_id: this.selectedService.service_id,
        service_type_id: this.selectedService.service_type_id,
        insurance_value: 350000,
        coupon: "",
        from_district_id: 1572,
        to_district_id: parseInt(selectedAddress.district, 10) || 0,
        to_ward_code: selectedAddress.ward || "",
        weight: 5000,
        length: 30,
        width: 20,
        height: 10,
      };
      try {
        const response = await ghnRequest.post("/v2/shipping-order/fee", payload, {
          headers: { ShopId: GHN_SHOP_ID },
        });
        if (response.data && response.data.data) {
          this.shippingFee = response.data.data.total;
          console.log("Phí vận chuyển:", this.shippingFee);
        } else {
          console.error("GHN API không trả về dữ liệu hợp lệ:", response.data);
        }
      } catch (error) {
        if (error.response) {
          console.error("Lỗi từ GHN API:", error.response.data);
        } else {
          console.error("Lỗi khi gửi request:", error);
        }
      }
    },
    // Hàm định dạng tên dịch vụ theo mẫu "Giao hàng nhanh (Tiết kiệm)" hoặc "Giao hàng nhanh (Tiêu chuẩn)"
    formatShippingService(service) {
      // Giả sử: service_type_id === 1 => "Tiết kiệm", === 2 => "Tiêu chuẩn"
      let typeName = "";
      if (service.service_type_id === 1) {
        typeName = "Tiết kiệm";
      } else if (service.service_type_id === 2) {
        typeName = "Tiêu chuẩn";
      } else {
        typeName = service.short_name || "";
      }
      return `Giao hàng nhanh (${typeName})`;
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
