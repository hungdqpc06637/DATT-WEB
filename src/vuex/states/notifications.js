  // <-- notifications.js -->
const state = {
  notifications: JSON.parse(localStorage.getItem("notifications")) || []
};

const mutations = {
  ADD_NOTIFICATION(state, notification) {
    const newNotification = {
      id: Date.now(),
      desc: notification.desc
    };
    state.notifications.push(newNotification);
    localStorage.setItem("notifications", JSON.stringify(state.notifications)); // Lưu vào localStorage
  },
  REMOVE_NOTIFICATION(state, id) {
    state.notifications = state.notifications.filter((toast) => toast.id !== id);
    localStorage.setItem("notifications", JSON.stringify(state.notifications)); // Cập nhật localStorage
  },
  RESET_NOTIFICATIONS(state) {
    state.notifications = [];
    localStorage.removeItem("notifications"); // Xóa khỏi localStorage
  }
};

const actions = {
  addNotification({ commit }, notification) {
    const newNotification = {
      id: Date.now(),
      desc: notification.desc
    };

    commit('ADD_NOTIFICATION', newNotification);

    setTimeout(() => {
      commit('REMOVE_NOTIFICATION', newNotification.id);
    }, 3000);
  },
  resetNotifications({ commit }) {
    commit('RESET_NOTIFICATIONS');
  }
};

const getters = {
  getNotifications: (state) => state.notifications
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
