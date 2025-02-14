import { ref } from "vue";
import { useRouter } from "vue-router"; // ✅ Import useRouter

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
  const router = useRouter(); // ✅ Khởi tạo router bên trong hàm useAuth()

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    user.value = null;

    router.push("/login"); // ✅ Chuyển hướng về /login
  };

  return { user, loadUser, login, logout };
}
