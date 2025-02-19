import { publicRequest } from '../../requestMethod.js';

const state = {
  cartItems: [],
};

const mutations = {
  setCartItems(state, items) {
    state.cartItems = [...items];
  },
  updateCartItem(state, { productId, quantity }) {
    const item = state.cartItems.find((item) => item.id === productId);
    if (item) {
      item.quantity = quantity;
    }
  },
  resetCart(state) {
    state.cartItems = []; // ✅ Xóa giỏ hàng ngay lập tức
  },
};

const getters = {
  cartItemCount: (state) => {
    return state.cartItems.reduce((total, item) => total + item.quantity, 0);
  },
};

const actions = {
  async fetchCartData({ commit }, userId) {
    try {
      const response = await publicRequest.get(`/cart/get?user_id=${userId}`);

      if (response.data.code === 200) {
        commit('setCartItems', response.data.data || []);
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
        dispatch('notifications/addNotification', { desc: '🛒 Sản phẩm đã được thêm vào giỏ hàng!' }, { root: true });
        await dispatch('fetchCartData', userId);
      } else {
        dispatch('notifications/addNotification', { desc: '❌ Không thể thêm vào giỏ hàng!' }, { root: true });
      }
    } catch (error) {
      dispatch('notifications/addNotification', { desc: '⚠️ Lỗi kết nối máy chủ!' }, { root: true });
    }
  }
  ,
  resetCart({ commit }) {
    commit("resetCart"); // ✅ Xóa giỏ hàng ngay lập tức
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
};
