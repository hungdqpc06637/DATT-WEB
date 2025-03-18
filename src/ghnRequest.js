// ghnRequest.js
import axios from "axios";


const GHN_API_KEY = import.meta.env.VITE_GHN_API_KEY;
const GHN_SHOP_ID = import.meta.env.VITE_GHN_SHOP_ID;
const GHN_BASE_URL = import.meta.env.VITE_GHN_BASE_URL || "https://online-gateway.ghn.vn/shiip/public-api";

if (!GHN_API_KEY) {
  console.error("GHN_API_KEY chưa được thiết lập.");
}

const headers = {
  "Content-Type": "application/json",
  "Token": GHN_API_KEY,
};

const ghnRequest = axios.create({
  baseURL: GHN_BASE_URL,
  headers: headers,
});

ghnRequest.interceptors.request.use(
  config => {
    //console.log("Request config:", config);
    return config;
  },
  error => {
    console.error("Lỗi khi gửi request:", error);
    return Promise.reject(error);
  }
);

ghnRequest.interceptors.response.use(
  response => response,
  error => {
    console.error("Lỗi từ GHN API:", error.response ? error.response.data : error.message);
    return Promise.reject(error);
  }
);

export default ghnRequest;
