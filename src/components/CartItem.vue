<template>
	<!-- Modal Xác nhận Xóa Sản phẩm -->
	<div class="modal fade" :id="modalId" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h1 class="modal-title fs-5" id="exampleModalLabel">Bạn có chắc chắn?</h1>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					Bạn sắp xóa <strong>{{ item.title }}</strong> khỏi giỏ hàng của mình.
				</div>
				<div class="modal-footer justify-content-between">
					<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
					<button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="remove(item.pid)">
						Xóa sản phẩm
					</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Sản phẩm trong giỏ hàng -->
	<div class="card mb-3">
		<div class="row g-0">
			<div class="col-md-3">
				<img :src="item.img" class="img-fluid rounded">
			</div>
			<div class="col-md-9">
				<div class="card-body">
					<h5 class="card-title">{{ item.title }}</h5>
					<p class="card-text text-muted">{{ item.desc }}</p>

					<!-- Thông tin về kích cỡ và màu sắc -->
					<p class="card-text" v-if="item.choosedType">
						<small class="text-muted">Kích cỡ: {{ item.choosedType.name }}</small>
					</p>
					<p class="card-text" v-if="item.choosedOptions.length">
						<small class="text-muted">Màu sắc: {{ item.choosedOptions.map(item => item.name).join(', ') }}</small>
					</p>
					
					<!-- Giá sản phẩm -->
					<p class="card-text"><small class="text-muted">Giá: {{ formatPrice(item.price) }}₫</small></p>
					
					<div class="d-flex justify-content-between align-items-center">
						<!-- Tăng giảm số lượng -->
						<div class="btn-group">
							<button type="button" class="btn btn-sm btn-outline-secondary" @click="updateQuantity(item.pid, -1)">-</button>
							<button type="button" class="btn btn-sm btn-outline-secondary">{{ item.quantity }}</button>
							<button type="button" class="btn btn-sm btn-outline-secondary" @click="updateQuantity(item.pid, 1)">+</button>
						</div>
						
						<!-- Nút xóa sản phẩm -->
						<button type="button" class="btn btn-sm btn-outline-danger" data-bs-toggle="modal" :data-bs-target="'#' + modalId">
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
		item: {
			type: Object,
			default: {}
		}
	},
	data() {
		return {
			modalId: 'confirmDelete-' + this.item.pid
		}
	},
	methods: {
		remove(id) {
			this.$store.dispatch('removeFromCart', id);
			this.$store.dispatch('addNotification', "Bạn đã xóa một sản phẩm khỏi giỏ hàng.");
		},
		updateQuantity(id, amount) {
			this.$store.dispatch('updateCartQuantity', { id, amount });
		},
		formatPrice(value) {
			return new Intl.NumberFormat('vi-VN').format(value);
		}
	}
}
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
