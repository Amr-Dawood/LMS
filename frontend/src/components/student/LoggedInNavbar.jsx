import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

const LoggedInNavbar = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    // Get role from localStorage when component mounts
    const role = localStorage.getItem('role');
    if (role) {
      setUserRole(role);
    }
  }, []);

  const handleLogout = () => {
    // Clear all authentication related data
    Cookies.remove("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userData");
    navigate("/login");
  };

  // Navigation items based on role
  const getNavItems = () => {
    const commonItems = [
      { path: "/my-enrollments", label: "My Enrollments", roles: ['student', 'instructor', 'admin'] },
      { path: "/courses", label: "Browse Courses", roles: ['student', 'instructor', 'admin'] }
    ];

    const adminItems = [
      { path: "/admin/dashboard", label: "Dashboard", roles: ['admin'] },
      { path: "/admin/users", label: "User Management", roles: ['admin'] },
      { path: "/admin/courses", label: "Course Management", roles: ['admin'] }
    ];

    const instructorItems = [
      { path: "/instructor/courses", label: "My Courses", roles: ['instructor'] },
      { path: "/instructor/analytics", label: "Analytics", roles: ['instructor'] }
    ];

    const studentItems = [
      { path: "/my-progress", label: "My Progress", roles: ['student'] }
    ];

    return [
      ...commonItems,
      ...adminItems,
      ...instructorItems,
      ...studentItems
    ].filter(item => item.roles.includes(userRole));
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-lg sticky top-0 z-50">
      <div className="text-xl font-bold">
        <Link to="/">LMS Platform</Link>
      </div>
      
      <div className="flex items-center space-x-6">
        {/* Main Navigation Links */}
        <div className="hidden md:flex space-x-6">
          {getNavItems().map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className="hover:underline hover:text-blue-200 transition duration-200"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button (would need additional implementation) */}
        <button className="md:hidden">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center">
              {userRole.charAt(0).toUpperCase()}
            </div>
            <span className="hidden md:inline">Profile</span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <Link
                to="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                onClick={() => setDropdownOpen(false)}
              >
                My Profile
              </Link>
              <Link
                to="/settings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                onClick={() => setDropdownOpen(false)}
              >
                Settings
              </Link>
              {userRole === 'admin' && (
                <Link
                  to="/admin/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  onClick={() => setDropdownOpen(false)}
                >
                  Admin Settings
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Close dropdown when clicking outside */}
      {dropdownOpen && (
        <div 
          className="fixed inset-0 h-full w-full z-40" 
          onClick={() => setDropdownOpen(false)}
        />
      )}
    </nav>
  );
};

export default LoggedInNavbar;