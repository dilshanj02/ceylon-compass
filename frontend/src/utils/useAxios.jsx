import axios from "axios";

const useAxios = () => {
  const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000",
  });

  axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return axiosInstance;
};

export default useAxios;
