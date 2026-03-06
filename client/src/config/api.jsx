// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_BACKEND_URL,
//   withCredentials: true,
// });
// export default axiosInstance;



import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4500",
  withCredentials: true,
});

export default api;