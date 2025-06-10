  import { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import Footer from "../../student/Footer";
  import axios from "axios";
  import { Bars } from "react-loader-spinner";

  const CoursesList = () => {
    const [allCourses, setAllCourses] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [enrolling, setEnrolling] = useState(null);
    const navigate = useNavigate();

    async function fetchCourses() {
      setLoading(true);
      setError(null);
      try {
        let response = await axios.get("http://localhost:5000/api/course", {
          headers: { Accept: "application/json" },
          withCredentials: true,
        });
        console.log("API Response:", response.data);
        setAllCourses(response?.data?.course || []);
      } catch (error) {
        setError("Failed to load courses. Please try again later.");
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    }

    const handleEnroll = async (courseId) => {
      setEnrolling(courseId);
      console.log(courseId);

      try {
        const response = await axios.post(
          `http://localhost:5000/api/course/${courseId}/enroll`,
          {},
          { withCredentials: true }
        );

        alert(response.data.message || "Enrolled successfully!");
        fetchCourses();
      } catch (error) {
        alert(error.response?.data?.message || "Enrollment failed!");
        console.error("Error enrolling:", error);
      } finally {
        setEnrolling(null);
      }
    };

    useEffect(() => {
      fetchCourses();
    }, []);

    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <Bars height="100" width="100" color="#4fa94d" ariaLabel="bars-loading" visible={true} />
        </div>
      );
    }

    if (error) {
      return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
    }

    return (
      <>
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Available Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {allCourses && allCourses.length > 0 ? (
              allCourses.map((course, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
                >
                  {/* Course Image */}
                  <img
    src={course.image || "http://localhost:5000/uploads/profile.png"}
    alt={course.title}
    className="w-full h-48 object-cover"
  />


                  {/* Course Details */}
                  <div className="p-4">
                    <h4 className="text-lg font-bold text-gray-900">{course.title}</h4>
                    <p className="text-gray-500 text-sm">{course.instructor_id?.username || "Unknown Instructor"}</p>

                    {/* Star Ratings */}
                    <div className="flex items-center mt-2">
                      <span className="text-yellow-500">
                        {"★".repeat(Math.floor(course.rating || 0))}
                        {"☆".repeat(5 - Math.floor(course.rating || 0))}
                      </span>
                      <span className="text-gray-500 text-sm ml-2">({course.reviews?.length || 0})</span>
                    </div>

                    {/* Price */}
                    <p className="text-xl font-semibold text-gray-800 mt-2">${course.course_price}</p>

                    {/* Buttons */}
                    <div className="mt-4 flex gap-2">
                      {/* View Course */}
                      <button
                        onClick={() => navigate(`/course/${course.code}`)}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg text-center hover:bg-blue-700 transition duration-300"
                      >
                        View Course
                      </button>

                      {/* Enroll Button */}
                      <button
                        onClick={() => handleEnroll(course._id)}
                        disabled={enrolling === course._id}
                        className={`w-full py-2 rounded-lg text-center transition duration-300 ${
                          enrolling === course._id
                            ? "bg-gray-400 text-white cursor-not-allowed"
                            : "bg-green-600 text-white hover:bg-green-700"
                        }`}
                      >
                        {enrolling === course._id ? "Enrolling..." : "Enroll"}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 text-lg">No courses available.</div>
            )}
          </div>
        </div>
        {/* <Footer /> */}
      </>
    );
  };

  export default CoursesList;
