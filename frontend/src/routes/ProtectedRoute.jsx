import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, allowedRoles, deniedRoles, allowGuests = false }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role || user?.user?.role;
  // If no user and guests are allowed
  if (!user && allowGuests) {
    return element;
  }

  // If no user and guests are NOT allowed
  if (!user && !allowGuests) {
    return <Navigate to="/login" replace />;
  }

  // If user is logged in and denied
  if (deniedRoles && deniedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  // If user is logged in and allowedRoles is defined but they are not in it
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return element;
};

export default ProtectedRoute;
