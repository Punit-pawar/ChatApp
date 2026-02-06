import axios from 'axios';

const res = await axios.post(
  "http://localhost:4500/api/user/login",
  { email, password },
  { withCredentials: true }
);

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

export default axiosInstance;