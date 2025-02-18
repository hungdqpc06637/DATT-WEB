<template>
	<div class="card mb-3">
	  <div class="row g-0">
		<div class="col-md-3">
		  <img :src="`/images/${item?.product_variants[0]?.images?.[0]}`" class="img-fluid rounded"
			alt="Hình ảnh sản phẩm" />
		</div>
		<div class="col-md-9">
		  <div class="card-body">
			<h5 class="card-title">{{ item?.product_variants[0]?.name || 'Sản phẩm' }}</h5>
			<p class="card-text text-muted">Size: {{ item?.product_variants[0]?.variants?.[0]?.size || 'Không xác định' }}</p>
			<p class="card-text text-muted">Màu sắc: {{ item?.product_variants[0]?.variants?.[0]?.color || 'Không xác định' }}</p>
			<p class="card-text">
			  <small class="text-muted">
				Giá: {{ formatPrice(item?.product_variants[0]?.variants?.[0]?.price || 0) }}₫
			  </small>
			</p>
  
			<div class="d-flex justify-content-between align-items-center">
			  <div class="btn-group">
				<button type="button" class="btn btn-sm btn-outline-secondary" @click="updateQuantity(-1)">-</button>
				<button type="button" class="btn btn-sm btn-outline-secondary">{{ item?.quantity || 0 }}</button>
				<button type="button" class="btn btn-sm btn-outline-secondary" @click="updateQuantity(1)">+</button>
			  </div>
			  <button type="button" class="btn btn-sm btn-outline-danger" @click="removeItem(item?.product_variants[0]?.variants?.[0]?.id)">
				Xóa sản phẩm
			  </button>
			</div>
		  </div>
		</div>
	  </div>
	</div>
  </template>
  
  <script>
  export default {
	props: {
	  item: Object
	},
	methods: {
	  updateQuantity(amount) {
		this.$emit('update', this.item.id, amount);
	  },
	  removeItem(productVariantId) {
		this.$emit('remove', productVariantId);  // Truyền đúng product_variant_id từ variants[0].id
	  },
	  formatPrice(value) {
		return new Intl.NumberFormat('vi-VN').format(value);
	  }
	}
  };
  </script>
  



<style scoped>
.card-body {
	padding: 15px;
}

.card-title {
	font-weight: bold;
	color: #333;
}

.btn-outline-secondary {
	min-width: 40px;
	text-align: center;
}

img {
	object-fit: cover;
}
</style>