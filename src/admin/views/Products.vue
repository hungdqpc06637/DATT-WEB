<template>
    <div class="p-4">
        <h1 class="text-2xl font-bold mb-4 text-white">QUẢN LÝ SẢN PHẨM</h1>
        <div class="add-product-container">
            <a-button size="large" class="btn-add-product" @click="openAddModal">
                Thêm Sản Phẩm
            </a-button>
        </div>
        <a-table :dataSource="products" :columns="columns" rowKey="id" class="mt-4 custom-table"
            :pagination="{ position: ['bottomCenter'] }" bordered>
            <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'price'">
                    {{ formatCurrency(record.price) }}
                </template>
                <template v-if="column.dataIndex === 'actions'">
                    <a-space>
                        <a-button class="btn-update" type="primary" size="large" @click="openEditModal(record)">
                            Sửa
                        </a-button>
                        <a-button class="btn-delete" type="primary" danger size="large"
                            @click="deleteProduct(record.id)">
                            Xóa
                        </a-button>
                    </a-space>
                </template>
            </template>
        </a-table>

        <a-modal v-model:visible="isModalVisible" @cancel="handleCancel" :footer="null" class="glass-modal">
            <template #title>
                <div v-draggable>{{ modalTitle }}</div>
            </template>

            <a-form layout="vertical" @finish="handleSubmit">
                <a-form-item label="Hình ảnh" name="images">
                    <a-upload v-model:file-list="fileList" list-type="picture-card" :before-upload="beforeUpload"
                        @preview="handlePreview" :multiple="true">
                        <div v-if="fileList.length < maxImages">
                            <plus-outlined />
                            <div style="margin-top: 8px">Upload</div>
                        </div>
                    </a-upload>
                </a-form-item>

                <a-row :gutter="16">
                    <a-col :span="12">
                        <a-form-item label="Danh mục" name="category"
                            :rules="[{ required: true, message: 'Vui lòng chọn danh mục' }]">
                            <a-select v-model:value="form.category" placeholder="Chọn danh mục">
                                <a-select-option value="ao">Áo</a-select-option>
                                <a-select-option value="quan">Quần</a-select-option>
                                <a-select-option value="giay">Giày</a-select-option>
                            </a-select>
                        </a-form-item>
                        <a-form-item label="Tên sản phẩm" name="name"
                            :rules="[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]">
                            <a-input v-model:value="form.name" placeholder="Nhập tên sản phẩm" />
                        </a-form-item>
                        <a-form-item label="Giá (VNĐ)" name="price"
                            :rules="[{ required: true, message: 'Vui lòng nhập giá sản phẩm' }]">
                            <a-input-number v-model:value="form.price" :min="0" style="width: 100%" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="Màu sắc" name="color">
                            <a-select v-model:value="form.color" placeholder="Chọn màu sắc">
                                <a-select-option v-for="color in colorOptions" :key="color.value" :value="color.value">
                                    <span :style="{
                                        backgroundColor: color.value,
                                        display: 'inline-block',
                                        width: '12px',
                                        height: '12px',
                                        borderRadius: '50%',
                                        marginRight: '8px'
                                    }"></span>
                                    {{ color.name }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                        <a-form-item label="Size" name="size">
                            <a-select v-model:value="form.size" placeholder="Chọn size">
                                <a-select-option value="S">S</a-select-option>
                                <a-select-option value="M">M</a-select-option>
                                <a-select-option value="L">L</a-select-option>
                                <a-select-option value="XL">XL</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                </a-row>

                <a-form-item label="Mô tả" name="description">
                    <a-textarea v-model:value="form.description" placeholder="Nhập mô tả" rows="2" />
                </a-form-item>

                <a-form-item class="glass-modal-footer">
                    <a-button type="primary" html-type="submit" class="glass-btn">
                        {{ form.id ? 'Cập nhật' : 'Thêm sản phẩm' }}
                    </a-button>
                    <a-button style="margin-left: 8px" @click="handleCancel" class="glass-btn glass-btn-danger">
                        Hủy
                    </a-button>
                </a-form-item>
            </a-form>
        </a-modal>

        <a-modal v-model:visible="previewVisible"  @cancel="previewVisible = false"
            class="glass-modal-preview" width="400px">
            <template #title>
                <div v-draggable>{{ previewTitle }}</div>
            </template>
            <img :src="previewImage" class="preview-img"  @load="handlePreview"/>
            <div class="preview-info">
                <p>{{ imageDimensions.width }} x {{ imageDimensions.height }} px</p>
                <p>{{ formatFileSize(previewFileSize) }}</p>
            </div>
        </a-modal>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'

const products = ref([
    { id: 1, name: 'Áo thun nam', price: 250000, stock: 10 },
    { id: 2, name: 'Quần jeans nữ', price: 400000, stock: 5 }
])
const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', align: 'center' },
    { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name', align: 'center' },
    { title: 'Giá (VNĐ)', dataIndex: 'price', key: 'price', align: 'center' },
    { title: 'Tồn kho', dataIndex: 'stock', key: 'stock', align: 'center' },
    { title: 'Hành động', dataIndex: 'actions', key: 'actions', align: 'center' }
]
const formatCurrency = (value) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)

const isModalVisible = ref(false)
const fileList = ref([])
const maxImages = 5
const form = ref({
    id: null,
    name: '',
    price: null,
    description: '',
    category: '',
    color: '',
    size: ''
})
const colorOptions = [
    { name: 'Đỏ', value: '#f5222d' },
    { name: 'Xanh dương', value: '#1890ff' },
    { name: 'Xanh lá', value: '#52c41a' },
    { name: 'Vàng', value: '#fadb14' },
    { name: 'Tím', value: '#722ed1' }
]

const modalTitle = computed(() => (form.value.id ? 'Sửa sản phẩm' : 'Thêm sản phẩm'))

const openAddModal = () => {
    form.value = { id: null, name: '', price: null, description: '', category: '', color: '', size: '' }
    fileList.value = []
    isModalVisible.value = true
}

const openEditModal = (record) => {
    form.value = { ...record }
    isModalVisible.value = true
}
const handleCancel = () => {
    isModalVisible.value = false
    form.value = { id: null, name: '', price: null, description: '', category: '', color: '', size: '' }
    fileList.value = []
}

const handleSubmit = () => {
    if (form.value.id) {
        const index = products.value.findIndex(p => p.id === form.value.id)
        if (index !== -1) {
            products.value[index] = { ...form.value }
            message.success('Sản phẩm đã được cập nhật!')
        }
    } else {
        const newProduct = {
            id: products.value.length + 1,
            name: form.value.name,
            price: form.value.price,
            stock: 0
        }
        products.value.push(newProduct)
        message.success('Sản phẩm đã được thêm!')
    }
    handleCancel()
}

const beforeUpload = (file) => {
    if (fileList.value.length < maxImages) {
        fileList.value.push(file)
    } else {
        message.error(`Chỉ được upload tối đa ${maxImages} ảnh!`)
    }
    return false
}
const previewVisible = ref(false)
const previewImage = ref('')
const previewTitle = ref('')
const imageDimensions = ref({ width: 0, height: 0 })
const previewFileSize = ref(0)
const handlePreview = (file) => {
    if (!file.url && !file.preview) {
        getBase64(file.originFileObj, (url) => {
            file.preview = url
            openPreview(file)
        })
    } else {
        openPreview(file)
    }
}
const getBase64 = (file, callback) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(file)
}
const openPreview = (file) => {
    previewImage.value = file.url || file.preview
    previewTitle.value = file.name
    previewFileSize.value = file.size
    const img = new Image()
    img.src = previewImage.value
    img.onload = () => {
        imageDimensions.value = { width: img.naturalWidth, height: img.naturalHeight }
        previewVisible.value = true
    }
}
const formatFileSize = (size) => {
    if (size < 1024) return size + ' B'
    else if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB'
    else return (size / (1024 * 1024)).toFixed(2) + ' MB'
}

const deleteProduct = (id) => {
    products.value = products.value.filter((product) => product.id !== id)
    message.error('Sản phẩm đã bị xóa!')
}
</script>

<style>
.glass-modal .ant-form-item-label>label,
.glass-modal-preview .ant-form-item-label>label {
    color: #fff;
}

.glass-modal .ant-modal-content {
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.3);
    padding: 0;
}

.glass-modal .ant-modal-header {
    background: transparent;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    padding: 16px;
}

.glass-modal .ant-modal-title {
    color: #fff;
    font-family: 'Roboto Mono', monospace;
    font-size: 20px;
}

.glass-modal .ant-modal-close {
    color: #fff;
}

.glass-modal .ant-modal-body {
    padding: 20px;
}

.glass-modal-footer {
    text-align: center;
    margin-top: 16px;
}

.glass-btn {
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 6px 12px;
    font-family: 'Roboto Mono', monospace;
    transition: background 0.3s;
}

.glass-btn:hover {
    background: rgba(255, 255, 255, 0.3);
}

.glass-btn.glass-btn-danger {
    background: rgba(255, 69, 0, 0.2);
}

.glass-btn.glass-btn-danger:hover {
    background: rgba(255, 69, 0, 0.3);
}

.glass-modal-preview .ant-modal-content {
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.3);
}

.glass-modal-preview .ant-modal-header {
    background: transparent;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    padding: 16px;
}

.glass-modal-preview .ant-modal-title {
    color: #fff;
    font-family: 'Roboto Mono', monospace;
    font-size: 20px;
}

.glass-modal-preview .ant-modal-close {
    color: #fff;
}

.glass-modal-preview .ant-modal-body {
    padding: 20px;
}

.preview-img {
    width: 100%;
    border-radius: 8px;
}

.preview-info {
    text-align: center;
    margin-top: 12px;
    color: #fff;
    font-family: 'Roboto Mono', monospace;
    font-size: 14px;
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