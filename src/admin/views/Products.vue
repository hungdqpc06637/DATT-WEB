<template>
    <div class="p-4">
        <h1 class="text-2xl font-bold mb-4 text-white">Quản lý sản phẩm</h1>
        <a-button type="primary" size="large" @click="openAddProductModal">Thêm Sản Phẩm</a-button>
        <a-table :dataSource="products" :columns="columns" rowKey="id" class="mt-4 custom-table"
            :pagination="{ position: ['bottomCenter'] }" bordered>
            <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'price'">
                    {{ formatCurrency(record.price) }}
                </template>
                <template v-if="column.dataIndex === 'actions'">
                    <a-space>
                        <a-button class="btn-update" type="primary" size="large"
                            @click="editProduct(record)">Sửa</a-button>
                        <a-button class="btn-delete" type="primary" danger size="large"
                            @click="deleteProduct(record.id)">Xóa</a-button>
                    </a-space>
                </template>
            </template>
        </a-table>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { message } from "ant-design-vue";

const products = ref([
    { id: 1, name: "Áo thun nam", price: 250000, stock: 10 },
    { id: 2, name: "Quần jeans nữ", price: 400000, stock: 5 }
]);

const columns = [
    { title: "ID", dataIndex: "id", key: "id", align: "center" },
    { title: "Tên sản phẩm", dataIndex: "name", key: "name", align: "center" },
    { title: "Giá (VNĐ)", dataIndex: "price", key: "price", align: "center" },
    { title: "Tồn kho", dataIndex: "stock", key: "stock", align: "center" },
    { title: "Hành động", dataIndex: "actions", key: "actions", align: "center" }
];

const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
};

const openAddProductModal = () => {
    message.info("Mở modal thêm sản phẩm");
};

const editProduct = (product) => {
    message.success(`Sửa sản phẩm: ${product.name}`);
};

const deleteProduct = (id) => {
    products.value = products.value.filter((product) => product.id !== id);
    message.error("Sản phẩm đã bị xóa!");
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
</style>