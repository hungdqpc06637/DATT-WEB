<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4 text-white">QUẢN LÝ NGƯỜI DÙNG</h1>

    <a-button class="btn-add-product" size="large" @click="openAddUserModal">Thêm Người Dùng</a-button>

    <a-table :dataSource="users" :columns="columns" rowKey="id" class="mt-4 custom-table"
      :pagination="{ position: ['bottomCenter'] }" bordered>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'actions'">
          <a-space>
            <a-button class="btn-update" size="large" @click="editUser(record)">Sửa</a-button>
            <a-button class="btn-delete" type="primary" danger size="large"
              @click="deleteUser(record.id)">Xóa</a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { message } from "ant-design-vue";

const users = ref([
  { id: 1, name: "Nguyễn Văn A", email: "a@gmail.com", role: "Admin" },
  { id: 2, name: "Trần Thị B", email: "b@gmail.com", role: "User" }
]);

const columns = [
  { title: "ID", dataIndex: "id", key: "id", align: "center" },
  { title: "Tên", dataIndex: "name", key: "name", align: "center" },
  { title: "Email", dataIndex: "email", key: "email", align: "center" },
  { title: "Vai trò", dataIndex: "role", key: "role", align: "center" },
  { title: "Hành động", dataIndex: "actions", key: "actions", align: "center" }
];

const openAddUserModal = () => {
  message.info("Mở modal thêm người dùng");
};

const editUser = (user) => {
  message.success(`Sửa thông tin của ${user.name}`);
};

// Xóa người dùng
const deleteUser = (id) => {
  users.value = users.value.filter(user => user.id !== id);
  message.error("Người dùng đã bị xóa!");
};
</script>

<style>
.custom-table .ant-table-thead>tr>th {
  background-color: #201f1f !important;
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

.btn-update {
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: white;
  font-weight: bold;
  border: none;
  transition: all 0.1s ease-in-out;
}

.btn-update:hover {
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


.add-product-container {
  margin: 20px 0;
}

/* Button cơ bản với gradient và border-radius */
.btn-add-product {
  background: linear-gradient(135deg, #6a5acd, #483d8b);
  border: none;
  color: #fff;
  font-weight: bold;
  font-size: 18px;
  padding: 12px 24px;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* Glow animation */
@keyframes glowing {
  0% {
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.2),
      0 0 10px rgba(255, 255, 255, 0.2);
  }

  50% {
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.6),
      0 0 40px rgba(255, 255, 255, 0.6);
  }

  100% {
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.2),
      0 0 10px rgba(255, 255, 255, 0.2);
  }
}

.btn-add-product {
  animation: glowing 2s infinite ease-in-out;
}

/* Ripple effect sử dụng pseudo-element */
.btn-add-product::after {
  content: "";
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  opacity: 0.6;
  background-color: rgba(255, 255, 255, 0.4);
  transition: transform 0.5s, opacity 0.5s;
}

.btn-add-product:active::after {
  transform: scale(2);
  opacity: 0;
  transition: 0s;
}

/* Hover và active effect */
.btn-add-product:hover {
  transform: scale(1.08);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.6),
    0 0 40px rgba(255, 255, 255, 0.4);
}

.btn-add-product:active {
  transform: scale(0.98);
}
</style>
