<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4 text-white">Quản lý đơn hàng</h1>

    <!-- Bảng danh sách đơn hàng -->
    <a-table :dataSource="orders" :columns="columns" rowKey="id" class="mt-4 custom-table"
      :pagination="{ position: ['bottomCenter'] }" bordered>
      <template #bodyCell="{ column, record }">
        <!-- Format tiền tệ -->
        <template v-if="column.dataIndex === 'total'">
          {{ formatCurrency(record.total) }}
        </template>

        <!-- Màu sắc trạng thái -->
        <template v-if="column.dataIndex === 'status'">
          <a-tag :color="record.status === 'Hoàn thành' ? 'green' : 'orange'">
            {{ record.status }}
          </a-tag>
        </template>

        <!-- Nút hành động -->
        <template v-if="column.dataIndex === 'actions'">
          <a-space>
            <a-button class="btn-view" @click="viewOrder(record)">👁 Xem</a-button>
            <a-button class="btn-delete" @click="deleteOrder(record.id)">❌ Hủy</a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { message } from "ant-design-vue";

const orders = ref(
  Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    customer: `Khách hàng ${i + 1}`,
    total: Math.floor(Math.random() * 5000000) + 500000,
    status: i % 2 === 0 ? "Chờ xử lý" : "Hoàn thành"
  }))
);

const columns = [
  { title: "ID", dataIndex: "id", key: "id", align: "center" },
  { title: "Khách hàng", dataIndex: "customer", key: "customer", align: "center" },
  { title: "Tổng tiền", dataIndex: "total", key: "total", align: "center" },
  { title: "Trạng thái", dataIndex: "status", key: "status", align: "center" },
  { title: "Hành động", dataIndex: "actions", key: "actions", align: "center" }
];

const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
};

const viewOrder = (order) => {
  message.info(`Xem chi tiết đơn hàng ID: ${order.id}`);
};

const deleteOrder = (id) => {
  orders.value = orders.value.filter(order => order.id !== id);
  message.error(`Đơn hàng ID ${id} đã bị hủy!`);
};
</script>

<style>
.custom-table .ant-table-thead>tr>th {
  background-color: #1e293b;
  color: white !important;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 16px;
  padding: 12px;
  border-bottom: 2px solid #334155;
}

.custom-table .ant-table-tbody>tr>td {
  background-color: transparent;
  color: #000000;
  text-align: center;
  font-size: 14px;
  padding: 10px;
  border-bottom: 1px solid #334155;
}

h1 {
  color: white;
}

.btn-view {
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: white;
  font-weight: bold;
  border: none;
  transition: all 0.1s ease-in-out;
}

.btn-view:hover {
  background: linear-gradient(135deg, #4338ca, #4f46e5);
  transform: scale(1.05);
  box-shadow: 0px 4px 10px rgba(79, 70, 229, 0.4);
}

.btn-delete {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  font-weight: bold;
  border: none;
  transition: all 0.1s ease-in-out;
}

.btn-delete:hover {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  transform: scale(1.05);
  box-shadow: 0px 4px 10px rgba(239, 68, 68, 0.4);
}

.custom-table .ant-pagination {
  background: transparent !important;
  border: none !important;
  margin-top: 16px;
}

.custom-table .ant-pagination-prev .anticon,
.custom-table .ant-pagination-next .anticon {
  color: white !important;
  fill: white !important;
}

.custom-table .ant-pagination-item {
  background: transparent !important;
  border: 1px solid #fff !important;
  color: white !important;
}

.custom-table .ant-pagination-item-active {
  background-color: #4f46e5 !important;
  border-color: #4f46e5 !important;
  color: white !important;
}

.custom-table .ant-pagination-prev,
.custom-table .ant-pagination-next {
  background: transparent !important;
  border: 1px solid #fff !important;
  border-radius: 2px !important;
  margin: 0 4px !important;
}

.custom-table .ant-pagination-prev a,
.custom-table .ant-pagination-next a {
  color: white !important;
  display: inline-block;
  padding: 4px 8px !important;
}

.custom-table .ant-pagination-prev:hover,
.custom-table .ant-pagination-next:hover {
  background-color: #4f46e5 !important;
  border-color: #4f46e5 !important;
}

.custom-table .ant-pagination-item:hover {
  border-color: #4f46e5 !important;
  color: #4f46e5 !important;
}
</style>
