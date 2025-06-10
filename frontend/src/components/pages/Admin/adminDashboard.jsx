import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiUsers, FiBook, FiClock, FiSettings, FiLogOut } from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalInstructors: 0,
    totalCourses: 0,
    activeCourses: 0,
    pendingCourses: 0
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState({
    stats: true,
    users: true
  });
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  // Fetch dashboard statistics
  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/admin/stats', { withCredentials: true });
      setStats(res.data);
      setLoading(prev => ({ ...prev, stats: false }));
    } catch (err) {
      setError('Failed to load statistics');
      setLoading(prev => ({ ...prev, stats: false }));
    }
  };

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/admin/users', { withCredentials: true });
      setUsers(res.data);
      setLoading(prev => ({ ...prev, users: false }));
    } catch (err) {
      setError('Failed to load users');
      setLoading(prev => ({ ...prev, users: false }));
    }
  };

  // Toggle user status
  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
      await axios.put(
        `/api/admin/users/${userId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      setUsers(users.map(user => 
        user._id === userId ? { ...user, status: newStatus } : user
      ));
    } catch (err) {
      setError('Failed to update user status');
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    try {
      await axios.delete(`/api/admin/users/${userId}`, { withCredentials: true });
      setUsers(users.filter(user => user._id !== userId));
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, []);

  const renderContent = () => {
    if (loading.stats && activeTab === 'dashboard') {
      return <LoadingSpinner />;
    }

    if (loading.users && activeTab === 'users') {
      return <LoadingSpinner />;
    }

    if (error) {
      return <ErrorAlert message={error} onRetry={() => {
        setError(null);
        activeTab === 'dashboard' ? fetchStats() : fetchUsers();
      }} />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <DashboardStats stats={stats} />;
      case 'users':
        return <UserManagement 
          users={users} 
          onStatusToggle={toggleUserStatus}
          onDelete={deleteUser}
          onEdit={(userId) => navigate(`/admin/users/${userId}`)}
        />;
      case 'courses':
        return <div className="p-6">Courses management coming soon</div>;
      case 'pending':
        return <div className="p-6">Pending courses coming soon</div>;
      default:
        return <DashboardStats stats={stats} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
        </div>
        <nav className="p-4">
          <SidebarItem 
            icon={<FiHome />} 
            label="Dashboard" 
            active={activeTab === 'dashboard'}
            onClick={() => setActiveTab('dashboard')}
          />
          <SidebarItem 
            icon={<FiUsers />} 
            label="User Management" 
            active={activeTab === 'users'}
            onClick={() => setActiveTab('users')}
          />
          <SidebarItem 
            icon={<FiBook />} 
            label="Courses" 
            active={activeTab === 'courses'}
            onClick={() => setActiveTab('courses')}
          />
          <SidebarItem 
            icon={<FiClock />} 
            label="Pending Courses" 
            active={activeTab === 'pending'}
            onClick={() => setActiveTab('pending')}
          />
          <SidebarItem 
            icon={<FiSettings />} 
            label="Settings" 
            onClick={() => navigate('/admin/settings')}
          />
          <div className="mt-8">
            <SidebarItem 
              icon={<FiLogOut />} 
              label="Logout" 
              onClick={() => {
                axios.post('/api/auth/logout', {}, { withCredentials: true });
                navigate('/login');
              }}
            />
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'users' && 'User Management'}
              {activeTab === 'courses' && 'Course Management'}
              {activeTab === 'pending' && 'Pending Courses'}
            </h2>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/admin/pendingcourse')}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
              >
                <FiClock className="mr-2" />
                Pending Courses ({stats.pendingCourses})
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

// Dashboard Statistics Component
const DashboardStats = ({ stats }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard 
        title="Total Students" 
        value={stats.totalStudents} 
        change="+12% from last month"
        icon="👨‍🎓"
        color="blue"
      />
      <StatCard 
        title="Total Instructors" 
        value={stats.totalInstructors} 
        change="+5% from last month"
        icon="👩‍🏫"
        color="green"
      />
      <StatCard 
        title="Total Courses" 
        value={stats.totalCourses} 
        change="+8% from last month"
        icon="📚"
        color="purple"
      />
      <StatCard 
        title="Pending Courses" 
        value={stats.pendingCourses} 
        change={stats.pendingCourses > 0 ? "Needs review" : "All clear"}
        icon="⏳"
        color="yellow"
      />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <RecentActivity />
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <QuickActions />
      </div>
    </div>
  </div>
);

// User Management Component
const UserManagement = ({ users, onStatusToggle, onDelete, onEdit }) => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
      <h3 className="text-lg font-semibold">All Users</h3>
      <button 
        onClick={() => onEdit('new')}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Add New User
      </button>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map(user => (
            <tr key={user._id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">Joined {new Date(user.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                  user.role === 'instructor' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  onClick={() => onStatusToggle(user._id, user.status)}
                  className={`${user.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                >
                  {user.status === 'active' ? 'Suspend' : 'Activate'}
                </button>
                <button 
                  onClick={() => onEdit(user._id)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  Edit
                </button>
                <button 
                  onClick={() => onDelete(user._id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
      <div className="text-sm text-gray-500">
        Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of <span className="font-medium">{users.length}</span> users
      </div>
      <div className="flex space-x-2">
        <button className="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
          Previous
        </button>
        <button className="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
          Next
        </button>
      </div>
    </div>
  </div>
);

// StatCard Component
const StatCard = ({ title, value, change, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    purple: 'bg-purple-100 text-purple-800',
    yellow: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-semibold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{change}</p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <span className="text-xl">{icon}</span>
        </div>
      </div>
    </div>
  );
};

// Sidebar Item Component
const SidebarItem = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 rounded-lg mb-1 ${active ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
  >
    <span className="mr-3">{icon}</span>
    <span className="font-medium">{label}</span>
  </button>
);

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Error Alert Component
const ErrorAlert = ({ message, onRetry }) => (
  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
    <div className="flex">
      <div className="flex-shrink-0">
        <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="ml-3">
        <p className="text-sm text-red-700">{message}</p>
        <button
          onClick={onRetry}
          className="mt-2 text-sm text-red-600 hover:text-red-500 font-medium"
        >
          Retry →
        </button>
      </div>
    </div>
  </div>
);

// Recent Activity Component (would be dynamic in real app)
const RecentActivity = () => (
  <div className="space-y-4">
    <ActivityItem 
      icon="🎓"
      title="5 new student enrollments"
      time="2 hours ago"
    />
    <ActivityItem 
      icon="📝"
      title="3 new courses submitted"
      time="5 hours ago"
    />
    <ActivityItem 
      icon="👤"
      title="2 new instructors joined"
      time="1 day ago"
    />
  </div>
);

// Activity Item Component
const ActivityItem = ({ icon, title, time }) => (
  <div className="flex items-start">
    <div className="flex-shrink-0 bg-blue-100 rounded-full p-2 mr-3">
      <span className="text-blue-600">{icon}</span>
    </div>
    <div>
      <p className="text-sm font-medium text-gray-900">{title}</p>
      <p className="text-xs text-gray-500">{time}</p>
    </div>
  </div>
);

// Quick Actions Component
const QuickActions = () => (
  <div className="space-y-3">
    <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 flex items-center">
      <span className="mr-3">📊</span>
      <span>Generate Reports</span>
    </button>
    <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 flex items-center">
      <span className="mr-3">📢</span>
      <span>Send Announcement</span>
    </button>
    <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 flex items-center">
      <span className="mr-3">⚙️</span>
      <span>System Settings</span>
    </button>
  </div>
);

export default AdminDashboard;