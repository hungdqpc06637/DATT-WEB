<template>
	<!-- Product section-->
	<div class="container min-vh-100">
		<section class="py-5">
			<div class="px-4 px-lg-5 my-5">
				<Spinner v-if="loading" />

				<!-- Danh mục / Tiêu đề -->
				<p class="text-muted mb-5" v-if="product && !loading">
					THỜI TRANG | {{ product.category?.toUpperCase() }} | {{ product.name?.toUpperCase() }}
				</p>
				<div class="row gx-4 gx-lg-5 align-items-center" v-if="product">
					<div class="col-md-5 position-relative">
						<!-- Hình ảnh lớn -->
						<img v-if="product.images && product.images.length > 0" class="card-img-top mb-5 mb-md-0"
							:src="'/images/' + currentImage" :alt="product.name" />
						<!-- Thêm hình ảnh mặc định nếu không có hình ảnh -->
						<img v-else class="card-img-top mb-5 mb-md-0" src="/images/default-image.jpg"
							alt="No image available" />

						<!-- Các hình ảnh thu nhỏ bao quanh hình ảnh lớn -->
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
						<p class="lead">{{ product.desc }}</p>

						<!-- Chọn kích cỡ -->
						<div class="col-md-12 mb-3">
							<label class="mb-1">Chọn kích cỡ:</label>
							<div class="col-md">
								<button type="button" class="btn btn-outline-dark me-1 mb-1" v-for="size in sizes"
									:key="size" :class="{ 'active': currentSize === size }" @click="toggleSize(size)">
									{{ size }}
								</button>
							</div>
						</div>

						<!-- Chọn màu sắc -->
						<div class="col-md-12 mb-3" v-if="currentSize">
							<label class="mb-1">Chọn màu sắc:</label>
							<div class="d-flex">
								<button v-for="color in filteredColors" :key="color" :style="{ backgroundColor: color }"
									class="color-filter" @click="toggleColor(color)"
									:class="{ 'selected': currentColor === color }">
								</button>
							</div>
						</div>

						<!-- Chọn số lượng -->
						<!-- Chọn số lượng -->
						<div class="d-flex">
							<div class="btn-group me-3">
								<button type="button" class="btn btn-outline-dark" @click="decrease">-</button>
								<button type="button" class="btn btn-outline-dark">{{ quantity }}</button>
								<button type="button" class="btn btn-outline-dark" @click="increase">+</button>
							</div>
							<button class="btn btn-outline-dark flex-shrink-0" type="button"
								v-add-to-cart="{ $store, item: { ...product, quantity, currentSize, currentColor } }">
								<i class="bi-cart-fill me-1"></i>
								Thêm vào giỏ hàng
							</button>
						</div>

					</div>
				</div>
			</div>
		</section>

		<!-- Sản phẩm liên quan -->
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
import Products from '../components/Products.vue';
import Spinner from '../components/Spinner.vue';
import { publicRequest } from "../requestMethod.js";

const product = ref(null);
const loading = ref(true);
const productId = ref(null);
const currentImage = ref('');
const currentSize = ref('');
const currentColor = ref('');
const quantity = ref(1);  // Số lượng mặc định
const sizes = ref([]);
const colors = ref([]);
const filteredColors = ref([]);

const route = useRoute();

// Hàm lấy giá hiện tại (tùy theo biến `product`)
const getCurrentPrice = () => {
	return product.value?.variants?.find(variant => variant.size === currentSize.value && variant.color === currentColor.value)?.price || product.value.base_price;
};

// Hàm thay đổi hình ảnh khi người dùng chọn hình thu nhỏ
const changeImage = (image) => {
	currentImage.value = image;  // Cập nhật hình ảnh lớn khi người dùng chọn hình thu nhỏ
};

// Hàm tăng số lượng
const increase = () => {
	if (quantity.value < 99) { // Giới hạn số lượng tối đa là 99
		quantity.value += 1;
	}
};

// Hàm giảm số lượng
const decrease = () => {
	if (quantity.value > 1) { // Giới hạn số lượng tối thiểu là 1
		quantity.value -= 1;
	}
};

// Hàm chọn kích cỡ
const toggleSize = (size) => {
	currentSize.value = size; // Cập nhật kích cỡ khi người dùng chọn
	// Lọc màu sắc tương ứng với kích cỡ đã chọn
	filteredColors.value = product.value.variants
		.filter(variant => variant.size === currentSize.value)
		.map(variant => variant.color);
	currentColor.value = ''; // Reset màu sắc khi thay đổi kích cỡ
};

// Hàm chọn màu sắc
const toggleColor = (color) => {
	currentColor.value = color; // Cập nhật màu sắc khi người dùng chọn
};

// Hàm lấy chi tiết sản phẩm
const fetchProductDetail = async (id) => {
	loading.value = true;

	try {
		const response = await publicRequest.get(`/product/getvariants/${id}`);
		console.log(response.data);  // Kiểm tra dữ liệu nhận được từ API

		if (response && response.data && response.data.data) {
			product.value = response.data.data;  // Gán dữ liệu sản phẩm vào `product`
			if (!product.value.images || product.value.images.length === 0) {
				console.error('Product images are missing or empty');
			}
			currentImage.value = product.value.images[0]; // Mặc định chọn hình ảnh đầu tiên

			// Lấy danh sách kích cỡ và màu sắc từ `variants`
			sizes.value = [...new Set(product.value.variants.map(v => v.size))]; // Lọc các kích cỡ duy nhất
			colors.value = [...new Set(product.value.variants.map(v => v.color))]; // Lọc các màu sắc duy nhất
		} else {
			console.error('Product data is missing or invalid');
		}
	} catch (error) {
		console.error('Error fetching product details:', error);
	} finally {
		loading.value = false;
	}
};

onMounted(() => {
	productId.value = parseInt(route.params.id);
	console.log('Product ID from URL:', productId.value);  // Kiểm tra giá trị ID
	if (productId.value) {
		fetchProductDetail(productId.value);
	} else {
		console.error('Invalid product ID');
	}
});
</script>




<style scoped>
/* Các hình ảnh thu nhỏ bao quanh hình ảnh lớn */
.position-relative {
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
}

.thumbnails {
	position: absolute;
	bottom: 10px;
	/* Cách đáy hình ảnh lớn 10px */
	right: 10px;
	/* Cách bên phải hình ảnh lớn 10px */
	display: flex;
	flex-direction: column;
	/* Sắp xếp hình thu nhỏ theo chiều dọc */
	gap: 10px;
	/* Khoảng cách giữa các hình ảnh thu nhỏ */
	z-index: 2;
	/* Đặt z-index cao để hình thu nhỏ không bị che khuất */
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
	/* Thêm bóng để nổi bật các hình thu nhỏ */
}

.card-img-top {
	width: 100%;
	z-index: 1;
	/* Đảm bảo hình ảnh lớn nằm dưới các hình thu nhỏ */
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
</style>
