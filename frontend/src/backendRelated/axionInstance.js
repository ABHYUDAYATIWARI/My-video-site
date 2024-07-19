import axios from 'axios';
import authService from './authentication.js';

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/v1"
});

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await authService.refreshToken();
        return axiosInstance(originalRequest);
      } catch (err) {
        console.log("error in axion instance");
        // window.location.href = '/login';//navigate to login
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;