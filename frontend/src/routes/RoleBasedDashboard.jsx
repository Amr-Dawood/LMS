// RoleBasedDashboard.jsx
import { Navigate } from 'react-router-dom';

const RoleBasedDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role || user?.user?.role;
  console.log(role);

  if (!user) return <Navigate to="/login" replace />;

  switch (role) {
    case 'admin':
      return <Navigate to="/admin-dashboard" replace />;
    case 'instructor':
      return <Navigate to="/Educator-dashboard" replace />;
    case 'student':
      return <Navigate to="/user-dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export default RoleBasedDashboard;
