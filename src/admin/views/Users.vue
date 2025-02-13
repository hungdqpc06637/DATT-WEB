<template>
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-4">Quản lý người dùng</h1>
      
      <!-- Nút thêm người dùng -->
      <a-button type="primary" @click="openAddUserModal">Thêm Người Dùng</a-button>
      
      <!-- Bảng danh sách người dùng -->
      <a-table :dataSource="users" :columns="columns" rowKey="id" class="mt-4" :pagination="{ position: ['bottomCenter'] }">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'actions'">
            <a-button size="small" @click="editUser(record)" class="mr-2">Sửa</a-button>
            <a-button size="small" danger @click="deleteUser(record.id)">Xóa</a-button>
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
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Tên", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Vai trò", dataIndex: "role", key: "role" },
    { title: "Hành động", dataIndex: "actions", key: "actions" }
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
  