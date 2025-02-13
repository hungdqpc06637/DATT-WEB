<template>
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-4">Quản lý đơn hàng</h1>
  
      <!-- Bảng danh sách đơn hàng -->
      <a-table 
        :dataSource="orders" 
        :columns="columns" 
        rowKey="id" 
        class="mt-4"
        :pagination="{ position: ['bottomCenter'] }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'actions'">
            <a-button size="small" @click="viewOrder(record)" class="mr-2">Xem</a-button>
            <a-button size="small" danger @click="deleteOrder(record.id)">Hủy</a-button>
          </template>
        </template>
      </a-table>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { message } from "ant-design-vue";
  
  // Danh sách đơn hàng (giả lập nhiều dữ liệu để phân trang hoạt động)
  const orders = ref(
    Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      customer: `Khách hàng ${i + 1}`,
      total: Math.floor(Math.random() * 5000000) + 500000,
      status: i % 2 === 0 ? "Chờ xử lý" : "Hoàn thành"
    }))
  );
  
  // Cấu trúc cột của bảng
  const columns = [
    { title: "ID", dataIndex: "id", key: "id", align: "center" },
    { title: "Khách hàng", dataIndex: "customer", key: "customer", align: "center" },
    { title: "Tổng tiền", dataIndex: "total", key: "total", align: "center", customRender: ({ text }) => `${text} VNĐ` },
    { title: "Trạng thái", dataIndex: "status", key: "status", align: "center" },
    { title: "Hành động", dataIndex: "actions", key: "actions", align: "center" }
  ];
  
  // Xem chi tiết đơn hàng
  const viewOrder = (order) => {
    message.info(`Xem chi tiết đơn hàng ID: ${order.id}`);
  };
  
  // Hủy đơn hàng
  const deleteOrder = (id) => {
    orders.value = orders.value.filter(order => order.id !== id);
    message.error(`Đơn hàng ID ${id} đã bị hủy!`);
  };
  </script>
  