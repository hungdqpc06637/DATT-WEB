// store/modules/cart.js
import { publicRequest } from '../../requestMethod.js';

const state = {
  cartItems: [],
};

const mutations = {
  setCartItems(state, items) {
    state.cartItems = [...items]; // Cập nhật lại toàn bộ giỏ hàng
  },
  updateCartItem(state, { productId, quantity }) {
    const item = state.cartItems.find((item) => item.id === productId);
    if (item) {
      item.quantity = quantity; // Cập nhật số lượng sản phẩm
    }
  },
};

const getters = {
  cartItemCount: (state) => {
    return state.cartItems.reduce((total, item) => total + item.quantity, 0); // Trả về tổng số lượng sản phẩm trong giỏ
  },
};

const actions = {
  async fetchCartData({ commit }, userId) {
    try {
      const response = await publicRequest.get(`/cart/get?user_id=${userId}`);

      if (response.data.code === 200) {
        commit('setCartItems', response.data.data || []); // Cập nhật giỏ hàng vào Vuex
        console.log("Giỏ hàng đã được tải lại:", response.data.data);
      } else {
        console.error("Có lỗi khi tải giỏ hàng:", response.data.message);
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu giỏ hàng:", error);
    }
  },

  async addToCart({ dispatch }, { userId, productVariantId, quantity }) {
    try {
      const response = await publicRequest.post("/cart/addtocart", {
        user_id: userId,
        product_variant_id: productVariantId,
        quantity: quantity,
      });

      if (response.data && response.data.message === "Product added to cart successfully") {
        console.log('Sản phẩm đã được thêm vào giỏ hàng thành công!');
        await dispatch('fetchCartData', userId); // Tải lại giỏ hàng sau khi thêm sản phẩm
      } else {
        console.error("Lỗi từ API:", response.data);
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
    }
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
};
