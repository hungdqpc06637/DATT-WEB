<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4 text-white">QUẢN LÝ ĐƠN HÀNG</h1>

    <!-- Bảng danh sách đơn hàng -->
    <a-table :dataSource="orders" :columns="columns" rowKey="id" class="custom-table"
      :pagination="{ position: ['bottomCenter'] }" bordered>
      <template #bodyCell="{ column, record }">
        <!-- Format tiền tệ -->
        <template v-if="column.dataIndex === 'total'">
          {{ formatCurrency(record.total) }}
        </template>

        <!-- Hiển thị trạng thái -->
        <template v-if="column.dataIndex === 'status'">
          <a-tag :color="getStatusColor(record.status)">
            {{ record.status }}
          </a-tag>
        </template>

        <!-- Nút hành động -->
        <template v-if="column.dataIndex === 'actions'">
          <a-space>
            <a-button class="btn-view" @click="openOrderModal(record)">👁 Xem</a-button>
            <a-button class="btn-delete" @click="deleteOrder(record.id)">❌ Hủy</a-button>
          </a-space>
        </template>
      </template>
    </a-table>

    <!-- Modal chi tiết đơn hàng -->
    <a-modal v-model:visible="isOrderModalVisible" @cancel="handleOrderModalCancel" :footer="null" class="glass-modal"
      width="1000px">
      <template #title>
        <div v-draggable>Chi tiết đơn hàng ID: {{ selectedOrder?.id || '' }}</div>
      </template>

      <div v-if="selectedOrder" class="order-details-container">
        <!-- Cột 60%: Thông tin đơn hàng -->
        <div class="order-info">
          <p><strong>Khách hàng:</strong> {{ selectedOrder.customer }}</p>
          <p><strong>Địa chỉ:</strong> {{ selectedOrder.address }}</p>
          <p><strong>Tên người nhận:</strong> {{ selectedOrder.recipient }}</p>
          <p><strong>Số điện thoại:</strong> {{ selectedOrder.phone }}</p>
          <p><strong>Tổng tiền:</strong> {{ formatCurrency(selectedOrder.total) }}</p>
          <p>
            <strong>Trạng thái hiện tại:</strong>
            <a-tag :color="getStatusColor(selectedOrder.status)">
              {{ selectedOrder.status }}
            </a-tag>
          </p>
          <!-- Phần cập nhật trạng thái -->
          <p><strong>Cập nhật trạng thái:</strong></p>
          <a-select v-model="newStatus" style="width: 200px" placeholder="Chọn trạng thái">
            <a-select-option value="chờ xác nhận">chờ xác nhận</a-select-option>
            <a-select-option value="đã xác nhận">đã xác nhận</a-select-option>
            <a-select-option value="đang vận chuyển">đang vận chuyển</a-select-option>
            <a-select-option value="đã giao">đã giao</a-select-option>
            <a-select-option value="hủy">hủy</a-select-option>
          </a-select>
          <a-button type="primary" style="margin-left: 8px" @click="updateOrderStatus">
            Lưu
          </a-button>

          <a-progress :percent="statusProgress[selectedOrder.status]" style="margin: 16px 0" />

          <div class="status-detail">
            <template v-if="selectedOrder.status !== 'hủy'">
              <a-steps :current="currentStep" size="small">
                <a-step v-for="(step, index) in stepsList" :key="index" :title="step" />
              </a-steps>
            </template>
            <template v-else>
              <p class="cancel-message">Đơn hàng đã bị hủy.</p>
            </template>
          </div>
        </div>

        <!-- Cột 40%: Danh sách sản phẩm -->
        <div class="product-list">
          <h3>Thông tin sản phẩm</h3>
          <div v-for="(product, index) in selectedOrder.products" :key="index" class="product-item">
            <img :src="product.image" :alt="product.name" class="product-img" @click="previewProduct(product)" />
            <div class="product-details">
              <p><strong>{{ product.name }}</strong></p>
              <p>Size: {{ product.size }}</p>
              <p>Giá: {{ formatCurrency(product.price) }}</p>
              <p>Màu: {{ product.color }}</p>
            </div>
          </div>
        </div>
      </div>
    </a-modal>

    <!-- Modal xem trước ảnh sản phẩm -->
    <a-modal v-model:visible="previewVisible" :footer="null" @cancel="previewVisible = false"
      class="glass-modal-preview" width="400px">
      <template #title>
        <div v-draggable>{{ previewTitle }}</div>
      </template>
      <img :src="previewImage" class="preview-img" @load="onPreviewImageLoad" />
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

// Dữ liệu đơn hàng demo
const orders = ref(
  Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    customer: `Khách hàng ${i + 1}`,
    total: Math.floor(Math.random() * 5000000) + 500000,
    status:
      i % 5 === 0
        ? 'chờ xác nhận'
        : i % 5 === 1
          ? 'đã xác nhận'
          : i % 5 === 2
            ? 'đang vận chuyển'
            : i % 5 === 3
              ? 'đã giao'
              : 'hủy',
    address: `Địa chỉ ${i + 1}`,
    recipient: `Người nhận ${i + 1}`,
    phone: `090${i + 1}`,
    products: Array.from({ length: (i % 3) + 1 }, (_, j) => ({
      image: '/images/Áo phông trắng xanh.jpg', // Ảnh sản phẩm kích thước mẫu 150px
      name: `Sản phẩm ${j + 1}`,
      size: ['S', 'M', 'L'][j % 3],
      price: Math.floor(Math.random() * 1000000) + 100000,
      color: j % 2 === 0 ? 'Đỏ' : 'Xanh'
    }))
  }))
)

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', align: 'center' },
  { title: 'Khách hàng', dataIndex: 'customer', key: 'customer', align: 'center' },
  { title: 'Tổng tiền', dataIndex: 'total', key: 'total', align: 'center' },
  { title: 'Trạng thái', dataIndex: 'status', key: 'status', align: 'center' },
  { title: 'Hành động', dataIndex: 'actions', key: 'actions', align: 'center' }
]

const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value)

const isOrderModalVisible = ref(false)
const selectedOrder = ref(null)
const newStatus = ref('')

const openOrderModal = (order) => {
  selectedOrder.value = { ...order }
  newStatus.value = order.status
  isOrderModalVisible.value = true
}

const handleOrderModalCancel = () => {
  isOrderModalVisible.value = false
  selectedOrder.value = null
}

const deleteOrder = (id) => {
  orders.value = orders.value.filter(order => order.id !== id)
  message.error(`Đơn hàng ID ${id} đã bị hủy!`)
}

// Cập nhật trạng thái đơn hàng
const updateOrderStatus = () => {
  if (!selectedOrder.value) return
  // Cập nhật trạng thái trong selectedOrder
  selectedOrder.value.status = newStatus.value
  // Cập nhật lại trong mảng orders
  const index = orders.value.findIndex(o => o.id === selectedOrder.value.id)
  if (index !== -1) {
    orders.value[index].status = newStatus.value
  }
  message.success(`Cập nhật trạng thái thành công!`)
}

const statusProgress = {
  'chờ xác nhận': 20,
  'đã xác nhận': 40,
  'đang vận chuyển': 60,
  'đã giao': 100,
  'hủy': 0
}

const stepsList = ['chờ xác nhận', 'đã xác nhận', 'đang vận chuyển', 'đã giao']

const currentStep = computed(() => {
  if (!selectedOrder.value) return 0
  const index = stepsList.indexOf(selectedOrder.value.status)
  return index >= 0 ? index : 0
})

const getStatusColor = (status) => {
  switch (status) {
    case 'chờ xác nhận': return 'blue'
    case 'đã xác nhận': return 'cyan'
    case 'đang vận chuyển': return 'orange'
    case 'đã giao': return 'green'
    case 'hủy': return 'red'
    default: return 'default'
  }
}

// Preview Modal cho sản phẩm
const previewVisible = ref(false)
const previewImage = ref('')
const previewTitle = ref('')
const imageDimensions = ref({ width: 0, height: 0 })
const previewFileSize = ref(0)

const previewProduct = (product) => {
  previewImage.value = product.image
  previewTitle.value = product.name
  previewVisible.value = true
}

const onPreviewImageLoad = (e) => {
  imageDimensions.value = {
    width: e.target.naturalWidth,
    height: e.target.naturalHeight
  }
}

const formatFileSize = (size) => {
  if (size < 1024) return size + ' B'
  else if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB'
  else return (size / (1024 * 1024)).toFixed(2) + ' MB'
}
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

.title {
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.btn-view,
.btn-delete {
  font-weight: bold;
  border: none;
  transition: all 0.1s ease-in-out;
}

.btn-view {
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: white;
}

.btn-view:hover {
  background: linear-gradient(135deg, #4338ca, #4f46e5);
  transform: scale(1.05);
  box-shadow: 0 4px 10px rgba(79, 70, 229, 0.4);
}

.btn-delete {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.btn-delete:hover {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  transform: scale(1.05);
  box-shadow: 0 4px 10px rgba(239, 68, 68, 0.4);
}

.glass-modal .ant-modal-body,
.order-details-container,
.order-info,
.product-list {
  color: white;
}

.order-details-container {
  display: flex;
  gap: 16px;
}

.order-info {
  flex: 6;
}

.product-list {
  flex: 4;
  background: rgba(255, 255, 255, 0.1);
  padding: 12px;
  border-radius: 8px;
}

.product-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.product-img {
  width: 100px;
  height: auto;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s;
}

.product-img:hover {
  transform: scale(1.05);
}

.cancel-message {
  color: red;
  font-weight: bold;
}

.preview-img {
  max-width: 100%;
  border-radius: 8px;
}
</style>
