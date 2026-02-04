import axios from 'axios';

const res = await axios.post(
  "http://localhost:4500/api/user/login",
  { email, password },
  { withCredentials: true }
);


export default axiosInstance;