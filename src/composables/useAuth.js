import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex"; // ✅ Import Vuex Store

const user = ref(null);

const loadUser = () => {
  const userData = localStorage.getItem("user");
  user.value = userData ? JSON.parse(userData) : null;
};

const login = (userData) => {
  localStorage.setItem("user", JSON.stringify(userData));
  user.value = userData;
};

export function useAuth() {
  const router = useRouter();
  const store = useStore(); // ✅ Sử dụng Vuex Store

  const logout = () => {
    console.log("🚪 Đang đăng xuất...");

    // 🗑️ Xóa toàn bộ dữ liệu người dùng
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("vuex"); // ✅ Xóa Vuex localStorage

    // 🔄 Reset giỏ hàng ngay lập tức
    store.dispatch("cart/resetCart"); // ✅ Cập nhật giỏ hàng ngay khi đăng xuất

    user.value = null;

    // 🚀 Chuyển hướng về trang đăng nhập
    router.push("/login");
  };

  return { user, loadUser, login, logout };
}
