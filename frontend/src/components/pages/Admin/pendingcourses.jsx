import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PendingCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const navigate = useNavigate();

  const showToast = (message, type = "success") => {
    alert(`${type.toUpperCase()}: ${message}`);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:5000/auth_me", {
          withCredentials: true,
        });
        setUser(response.data.user);

        if (!response.data.user || response.data.user.role !== "admin") {
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        showToast("Authentication failed. Redirecting...", "error");
        setTimeout(() => navigate("/"), 2000);
      }
    };

    fetchUser();
  }, [navigate]);

  useEffect(() => {
    if (!user || user.role !== "admin") return;

    const fetchPendingCourses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/course/pending", {
          withCredentials: true,
        });
        setCourses(response.data.data);
      } catch (error) {
        console.error("Error fetching pending courses:", error);
        showToast("Failed to load pending courses", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingCourses();
  }, [user]);

  const handleAction = async (courseId, action) => {
    setActionLoading(prev => ({ ...prev, [courseId]: true }));
    const url = `http://localhost:5000/api/course/${action}/${courseId}`;

    try {
      await axios.post(url, {}, { withCredentials: true });
      setCourses(prevCourses => prevCourses.filter(course => course._id !== courseId));
      showToast(`Course ${action}d successfully!`);
    } catch (error) {
      console.error(`Error ${action}ing course:`, error);
      showToast(`Failed to ${action} course`, "error");
    } finally {
      setActionLoading(prev => ({ ...prev, [courseId]: false }));
    }
  };

  const viewCourseDetails = (courseId) => {
    navigate(`/course-preview/${courseId}`);
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Pending Course Approvals
            </h2>
            <p className="text-gray-600">
              Review and approve or reject submitted courses
            </p>
          </div>
          <span className="text-sm text-blue-500 font-medium">
            {courses.length} Pending {courses.length === 1 ? "Course" : "Courses"}
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="ml-4 text-gray-600">
              Loading pending courses...
            </p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto h-48 w-48 opacity-70 bg-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="mt-4 text-xl text-gray-700">
              No pending courses available
            </h3>
            <p className="text-gray-500 mt-2">
              All courses have been reviewed or none are currently pending approval.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                <div className="h-48 bg-gray-200 overflow-hidden">
                  <img
                    src={course.image || "/course-placeholder.jpg"}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900 truncate">
                      {course.title}
                    </h3>
                    <button
                      className="p-1 text-blue-500 hover:text-blue-700"
                      onClick={() => viewCourseDetails(course._id)}
                      title="Preview Course"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                      {course.code}
                    </span>
                    <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs">
                      {course.language}
                    </span>
                    <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs">
                      {course.course_level}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">
                        Lessons
                      </p>
                      <p className="font-medium">
                        {course.course_lesson}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">
                        Hours
                      </p>
                      <p className="font-medium">
                        {course.course_hour}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">
                        Price
                      </p>
                      <p className="font-medium">
                        ${course.course_price}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">
                        Category
                      </p>
                      <p className="font-medium truncate">
                        {course.category}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-3">
                    {course.description.replace(/<[^>]+>/g, '')}
                  </p>
                </div>
                <div className="p-4 pt-0 flex justify-between">
                  <button
                    className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                    onClick={() => handleAction(course._id, "approve")}
                    disabled={actionLoading[course._id]}
                  >
                    {actionLoading[course._id] ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    Approve
                  </button>
                  <button
                    className="flex items-center gap-2 border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-50 disabled:opacity-50"
                    onClick={() => handleAction(course._id, "reject")}
                    disabled={actionLoading[course._id]}
                  >
                    {actionLoading[course._id] ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-500"></div>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingCourses;