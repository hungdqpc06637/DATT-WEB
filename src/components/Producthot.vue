<template>
	<div class="product-container">
		<div class="product-circle" />
		<img class="product-image" :src="imageUrl" :alt="product.name || 'Sản phẩm không có tên'" />

		<div class="product-info">
			<label class="product-title">{{ product.name }}</label>
			<div class="product-icons">
				<div class="product-icon" @click="addToCart">
					<i class="bi bi-cart-plus-fill"></i>
				</div>
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

// 🛒 Kiểm tra log dữ liệu sản phẩm
onMounted(() => {
	console.log("📦 Dữ liệu sản phẩm nhận được:", props.product, "🖼️ Ảnh sản phẩm:", props.image_url);
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
	height: 250px;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
}

.product-container:hover .product-info {
	opacity: 1;
}

.product-circle {
	width: 80px;
	height: 80px;
	border-radius: 50%;
	background-color: white;
	position: absolute;
	z-index: 1;
}

.product-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
	border-radius: 10%;
	z-index: 2;
}

.product-info {
	opacity: 0;
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	left: 0;
	z-index: 3;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	transition: all 0.5s ease;
	cursor: pointer;
	border-radius: 10px;
	padding: 10px;
}

.product-title {
	color: rgb(0, 0, 0);
	background-color: rgba(255, 255, 255, 0.8);
	text-align: center;
	border-radius: 5px;
	margin-bottom: 5px;
	padding: 3px;
}

.product-icons {
	display: flex;
	cursor: pointer;
}

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