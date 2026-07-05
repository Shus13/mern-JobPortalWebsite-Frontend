import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PublicRoute = () => {
  const { isAuthenticated, role } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={role === "JobProvider" ? "/dashboard" : "/jobs"} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
