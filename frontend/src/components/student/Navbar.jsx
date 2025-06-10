import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
    setUser(null);
  };

  return (
    <nav className="bg-white shadow-sm p-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600">LMS</Link>

      <div className="flex items-center gap-4">
        <Link to="/courses" className="text-gray-700 hover:text-blue-600">Courses</Link>
        {user ? (
          <>
            <Link to="/my-enrollments" className="text-gray-700 hover:text-blue-600">My Enrollments</Link>
            <Link to="/profile" className="text-gray-700 hover:text-blue-600">Profile</Link>
            <span className="text-sm text-gray-600 hidden sm:inline">Welcome, <strong>{user.user?.username || user.email}</strong></span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
            <Link to="/register" className="text-gray-700 hover:text-blue-600">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
