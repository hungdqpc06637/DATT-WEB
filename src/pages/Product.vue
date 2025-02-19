<template>
	<div class="container min-vh-100">
		<section class="py-5">
			<div class="px-4 px-lg-5 my-5">
				<Spinner v-if="loading" />
				<p class="text-muted mb-5" v-if="product && !loading">
					THỜI TRANG | {{ product.category?.toUpperCase() }} | {{ product.name?.toUpperCase() }}
				</p>
				<div class="row gx-4 gx-lg-5 align-items-center" v-if="product">
					<div class="col-md-5 position-relative">
						<img v-if="product.images && product.images.length > 0" class="card-img-top mb-5 mb-md-0"
							:src="'/images/' + currentImage" :alt="product.name" />
						<img v-else class="card-img-top mb-5 mb-md-0" src="/images/default-image.jpg"
							alt="No image available" />

						<div class="thumbnails">
							<div v-for="(image, index) in product.images" :key="index" class="thumbnail"
								@click="changeImage(image)">
								<img class="img-thumbnail" :src="'/images/' + image"
									:alt="product.name + ' thumbnail'" />
							</div>
						</div>
					</div>

					<div class="col-md-7">
						<div class="small mb-1">Mã SP: {{ product.id }}</div>
						<h1 class="display-5 fw-bolder">{{ product.name }}</h1>
						<div class="fs-5 mb-5">
							<span>{{ getCurrentPrice() }} VNĐ</span>
						</div>

						<p class="lead" :class="{ 'collapsed': !showMoreDescription }">{{ product.description }}</p>
						<button class="btn btn-link" @click="toggleDescription">
							{{ showMoreDescription ? 'Thu gọn' : 'Xem thêm' }}
						</button>

						<div class="col-md-12 mb-3">
							<label class="mb-1">Chọn kích cỡ:</label>
							<div class="col-md">
								<button type="button" class="btn btn-outline-dark me-1 mb-1" v-for="size in sizes"
									:key="size" :class="{ 'active': currentSize === size }" @click="toggleSize(size)">
									{{ size }}
								</button>
							</div>
						</div>

						<div class="col-md-12 mb-3" v-if="currentSize">
							<label class="mb-1">Chọn màu sắc:</label>
							<div class="d-flex flex-wrap">
								<button v-for="color in filteredColors" :key="color" :style="{ backgroundColor: color }"
									class="color-filter" @click="toggleColor(color)"
									:class="{ 'selected': currentColor === color }">
								</button>
							</div>
						</div>

						<div class="d-flex flex-wrap">
							<div class="btn-group me-3">
								<button type="button" class="btn btn-outline-dark" @click="decrease">-</button>
								<button type="button" class="btn btn-outline-dark">{{ quantity }}</button>
								<button type="button" class="btn btn-outline-dark" @click="increase">+</button>
							</div>
							<button class="btn btn-outline-dark flex-shrink-0" type="button" @click="addToCart">
								<i class="bi-cart-fill me-1"></i>
								Thêm vào giỏ hàng
							</button>
						</div>

					</div>
				</div>
			</div>
		</section>

		<section class="py-5 bg-light" v-if="product">
			<div class="px-4 px-lg-5 my-5">
				<h2 class="fw-bolder mb-4">Sản phẩm liên quan</h2>
				<div class="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
					<Products :filter="{ limit: 4, type: product.category }" />
				</div>
			</div>
		</section>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { publicRequest } from "../requestMethod.js";

const store = useStore();  // Gọi useStore() đúng cách
const product = ref(null);
const loading = ref(true);
const productId = ref(null);
const currentImage = ref('');
const currentSize = ref('');
const currentColor = ref('');
const quantity = ref(1);
const sizes = ref([]);
const colors = ref([]);
const filteredColors = ref([]);
const showMoreDescription = ref(false);

const route = useRoute();

const getCurrentPrice = () => {
	return product.value?.variants?.find(variant => variant.size === currentSize.value && variant.color === currentColor.value)?.price || product.value.base_price;
};

const toggleDescription = () => {
	showMoreDescription.value = !showMoreDescription.value;
};

const changeImage = (image) => {
	currentImage.value = image;
};

const increase = () => {
	if (quantity.value < 99) {
		quantity.value += 1;
	}
};

const decrease = () => {
	if (quantity.value > 1) {
		quantity.value -= 1;
	}
};

const toggleSize = (size) => {
	currentSize.value = size;
	filteredColors.value = product.value.variants
		.filter(variant => variant.size === currentSize.value)
		.map(variant => variant.color);
	currentColor.value = '';
};

const toggleColor = (color) => {
	currentColor.value = color;
};

const fetchProductDetail = async (id) => {
	loading.value = true;

	try {
		const response = await publicRequest.get(`/product/getvariants/${id}`);
		if (response && response.data && response.data.data) {
			product.value = response.data.data;
			if (!product.value.images || product.value.images.length === 0) {
				console.error('Product images are missing or empty');
			}
			currentImage.value = product.value.images[0];
			sizes.value = [...new Set(product.value.variants.map(v => v.size))];
			colors.value = [...new Set(product.value.variants.map(v => v.color))];
		} else {
			console.error('Product data is missing or invalid');
		}
	} catch (error) {
		console.error('Error fetching product details:', error);
	} finally {
		loading.value = false;
	}
};
const addToCart = async () => {
	const userId = JSON.parse(localStorage.getItem("user"))?.user_id;

	if (!userId) {
		store.dispatch('notifications/addNotification', { desc: '⚠️ Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!' });
		return;
	}

	const selectedVariant = product.value?.variants?.find(v => v.size === currentSize.value && v.color === currentColor.value);

	if (!selectedVariant) {
		store.dispatch('notifications/addNotification', { desc: '⚠️ Vui lòng chọn kích cỡ và màu sắc trước khi thêm vào giỏ hàng.' });
		return;
	}

	try {
		const response = await publicRequest.post("/cart/addtocart", {
			user_id: userId,
			product_variant_id: selectedVariant.id,
			quantity: quantity.value,
		});

		if (response.data && response.data.message === "Product added to cart successfully") {
			store.dispatch('notifications/addNotification', { desc: '🛒 Sản phẩm đã được thêm vào giỏ hàng thành công!' });
			await store.dispatch('cart/fetchCartData', userId); // Gọi action fetchCartData để cập nhật lại giỏ hàng
		} else {
			console.error("Lỗi từ API:", response.data);
			store.dispatch('notifications/addNotification', { desc: '❌ Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.' });
		}
	} catch (error) {
		console.error("Lỗi khi thêm vào giỏ hàng:", error.response?.data || error.message);
		store.dispatch('notifications/addNotification', { desc: '⚠️ Có lỗi xảy ra, vui lòng thử lại sau.' });
	}
};


onMounted(() => {
	productId.value = parseInt(route.params.id);
	if (productId.value) {
		fetchProductDetail(productId.value);
	} else {
		console.error('Invalid product ID');
	}
});
</script>






<style scoped>
.position-relative {
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
}

.thumbnails {
	position: absolute;
	bottom: 10px;
	right: 10px;
	display: flex;
	flex-direction: column;
	gap: 10px;
	z-index: 2;
}

.thumbnail {
	cursor: pointer;
}

.thumbnail img {
	width: 80px;
	height: 80px;
	object-fit: cover;
	border-radius: 5px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.card-img-top {
	width: 100%;
	z-index: 1;
}

.color-filter {
	width: 30px;
	height: 30px;
	border-radius: 50%;
	border: 2px solid #ccc;
	margin-right: 5px;
	cursor: pointer;
}

.color-filter.selected {
	border: 2px solid black;
}

.lead.collapsed {
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
}
</style>
