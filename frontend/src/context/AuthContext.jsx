import { createContext, useState, useEffect } from "react";
import axios from "../utils/useAxios"; // Import the axios instance

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto-login if token exists
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      axios
        .get("/api/protected/")
        .then((res) => setUser(res.data))
        .catch(() => logout()) // invalid token
        .finally(() => setLoading(false)); // Set loading to false after the request
    } else {
      setLoading(false); // Set loading to false if no token
    }
  }, []);

  // Axios Interceptor: Logs out user if API call fails due to 401 error
  // axios.interceptors.response.use(
  //   (response) => response,
  //   (error) => {
  //     if (error.response && error.response.status === 401) {
  //       logout();
  //     }
  //     return Promise.reject(error);
  //   }
  // );

  const login = (token) => {
    localStorage.setItem("access_token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axios.get("/api/protected/").then((res) => setUser(res.data));
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
