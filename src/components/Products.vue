<template>
	<Spinner v-if="loading" />
	<p v-if="!loading && getItems.length === 0">No products found.</p>
	<Product v-else v-for="product in getItems" :key="product.id" :product="product" />
  
	<paginate 
	  v-if="filter.paginated" 
	  :page-count="Math.ceil(products.length / filter.itemsPerPage)" 
	  :page-range="3"
	  :margin-pages="2" 
	  :click-handler="clickCallback" 
	  :prev-text="'Prev'" 
	  :next-text="'Next'"
	  :container-class="'pagination'" 
	  :page-class="'page-item'" 
	/>
  </template>
  
  <script setup>
  import { ref, computed } from "vue";
  import Spinner from "../components/Spinner.vue";
  import Product from "../components/Product.vue";
  import Paginate from "vuejs-paginate-next";
  
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
	if (!props.products) return [];
	if (filter.value.paginated) {
	  let current = currentPage.value * filter.value.itemsPerPage;
	  let start = current - filter.value.itemsPerPage;
	  return props.products.slice(start, current);
	}
	return props.products;
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
  