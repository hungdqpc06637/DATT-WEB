<template>
  <Spinner v-if="isHistoryLoading" />
  <table class="table" v-else>
    <thead>
      <tr>
        <th>Mã đơn hàng</th>
        <th>Ngày đặt</th>
        <th>Tổng tiền</th>
        <th>Trạng thái</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(order, index) in getItems" :key="order.id">
        <td>
          <router-link :to="'/receipt/' + order.id" @click="getProductDetails(order.id)">
            #{{ order.id }}
          </router-link>
        </td>
        <td>{{ new Date(order.created_at).toLocaleString() }}</td>
        <td>{{ order.total_price }}₫</td>
        <td v-if="order.status === 'Chuẩn bị hàng'">
          <label class="bg-secondary text-white rounded px-3">Chuẩn bị hàng</label>
        </td>
        <td v-if="order.status === 'Chờ xác nhận'">
          <label class="bg-warning rounded px-3">Chờ xác nhận</label>
        </td>
        <td v-if="order.status === 'Đang giao'">
          <label class="bg-warning rounded px-3">Đang giao</label>
        </td>
        <td v-if="order.status === 'Đã giao'">
          <label class="bg-success text-white rounded px-3">Đã giao</label>
        </td>
      </tr>
    </tbody>
  </table>
  <paginate v-if="!isHistoryLoading" :page-count="Math.ceil(orders.length / itemsPerPage)" :page-range="3"
    :margin-pages="2" :click-handler="clickCallback" :prev-text="'Trước'" :next-text="'Tiếp'"
    :container-class="'pagination'" :page-class="'page-item'" />
</template>

<script>
import Spinner from '../components/Spinner.vue';
import Paginate from 'vuejs-paginate-next';
import { publicRequest } from "../requestMethod.js";

export default {
  components: {
    Spinner,
    Paginate,
  },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 10,
      orders: [],
      isHistoryLoading: true,
      userId: null, // Declare userId here
    };
  },
  mounted() {
    // Lấy user_id từ localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    this.userId = storedUser ? storedUser.user_id : null;

    if (!this.userId) {
      this.$store.dispatch('addNotification', "Không tìm thấy user_id trong localStorage");
      return;
    }

    // Thực hiện API gọi để lấy danh sách đơn hàng
    publicRequest
      .post(`/order/get`, { user_id: this.userId })
      .then((res) => {
        // Log dữ liệu trả về từ API để kiểm tra
        console.log("Dữ liệu trả về từ API:", res.data);

        // Kiểm tra xem dữ liệu trả về có phải là mảng không
        if (Array.isArray(res.data.data)) {
          this.orders = res.data.data;

          // Sắp xếp đơn hàng theo ngày giảm dần
          this.orders.sort((a, b) => {
            return new Date(b.created_at) - new Date(a.created_at);
          });

          // Thêm chỉ mục đơn hàng
          this.orders.forEach((order, index, arr) => {
            order.index = arr.length - index;
          });

          this.isHistoryLoading = false;
        } else {
          this.$store.dispatch('addNotification', "Dữ liệu đơn hàng không hợp lệ.");
          this.isHistoryLoading = false;
        }
      })
      .catch((err) => {
        console.log("Lỗi khi tải đơn hàng:", err);
        this.$store.dispatch('addNotification', "Lỗi tải đơn hàng: " + err.message);
      });
  },
  computed: {
    getItems() {
      // Cập nhật phương thức slice để đảm bảo hiển thị đúng trang
      let current = this.currentPage * this.itemsPerPage;
      let start = current - this.itemsPerPage;
      return this.orders.slice(start, current);
    },
  },
  methods: {
    clickCallback(pageNum) {
      this.currentPage = Number(pageNum);
    },
  },
};
</script>



<style scoped>
.pagination {
  cursor: pointer;
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
