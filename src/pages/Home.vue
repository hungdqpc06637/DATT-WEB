<template>
	<Slider />
	<div class="container my-5">
		<Categories />
		<hr/>
		<!-- Danh sách sản phẩm -->
		<section class="product-lists mt-5">
			<div class="row text-center">
				<div class="col-md-12 mb-2">
					<h1 class="fw-bold">SẢN PHẨM MỚI NHẤT</h1>
				</div>
				<!-- <BarChart v-if="!products.isLoading" :products="products.data"/> -->
				<Products :filter="{limit:5}" />
			</div>
		</section>
		<hr/>
		<!-- Câu chuyện của chúng tôi -->
		<section class="our-story mt-5">
			<div class="row text-center">
				<div class="col-md-12 mb-2">
					<h1 class="fw-bold">CÂU CHUYỆN CỦA CHÚNG TÔI</h1>
				</div>
				<div class="col-md-7 my-auto p-5 bg-light rounded shadow-sm">
					<p>Chào mừng bạn đến với cửa hàng thời trang của chúng tôi! Chúng tôi tự hào mang đến những sản phẩm phong cách và chất lượng cao.</p>
					<p>Sứ mệnh của chúng tôi là giúp bạn thể hiện phong cách riêng biệt qua từng bộ trang phục.</p>
					<p>Hãy khám phá bộ sưu tập mới nhất và tận hưởng trải nghiệm mua sắm tuyệt vời tại cửa hàng của chúng tôi.</p>
				</div>
				<div class="col-md-5">
					<img src="/images/our-story.jpg" alt="Câu chuyện của chúng tôi" class="rounded img-fluid">
				</div>
			</div>
		</section>
	</div>

	<!-- Đăng ký nhận tin -->
	<Newsletter />
</template>

<script>
import Slider from '../components/Slider.vue';
import Newsletter from '../components/Newsletter.vue';
import Products from '../components/Products.vue';
import BarChart from '../components/BarChart.vue';
import { mapState } from 'vuex';

export default {
	components: {
		Slider,
		Newsletter,
		Products,
		BarChart
	},
	computed: {
		...mapState({
			products: state => state.products
		})
	},
	mounted() {
		console.log(this.products)
	}
}
</script>

<style scoped>
</style>
