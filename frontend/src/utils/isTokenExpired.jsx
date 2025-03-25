import { jwtDecode } from "jwt-decode";

const isTokenExpired = () => {
  const token = localStorage.getItem("access_token");

  if (!token) return true;
  try {
    const decoded = jwtDecode(token);
    return Date.now() > decoded.exp * 1000;
  } catch (error) {
    return true;
  }
};

export default isTokenExpired;
