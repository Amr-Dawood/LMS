// components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ allowedRoles }) => {
  const token = Cookies.get("token");
  const userData = JSON.parse(localStorage.getItem("user"));
  const role = userData?.user?.role;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
