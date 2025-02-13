<template>
	<!-- Product section-->
	<div class="container min-vh-100">
		<section class="py-5">
			<div class="px-4 px-lg-5 my-5">
				<Spinner v-if="products.isLoading && !this.products.data.length" />

				<!-- Danh mục / Tiêu đề -->
				<p class="text-muted mb-5" v-if="!products.isLoading && this.products.data.length">
					THỜI TRANG | {{ product.category.toUpperCase() }} | {{ product.title.toUpperCase() }}
				</p>
				<div class="row gx-4 gx-lg-5 align-items-center" v-if="product">
					<div class="col-md-5"><img class="card-img-top mb-5 mb-md-0" :src="product.img"
							:alt="product.title" /></div>
					<div class="col-md-7">
						<div class="small mb-1">Mã SP: {{ product.pid }}</div>
						<h1 class="display-5 fw-bolder">{{ product.title }}</h1>
						<div class="fs-5 mb-5">
							<span>{{ getCurrentPrice() }} VNĐ</span>
						</div>
						<p class="lead">{{ product.desc }}</p>

						<!-- Chọn kích cỡ -->
						<div class="col-md-12 mb-3">
							<label class="mb-1">Chọn kích cỡ:</label>
							<div class="col-md">
								<button type="button" class="btn btn-outline-dark me-1 mb-1"
									v-for="size in product.sizes" :key="size" :class="{ 'active': currentSize === size }"
									@click="toggleSize(size)">
									{{ size }}
								</button>
							</div>
						</div>

						<!-- Chọn màu sắc -->
						<div class="col-md-12 mb-3">
							<label class="mb-1">Chọn màu sắc:</label>
							<div class="d-flex">
								<button v-for="color in product.colors" :key="color" :style="{ backgroundColor: color }"
									class="color-filter" @click="toggleColor(color)"
									:class="{ 'selected': currentColor === color }">
								</button>
							</div>
						</div>

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

<script>
import Products from '../components/Products.vue';
import Spinner from '../components/Spinner.vue';
import { mapState } from 'vuex';

export default {
	components: {
		Products,
		Spinner
	},
	data() {
		return {
			product: undefined,
			quantity: 1,
			currentSize: undefined,
			currentColor: undefined,
		}
	},
	computed: {
		...mapState({
			products: state => state.products
		})
	},
	created() {
		this.loadProduct();
	},
	watch: {
		'$route.params.id': function () {
			this.loadProduct();
		},
		'products.isLoading': function (isLoading) {
			if (!isLoading) {
				this.loadProduct();
			}
		}
	},
	methods: {
		toggleSize(size) {
			this.currentSize = size;
		},
		toggleColor(color) {
			this.currentColor = color;
		},
		getCurrentPrice() {
			return this.product.price.toLocaleString();
		},
		loadProduct() {
			if (this.products.isLoading && !this.products.data.length) return;

			this.product = this.products.data.find((product) => {
				return product.pid === this.$route.params.id;
			});

			// Kiểm tra nếu product không tồn tại, tránh lỗi "undefined"
			if (!this.product) {
				this.$router.push('/');
				return;
			}

			// Kiểm tra nếu product.sizes hoặc product.colors có tồn tại trước khi truy cập
			this.currentSize = this.product.sizes?.[0] || null;
			this.currentColor = this.product.colors?.[0] || null;
		}
		,
		increase() {
			this.quantity++
		},
		decrease() {
			if (this.quantity > 1) this.quantity--
		}
	}
}
</script>

<style scoped>
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
