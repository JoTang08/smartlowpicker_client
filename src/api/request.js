import axios from "axios";
import { ElMessage } from "element-plus"; // 使用 element-plus 提示框

// 创建实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/", // 可根据环境变量配置
  timeout: 60000,
  withCredentials: true,
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 可以在这里设置 token 或其他请求头
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data;

    // 这里可以根据后端自定义的状态码做判断
    if (res.code && res.code !== 200) {
      ElMessage.error(res.message || "请求错误");
      return Promise.reject(res);
    } else {
      return res;
    }
  },
  (error) => {
    const msg = error.response?.data?.message || error.message;
    ElMessage.error(msg || "网络错误");
    return Promise.reject(error);
  }
);

export default service;
