<template>
    <div class="p-4">
        <h1 class="text-2xl font-bold mb-4">Quản lý sản phẩm</h1>

        <!-- Nút thêm sản phẩm -->
        <a-button type="primary" size="large" @click="openAddProductModal">Thêm Sản Phẩm</a-button>

        <!-- Bảng sản phẩm -->
        <a-table :dataSource="products" :columns="columns" rowKey="id" class="mt-4 custom-table"
            :pagination="{ position: ['bottomCenter'] }" bordered>

            <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'price'">
                    {{ formatCurrency(record.price) }}
                </template>
                <template v-if="column.dataIndex === 'actions'">
                    <a-space>
                        <a-button  class="btn-update" type="primary" size="large" @click="editProduct(record)">Sửa</a-button>
                        <a-button class="btn-delete" type="primary" danger size="large" @click="deleteProduct(record.id)">Xóa</a-button>
                    </a-space>
                </template>
            </template>
        </a-table>
    </div>
</template>


<script setup>
import { ref } from "vue";
import { message } from "ant-design-vue";

// Danh sách sản phẩm
const products = ref([
    { id: 1, name: "Áo thun nam", price: 250000, stock: 10 },
    { id: 2, name: "Quần jeans nữ", price: 400000, stock: 5 }
]);

// Cấu trúc bảng
const columns = [
    { title: "ID", dataIndex: "id", key: "id", align: "center" },
    { title: "Tên sản phẩm", dataIndex: "name", key: "name", align: "center" },
    { title: "Giá (VNĐ)", dataIndex: "price", key: "price", align: "center" },
    { title: "Tồn kho", dataIndex: "stock", key: "stock", align: "center" },
    { title: "Hành động", dataIndex: "actions", key: "actions", align: "center" }
];

// Format tiền tệ
const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
};

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


<style>
.custom-table .ant-table-thead>tr>th {
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