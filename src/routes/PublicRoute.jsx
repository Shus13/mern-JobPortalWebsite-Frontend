import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PublicRoute = () => {
  const { isAuthenticated, role } = useAuth();

  if (isAuthenticated) {
    const target =
      role === "JobProvider" ? "/dashboard" : role === "Admin" ? "/admin" : "/jobs";
    return <Navigate to={target} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
