<template>
	<div class="product-container">
		<div class="product-circle" />
		<img class="product-image" :src="imageUrl" :alt="product.name || 'Sản phẩm không có tên'" />

		<!-- Thông tin sản phẩm: Luôn hiển thị tên và giá -->
		<div class="product-info">
			<router-link :to="'/product/' + product.id" class="text-dark text-decoration-none">
				<label class="product-title">{{ product.name }}</label>
			</router-link>
			<span class="product-price">
				{{ (product.base_price ?? 0).toLocaleString() }}₫
			</span>
			<div class="product-icons">
				<router-link :to="'/product/' + product.id" class="text-dark text-decoration-none">
					<div class="product-icon">
						<i class="bi bi-eye"></i>
					</div>
				</router-link>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";

const props = defineProps({
	product: {
		type: Object,
		required: true
	},
	image_url: String
});
// 🖼️ Xử lý hình ảnh sản phẩm
const imageUrl = computed(() => {
	return props.image_url ? `/images/${props.image_url}` : "/images/default-image.jpg";
});

</script>



<style scoped>
.product-container {
	flex: 1;
	margin: 5px;
	min-width: 250px;
	height: 280px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	position: relative;
	border-radius: 10px;
	overflow: hidden;
	padding-bottom: 10px;
}

/* Hình ảnh luôn nằm gọn trong khung */
.product-image {
	width: 100%;
	height: 180px;
	/* Điều chỉnh chiều cao */
	object-fit: contain;
	/* Giữ nguyên tỷ lệ ảnh, không bị cắt */
	border-radius: 10px;
	z-index: 2;
	background-color: white;
	/* Đảm bảo ảnh có nền đồng bộ */
}

/* Thông tin sản phẩm (Tên + Giá) */
.product-info {
	width: 100%;
	text-align: center;
	padding: 10px;
	z-index: 3;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

/* Tên sản phẩm */
.product-title {
	color: #333;
	background-color: rgba(255, 255, 255, 0.9);
	text-align: center;
	border-radius: 5px;
	padding: 5px;
	font-size: 16px;
	font-weight: bold;
	max-width: 90%;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}

/* Giá sản phẩm */
.product-price {
	color: #e74c3c;
	font-size: 14px;
	font-weight: bold;
	margin-top: 5px;
}

/* Mặc định ẨN icon */
.product-icons {
	display: flex;
	opacity: 0;
	transition: opacity 0.3s ease-in-out;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}

/* Khi hover vào ảnh, hiện icon */
.product-container:hover .product-icons {
	opacity: 1;
}

/* Style icon */
.product-icon {
	width: 40px;
	height: 40px;
	border-radius: 50%;
	background-color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 10px;
	transition: all 0.5s ease;
}

.product-icon:hover {
	background-color: #f7d8a7;
	transform: scale(1.1);
}
</style>
