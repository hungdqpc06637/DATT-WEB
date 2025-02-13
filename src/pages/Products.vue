<template>
  <div class="container my-5 min-vh-100">
    <h1 class="text-center mb-5">DANH MỤC SẢN PHẨM</h1>
    <div class="row">
      <!-- Sidebar bộ lọc -->
      <div class="col-md-4 border-right">
        <div class="sticky-top filter">
          <div class="card">
            <div class="card-body">
              <h3 class="card-title mb-3">BỘ LỌC</h3>
              
              <!-- Lọc theo danh mục -->
              <div class="form-group mb-3">
                <label for="category">Danh mục:</label>
                <select class="form-control" id="category" v-model="filter.category">
                  <option value="">Tất cả</option>
                  <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
                </select>
              </div>

              <!-- Lọc theo tên sản phẩm -->
              <div class="form-group mb-3">
                <label for="name">Tìm kiếm:</label>
                <input type="text" class="form-control" id="name" placeholder="Tìm kiếm sản phẩm..." v-model="filter.name">
              </div>

              <!-- Lọc theo khoảng giá -->
              <div class="row form-group mb-3">
                <label>Khoảng giá:</label>
                <label class="col-md-12 text-center">Từ {{ formatNum(filter.priceMin) }} VNĐ đến {{ formatNum(filter.priceMax) }} VNĐ</label>
                <input type="range" class="form-range" min="0" max="10000000" step="500000" v-model="filter.priceMax">
              </div>

              <!-- Lọc theo kích cỡ -->
              <div class="form-group mb-3">
                <label for="size">Kích cỡ:</label>
                <select class="form-control" id="size" v-model="filter.size">
                  <option value="">Tất cả</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                </select>
              </div>

              <!-- Lọc theo màu sắc -->
              <div class="form-group mb-3">
                <label>Màu sắc:</label>
                <div class="d-flex">
                  <button v-for="color in colors" :key="color" 
                          :style="{ backgroundColor: color }" 
                          class="color-filter" 
                          @click="filter.color = color">
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <!-- Danh sách sản phẩm -->
      <div class="col-md-8">
        <div class="row">
          <Products :filter="filter"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Products from '../components/Products.vue';
import { publicRequest } from '../requestMethod.js';

export default {
  components: {
    Products
  },
  data() {
    return {
      filter: {
        name: '',
        category: '',
        size: '',
        color: '',
        priceMin: 0,
        priceMax: 10000000,
        paginated: true,
        itemsPerPage: 12,
      },
      categories: [],
      colors: ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00']
    }
  },
  created() {
    publicRequest.get('/products/categories')
      .then(res => {
        this.categories = res.data;
      })
      .catch(err => {
        console.log(err);
      })
  },
  methods: {
    formatNum(num) {
      return num.toLocaleString();
    }
  }
}
</script>

<style scoped>
.filter {
  top: 80px;
}

.border-right {
  border-right: 2px solid #89898935;
}

.color-filter {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid #ccc;
  margin-right: 5px;
  cursor: pointer;
}
</style>
