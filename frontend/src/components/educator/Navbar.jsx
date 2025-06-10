import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { 
  FiMenu, 
  FiX, 
  FiUser, 
  FiBook, 
  FiLogOut, 
  FiHome, 
  FiAward, 
  FiSettings,
  FiSearch,
  FiChevronDown,
  FiChevronUp
} from "react-icons/fi";
import { FaChalkboardTeacher, FaBell } from "react-icons/fa";
import { RiDashboardLine } from "react-icons/ri";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
    setUser(null);
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: "/courses", label: "Browse Courses", icon: <FiBook size={18} className="mr-2" /> },
    { path: "/my-enrollments", label: "My Learning", icon: <FiAward size={18} className="mr-2" />, auth: true },
    { path: "/educator", label: "Teach", icon: <FaChalkboardTeacher size={18} className="mr-2" />, auth: true }
  ];

  const userMenuItems = [
    { path: "/profile", label: "Profile", icon: <FiUser size={16} className="mr-2" /> },
    { path: "/settings", label: "Settings", icon: <FiSettings size={16} className="mr-2" /> },
    { path: "/dashboard", label: "Dashboard", icon: <RiDashboardLine size={16} className="mr-2" />, auth: true }
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and mobile menu button */}
          <div className="flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 -ml-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
            
            <Link to="/" className="flex items-center ml-2 md:ml-0">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                LearnHub
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              (!link.auth || user) && (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              )
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search button - visible on all screens */}
            <button 
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100"
            >
              <FiSearch size={20} />
            </button>

            {user && (
              <>
                {/* Notifications */}
                <div className="relative hidden md:block" ref={dropdownRef}>
                  <button
                    onClick={() => {
                      setNotificationsOpen(!notificationsOpen);
                      setProfileDropdownOpen(false);
                    }}
                    className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100 relative"
                  >
                    <FaBell size={18} />
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                  </button>
                  
                  {notificationsOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-72 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {/* Notification items would go here */}
                        <div className="px-4 py-3 hover:bg-gray-50 text-sm">
                          <p className="text-gray-700">Your course enrollment was successful</p>
                          <p className="text-gray-500 text-xs mt-1">2 hours ago</p>
                        </div>
                        <div className="px-4 py-3 hover:bg-gray-50 text-sm">
                          <p className="text-gray-700">New message from your instructor</p>
                          <p className="text-gray-500 text-xs mt-1">1 day ago</p>
                        </div>
                      </div>
                      <div className="px-4 py-2 border-t border-gray-100 text-center">
                        <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                          View all notifications
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Auth Section */}
            {user ? (
              <div className="relative hidden md:block" ref={dropdownRef}>
                <button
                  onClick={() => {
                    setProfileDropdownOpen(!profileDropdownOpen);
                    setNotificationsOpen(false);
                  }}
                  className="flex items-center space-x-2 max-w-xs rounded-full focus:outline-none"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-300 flex items-center justify-center text-white font-medium">
                    {user.user?.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:inline text-sm font-medium text-gray-700">
                    {user.user?.username || user.email}
                  </span>
                  {profileDropdownOpen ? (
                    <FiChevronUp className="hidden lg:inline text-gray-500" />
                  ) : (
                    <FiChevronDown className="hidden lg:inline text-gray-500" />
                  )}
                </button>

                {profileDropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm text-gray-900 font-medium">Signed in as</p>
                      <p className="text-sm text-gray-500 truncate">
                        {user.user?.username || user.email}
                      </p>
                    </div>
                    <div className="py-1">
                      {userMenuItems.map((item) => (
                        (!item.auth || user) && (
                          <Link
                            key={item.path}
                            to={item.path}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setProfileDropdownOpen(false)}
                          >
                            {item.icon}
                            {item.label}
                          </Link>
                        )
                      ))}
                    </div>
                    <div className="py-1 border-t border-gray-100">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FiLogOut size={16} className="mr-2" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          {/* Search bar - appears in mobile menu */}
          <div className="px-4 pt-3 pb-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          
          <div className="pt-1 pb-3 space-y-1">
            {navLinks.map((link) => (
              (!link.auth || user) && (
                <Link
                  key={`mobile-${link.path}`}
                  to={link.path}
                  className={`flex items-center px-4 py-3 text-base font-medium ${
                    isActive(link.path)
                      ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="mr-3">
                    {link.icon}
                  </span>
                  {link.label}
                </Link>
              )
            ))}
          </div>
          
          {user ? (
            <>
              <div className="px-4 py-3 border-t border-gray-200">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-300 flex items-center justify-center text-white font-medium">
                    {user.user?.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700">
                      {user.user?.username || user.email}
                    </p>
                    <p className="text-xs text-gray-500">View profile</p>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <div className="px-4 py-3 border-t border-gray-200 space-y-3">
              <Link
                to="/login"
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Search overlay - appears on desktop */}
      {searchOpen && (
        <div className="hidden md:block absolute inset-x-0 top-16 bg-white shadow-lg z-40">
          <div className="max-w-3xl mx-auto p-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search courses, instructors, or topics..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
              <button 
                onClick={() => setSearchOpen(false)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;