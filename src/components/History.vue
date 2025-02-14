<template>
  <Spinner v-if="isHistoryLoading"/>
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
      <tr v-for="(order, index) in getItems">
        <td><router-link :to="'/receipt/' + order._id">#{{order.index}}</router-link></td>
        <td>{{ new Date(order.createdAt).toLocaleString() }}</td>
        <td>{{ order.total }}₫</td>
        <td v-if="order.status == 'Pending'"><label class="bg-secondary text-white rounded px-3">Chờ xử lý</label></td>
        <td v-if="order.status == 'Delivering'"><label class="bg-warning rounded px-3">Đang giao</label></td>
        <td v-if="order.status == 'Delivered'"><label class="bg-success text-white rounded px-3">Đã giao</label></td>
      </tr>
    </tbody>
  </table>
  <paginate
    v-if="!isHistoryLoading"
    :page-count="Math.ceil(orders.length/itemsPerPage)"
    :page-range="3"
    :margin-pages="2"
    :click-handler="clickCallback"
    :prev-text="'Trước'"
    :next-text="'Tiếp'"
    :container-class="'pagination'"
    :page-class="'page-item'"
  />
</template>

<script>
import Spinner from '../components/Spinner.vue';
import Paginate from 'vuejs-paginate-next';
import { userRequest } from '../requestMethod.js';

export default {
  props: {
    userId: {
      type: String,
      default: {}
    }
  },
  components: {
    Spinner,
    Paginate
  },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 10,
      orders: [],
      isHistoryLoading: true,
    }
  },
  mounted() {
    if (!this.userId) {
      return;
    }

    var token = this.$store.getters.getToken;
    userRequest(token).get('/orders/find/' + this.userId)
      .then(res => {
        this.orders = res.data;

        // Sắp xếp đơn hàng theo ngày giảm dần
        this.orders.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        // Thêm chỉ mục đơn hàng
        this.orders.forEach((order, index, arr) => {
          order.index = arr.length - index;
        });

        this.isHistoryLoading = false;
      })
      .catch(err => {
        console.log(err);
        this.$store.dispatch('addNotification', "Lỗi tải đơn hàng: " + err.message);
      });
  },
  computed: {
    getItems: function () {
      let current = this.currentPage * this.itemsPerPage;
      let start = current - this.itemsPerPage;
      return this.orders.slice(start, current);
    }
  },
  methods: {
    clickCallback(pageNum) {
      this.currentPage = Number(pageNum);
    }
  },
}
</script>

<style scoped>
.pagination {
  cursor: pointer;
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
