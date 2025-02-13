<template>
    <div class="p-4">
        <h1 class="text-2xl font-bold mb-4">Quản lý sản phẩm</h1>

        <!-- Nút thêm sản phẩm -->
        <a-button type="primary" @click="openAddProductModal">Thêm Sản Phẩm</a-button>

        <!-- Bảng sản phẩm -->
        <a-table :dataSource="products" :columns="columns" rowKey="id" class="mt-4"
            :pagination="{ position: ['bottomCenter'] }">

            <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'actions'">
                    <a-button size="small" class="mr-2" @click="editProduct(record)">Sửa</a-button>
                    <a-button size="small" danger @click="deleteProduct(record.id)">Xóa</a-button>
                </template>
            </template>
        </a-table>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { Table, Button, message } from "ant-design-vue";
import "ant-design-vue/dist/reset.css";

// Danh sách sản phẩm
const products = ref([
    { id: 1, name: "Áo thun nam", price: 250000, stock: 10 },
    { id: 2, name: "Quần jeans nữ", price: 400000, stock: 5 }
]);

// Cấu trúc bảng
const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Tên sản phẩm", dataIndex: "name", key: "name" },
    { title: "Giá (VNĐ)", dataIndex: "price", key: "price" },
    { title: "Tồn kho", dataIndex: "stock", key: "stock" },
    { title: "Hành động", dataIndex: "actions", key: "actions" }
];

// Hàm mở modal thêm sản phẩm
const openAddProductModal = () => {
    message.info("Mở modal thêm sản phẩm");
};

// Hàm chỉnh sửa sản phẩm
const editProduct = (product) => {
    message.success(`Sửa sản phẩm: ${product.name}`);
};

// Hàm xóa sản phẩm
const deleteProduct = (id) => {
    products.value = products.value.filter((product) => product.id !== id);
    message.error("Sản phẩm đã bị xóa!");
};
</script>