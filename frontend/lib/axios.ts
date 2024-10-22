import { loginUserRefreshV2, logoutUser } from "@/features/auth/api/login.api";
import axios from "axios";

import _ from "lodash";

axios.defaults.baseURL = `${process.env.NEXT_PUBLIC_BACKEND_API}`;
axios.defaults.timeout = 1000;
axios.defaults.withCredentials = true; // Important for sending cookies

axios.interceptors.request.use((config) => {
  return config;
});

axios.interceptors.response.use(
  function (response) {
    return response;
  },

  function (error) {
    if (error.status === 401) {
      try {
        const logout = async () => {
          const res = await logoutUser();
          if (res.success) {
            window.location.href = "/";
          } else {
            alert("Logout Failed");
          }
        };

        const refresh = async () => {
          const res = await loginUserRefreshV2();
          if (res.success) {
            console.log("Refreshed");
            return;
          }
          // logout user
          alert("Session Expired, Please Login Again");
          logout();
        };

        
        refresh();
      } catch (error) {
        console.error(error);
      }
    }

    const data = error.response?.data ?? {};
    const dataArr = Object.values(data);
    const errorMessage = _.join(dataArr, ", ");
    error.response.data = errorMessage;

    return Promise.reject(error);
  }
);

export default axios;
