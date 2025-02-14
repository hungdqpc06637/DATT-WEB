import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_SERVER || "http://localhost:8081/api/v1/";

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = () => {
  const token = localStorage.getItem('token'); // ✅ Tự động lấy token từ localStorage
  return axios.create({
    baseURL: BASE_URL,
    headers: { Authorization: token ? `Bearer ${token}` : '' }, // ✅ Đảm bảo luôn có token
  });
};

