import axios from "axios";

import Cookies from "js-cookie";
import _ from "lodash";

axios.defaults.baseURL = `${process.env.NEXT_PUBLIC_BACKEND_API}`;
axios.defaults.timeout = 1000;
axios.defaults.withCredentials = true; // Important for sending cookies

axios.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  function (response) {
    return response;
  },

  function (error) {
    if (error.status === 401) {
      Cookies.remove("token");
      window.location.href = "/login"; // If the user is not authenticated, redirect to login page
    }

    const data = error.response?.data ?? {};
    const dataArr = Object.values(data);
    const errorMessage = _.join(dataArr, ", ");
    error.response.data = errorMessage;

    return Promise.reject(error);
  }
);

export default axios;
