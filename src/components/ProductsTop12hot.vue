<template>
	<!-- Hiển thị Spinner khi đang tải -->
	<Spinner v-if="loading" />

	<!-- Thông báo khi không có sản phẩm -->
	<p v-if="!loading && getItems.length === 0">Không tìm thấy sản phẩm nào.</p>

	<!-- Hiển thị danh sách sản phẩm -->
	<Producthot v-else v-for="productItem in getItems" :key="productItem.product?.id || productItem.id"
		:product="productItem.product" :image_url="productItem.image_url" />


	<!-- Hiển thị phân trang nếu có nhiều sản phẩm -->
	<paginate v-if="filter.paginated && props.products.length > filter.itemsPerPage"
		:page-count="Math.ceil(props.products.length / filter.itemsPerPage)" :page-range="3" :margin-pages="2"
		:click-handler="clickCallback" :prev-text="'Trước'" :next-text="'Sau'" :container-class="'pagination'"
		:page-class="'page-item'" />
</template>

<script setup>
import { ref, computed, watchEffect } from "vue";
import { useRoute } from "vue-router";
import Spinner from "../components/Spinner.vue";
import Paginate from "vuejs-paginate-next";
import Producthot from "../components/Producthot.vue";

// 🛒 Nhận dữ liệu từ props
const props = defineProps({
	products: Array, // ✅ Đúng tên props
	loading: Boolean,
});

// 🎛️ Cấu hình bộ lọc
const filter = ref({
	paginated: true,
	itemsPerPage: 12,
});

const currentPage = ref(1); // 🏷️ Trang hiện tại

const getItems = computed(() => {
	console.log("📦 Dữ liệu products:", props.products); // 🔍 Kiểm tra dữ liệu từ cha
	if (!props.products || props.products.length === 0) return [];

	if (filter.value.paginated) {
		let start = (currentPage.value - 1) * filter.value.itemsPerPage;
		let end = start + filter.value.itemsPerPage;
		let paginatedProducts = props.products.slice(start, end);

		console.log("🛒 Danh sách sản phẩm sau phân trang:", paginatedProducts);
		return paginatedProducts;
	}

	return props.products;
});


// 🔄 Reset trang khi route thay đổi
watchEffect(() => {
	console.log("🔄 Route thay đổi, đặt lại trang đầu...");
	currentPage.value = 1;
});

// 📌 Cập nhật trang khi bấm phân trang
const clickCallback = (pageNum) => {
	currentPage.value = Number(pageNum);
};
</script>

<style scoped>
.pagination {
	margin: 10px;
	justify-content: center;
	cursor: pointer;
	list-style: none;
	padding: 0;
	margin: 0;
}
</style>
