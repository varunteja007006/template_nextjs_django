import axios from "axios";
import Cookies from "js-cookie";

axios.defaults.baseURL = `${process.env.NEXT_PUBLIC_BACKEND_API}`;
axios.defaults.timeout = 1000;

axios.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export default axios;
