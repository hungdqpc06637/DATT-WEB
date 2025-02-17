<template>
	<Spinner v-if="loading" />
	<p v-if="!loading && getItems.length === 0">No products found.</p>
	<Product v-else v-for="product in getItems" :key="product.id" :product="product" />
  
	<!-- Only show paginate if there are products -->
	<paginate v-if="filter.paginated && getItems.length > 0" :page-count="Math.ceil(props.products.length / filter.itemsPerPage)" 
	  :page-range="3" :margin-pages="2" :click-handler="clickCallback" :prev-text="'Prev'" :next-text="'Next'"
	  :container-class="'pagination'" :page-class="'page-item'" />
  </template>
  
  <script setup>
  import { ref, computed, watchEffect } from "vue";
  import { useRoute } from "vue-router";
  import Spinner from "../components/Spinner.vue";
  import Product from "../components/Product.vue";
  import Paginate from "vuejs-paginate-next";
  
  const route = useRoute(); // 📌 Lấy thông tin route hiện tại
  
  const props = defineProps({
	products: Array,
	loading: Boolean,
  });
  
  const filter = ref({
	paginated: true,
	itemsPerPage: 12,
  });
  
  const currentPage = ref(1);
  
  // 🛒 Phân trang sản phẩm
  const getItems = computed(() => {
	if (!props.products) return []; // Kiểm tra nếu không có products
	if (filter.value.paginated) {
	  let current = currentPage.value * filter.value.itemsPerPage;
	  let start = current - filter.value.itemsPerPage;
	  return props.products.slice(start, current);
	}
	return props.products;
  });
  
  // 📌 Reload khi route thay đổi
  watchEffect(() => {
	console.log("🔄 Reloading products page...");
	currentPage.value = 1; // Reset về trang đầu tiên
  });
  
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
  