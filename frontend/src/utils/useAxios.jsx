import axios from "axios";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const useAxios = () => {
  const { authTokens } = useContext(AuthContext);

  const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000",
  });

  axiosInstance.interceptors.request.use((config) => {
    if (authTokens) {
      config.headers.Authorization = `Bearer ${authTokens.access}`;
    }
    return config;
  });

  return axiosInstance;
};

export default useAxios;
