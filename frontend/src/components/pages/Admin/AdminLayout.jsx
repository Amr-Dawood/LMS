import { Outlet, Link, useLocation } from 'react-router-dom';
import { FaHome, FaUsers, FaClipboardList, FaSignOutAlt } from 'react-icons/fa';

const AdminLayout = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(true);
  
    useEffect(() => {
      // Set active tab based on current route
      const path = location.pathname.split('/')[2] || 'dashboard';
      setActiveTab(path);
    }, [location]);
  
    const handleLogout = () => {
      // Implement logout logic
      Cookies.remove('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    };
  
    const navItems = [
      { path: 'dashboard', name: 'Dashboard', icon: <FaHome /> },
      { path: 'users', name: 'User Management', icon: <FaUsers /> },
      { path: 'pending-courses', name: 'Pending Courses', icon: <FaClipboardList /> },
    ];
  
    return (
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <div className={`bg-indigo-700 text-white transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
          <div className="p-4 flex items-center justify-between border-b border-indigo-600">
            {sidebarOpen ? (
              <h1 className="text-xl font-bold">Admin Panel</h1>
            ) : (
              <div className="w-8 h-8 bg-indigo-800 rounded-full"></div>
            )}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 rounded-full hover:bg-indigo-600"
            >
              {sidebarOpen ? '«' : '»'}
            </button>
          </div>
  
          <nav className="mt-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={`/admin/${item.path}`}
                className={`flex items-center p-4 hover:bg-indigo-600 transition-colors ${
                  activeTab === item.path ? 'bg-indigo-800' : ''
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {sidebarOpen && <span className="ml-3">{item.name}</span>}
              </Link>
            ))}
          </nav>
  
          <div className="absolute bottom-0 w-full p-4 border-t border-indigo-600">
            <button
              onClick={handleLogout}
              className="flex items-center w-full p-2 hover:bg-indigo-600 rounded transition-colors"
            >
              <FaSignOutAlt />
              {sidebarOpen && <span className="ml-3">Logout</span>}
            </button>
          </div>
        </div>
  
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {/* Header */}
          <header className="bg-white shadow-sm p-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800 capitalize">
              {activeTab.replace('-', ' ')}
            </h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
                  A
                </div>
                {sidebarOpen && <span className="ml-2">Admin</span>}
              </div>
            </div>
          </header>
  
          {/* Page Content */}
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    );
  };
  
  export default AdminLayout