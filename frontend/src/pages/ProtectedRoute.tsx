import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

const ProtectedRoute = () => {
  const { token } = useAppSelector((state) => state.auth);
  console.log("ProtectedRoute - token present:", !!token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
