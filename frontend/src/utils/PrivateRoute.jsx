import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const PrivateRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  return user ? <Outlet /> : <Navigate to="/signin" />;
};

export default PrivateRoute;
