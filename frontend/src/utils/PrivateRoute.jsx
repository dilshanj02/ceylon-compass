import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import isTokenExpired from "./isTokenExpired";

const PrivateRoute = () => {
  const { user, logout } = useContext(AuthContext);

  if (!user || isTokenExpired()) {
    logout();
    return <Navigate to="/signin" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
