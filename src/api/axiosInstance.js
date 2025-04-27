import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://goskilled-backend-7ux9.onrender.com",
});

export default axiosInstance;
