import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../student/Footer";
import axios from "axios";

const MyEnrollments = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchEnrolledCourses() {
      try {
        const response = await axios.get("http://localhost:5000/api/course/student_enrolled", {
          headers: { Accept: "application/json" },
          withCredentials: true,
        });
        setEnrolledCourses(response.data.data || []);
      } catch (err) {
        setError("Failed to fetch enrolled courses. Please try again later.");
        console.error("Error fetching enrollments:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchEnrolledCourses();
  }, []);

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return "bg-green-500";
    if (percentage >= 50) return "bg-blue-500";
    if (percentage > 0) return "bg-yellow-500";
    return "bg-gray-300";
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-lg text-gray-700">Loading your enrollments...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center p-6 max-w-md mx-auto bg-red-50 rounded-lg">
            <svg
              className="w-12 h-12 text-red-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Enrollments</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Enrollments</h1>
            <p className="mt-2 text-gray-600">
              {enrolledCourses.length > 0
                ? `You're enrolled in ${enrolledCourses.length} course${enrolledCourses.length !== 1 ? "s" : ""}`
                : "Your enrolled courses will appear here"}
            </p>
          </div>

          {enrolledCourses.length > 0 ? (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="grid grid-cols-12 bg-gray-50 p-4 font-medium text-gray-700 hidden sm:grid">
                <div className="col-span-5">Course</div>
                <div className="col-span-2">Duration</div>
                <div className="col-span-3">Progress</div>
                <div className="col-span-2">Status</div>
              </div>

              <div className="divide-y divide-gray-200">
                {enrolledCourses.map((course) => {
                  const progressPercentage = Math.round(
                    (course.lectureCompleted * 100) / (course.totalLecture || 1)
                  );
                  const isCompleted = progressPercentage === 100;

                  return (
                    <div
                      key={course._id}
                      className="grid grid-cols-1 sm:grid-cols-12 p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="col-span-5 flex items-center space-x-4 mb-4 sm:mb-0">
                        <img
                          src={course.courseThumbnail || "/default-course.jpg"}
                          alt={course.title}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = "/default-course.jpg";
                          }}
                        />
                        <div>
                          <h3 className="font-medium text-gray-900 line-clamp-2">
                            {course.title || "Untitled Course"}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {course.instructor || "Unknown Instructor"}
                          </p>
                        </div>
                      </div>

                      <div className="col-span-2 flex items-center text-gray-700 mb-4 sm:mb-0">
                        {course.enrollment_duration || "N/A"} months
                      </div>

                      <div className="col-span-3 flex items-center mb-4 sm:mb-0">
                        <div className="w-full">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">
                              {progressPercentage}% Complete
                            </span>
                            <span className="text-gray-500">
                              {course.lectureCompleted || 0}/{course.totalLecture || "N/A"}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full ${getProgressColor(
                                progressPercentage
                              )}`}
                              style={{ width: `${progressPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-2 flex items-center justify-end sm:justify-start">
                        <button
                          onClick={() => navigate(`/player/${course._id}`)}
                          className={`px-4 py-2 rounded-md text-sm font-medium ${
                            isCompleted
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                          } transition-colors`}
                        >
                          {isCompleted ? "Completed" : "Continue"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg p-8 text-center">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Enrollments Found
              </h3>
              <p className="text-gray-500 mb-6">
                You haven't enrolled in any courses yet. Browse our catalog to find
                interesting courses.
              </p>
              <button
                onClick={() => navigate("/courses")}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Browse Courses
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyEnrollments;