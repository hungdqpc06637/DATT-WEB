<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Quản lý người dùng</h1>

    <!-- Nút thêm người dùng -->
    <a-button type="primary" size="large" @click="openAddUserModal">Thêm Người Dùng</a-button>

    <!-- Bảng danh sách người dùng -->
    <a-table :dataSource="users" :columns="columns" rowKey="id" class="mt-4 custom-table"
      :pagination="{ position: ['bottomCenter'] }" bordered>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'actions'">
          <a-space>
            <a-button class="btn-update" type="primary" size="large" @click="editUser(record)">Sửa</a-button>
            <a-button class="btn-delete" type="primary" danger size="large" @click="deleteUser(record.id)">Xóa</a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>


<script setup>
import { ref } from "vue";
import { message } from "ant-design-vue";

// Danh sách người dùng
const users = ref([
  { id: 1, name: "Nguyễn Văn A", email: "a@gmail.com", role: "Admin" },
  { id: 2, name: "Trần Thị B", email: "b@gmail.com", role: "User" }
]);

// Cấu trúc cột của bảng
const columns = [
  { title: "ID", dataIndex: "id", key: "id", align: "center" },
  { title: "Tên", dataIndex: "name", key: "name", align: "center" },
  { title: "Email", dataIndex: "email", key: "email", align: "center" },
  { title: "Vai trò", dataIndex: "role", key: "role", align: "center" },
  { title: "Hành động", dataIndex: "actions", key: "actions", align: "center" }
];


// Mở modal thêm người dùng
const openAddUserModal = () => {
  message.info("Mở modal thêm người dùng");
};

// Chỉnh sửa thông tin người dùng
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
}

.custom-table .ant-table-tbody>tr>td {
  text-align: center;
  font-size: 14px;
  padding: 10px;
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

/* Nút Hủy */
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
</style>