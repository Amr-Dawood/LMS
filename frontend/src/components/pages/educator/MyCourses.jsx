  import { useContext, useEffect, useState } from "react";
  import { AppContext } from "../../../context/AppContext";
  import Loading from "../../student/Loading";
  import { useNavigate } from "react-router-dom";


  const MyCourses = () => {
    const navigate = useNavigate();
    const { currency } = useContext(AppContext);
    const [courses, setCourses] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchEducatorCourses = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/course/instructor/mycourses", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setCourses(data.data.courses);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchEducatorCourses();
    }, []);

    const deleteCourse = async (courseCode) => {
      if (!window.confirm("Are you sure you want to delete this course?")) return;

      try {
        const response = await fetch(`http://localhost:5000/api/course/singel/${courseCode}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to delete course");
        }

        setCourses((prevCourses) => prevCourses.filter((course) => course.code !== courseCode));
      } catch (err) {
        alert(`Error: ${err.message}`);
      }
    };

    const editCourse = async (courseCode) => {
      const newTitle = prompt("Enter new course title:");
      if (!newTitle) return;

      try {
        const response = await fetch(`http://localhost:5000/api/course/singel/${courseCode}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ title: newTitle }),
        });

        if (!response.ok) {
          throw new Error("Failed to update course");
        }

        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course.code === courseCode ? { ...course, title: newTitle } : course
          )
        );
      } catch (err) {
        alert(`Error: ${err.message}`);
      }
    };

    if (loading) return <Loading />;
    if (error) return <div className="text-red-500 text-center py-5">Failed to load courses: {error}</div>;

    return (
      <div className="h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
        <div className="w-full">
          <h2 className="pb-4 text-lg font-medium">My Courses</h2>
          <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
            <table className="md:table-auto table-fixed w-full overflow-hidden">
              <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold truncate">All Courses</th>
                  <th className="px-4 py-3 font-semibold truncate">Earnings</th>
                  <th className="px-4 py-3 font-semibold truncate">Students</th>
                  <th className="px-4 py-3 font-semibold truncate">Published On</th>
                  <th className="px-4 py-3 font-semibold truncate">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-500">
    {courses && courses.length > 0 ? (
      courses.map((course) => (
        <tr 
        
          key={course.code}
          
          className="border-b border-gray-500/20 cursor-pointer hover:bg-gray-100"
          onClick={() => navigate(`/course/${course.code}`)}
        >
          
          <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
            <img src={course.image} alt="Course" className="w-16" />
            <span className="truncate hidden md:block">{course.title}</span>
          </td>
          <td className="px-4 py-3">
            {currency} {Math.floor(course.students.length * course.course_price)}
          </td>
          <td className="px-4 py-3">{course.students.length}</td>
          <td className="px-4 py-3">{new Date(course.created_at).toLocaleDateString()}</td>
          <td className="px-4 py-3 flex space-x-3">
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded-md text-xs"
              onClick={(e) => {
                e.stopPropagation(); // Prevent row click
                editCourse(course.code);
              }}
            >
              Edit
            </button>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded-md text-xs"
              onClick={(e) => {
                e.stopPropagation(); // Prevent row click
                deleteCourse(course.code);
              }}
            >
              Delete
            </button>
            <button
    className="bg-green-600 text-white px-3 py-1 rounded-md text-xs"
    onClick={(e) => {
      e.stopPropagation(); // Prevent row click
      navigate(`/educator/${course._id}/add-lesson`);
    }}
  >
    Add Lesson
  </button>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="5" className="px-4 py-3 text-center text-gray-400">
          No courses found
        </td>
      </tr>
    )}
  </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  export default MyCourses;