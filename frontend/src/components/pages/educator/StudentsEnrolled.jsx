import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../../student/Loading";

const StudentsEnrolled = () => {
  const [user, setUser] = useState(null); // Store user data
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/auth_me", {
          withCredentials: true,
        });

        console.log("Current User Data:", response.data);
        if (response.data.success && response.data.user) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchEnrolledStudents = async () => {
      try {
        if (!user || user.role !== "instructor") {
          console.warn("User is not an instructor. Skipping API call.");
          return;
        }

        console.log("Fetching enrolled students...");
        const response = await axios.get("http://localhost:5000/api/course/getinstructorenrollment", {
          withCredentials: true,
        });

        console.log("Enrolled Students Data:", response.data);

        const { message } = response.data;
        const formattedStudents = message.map((enrollment, index) => ({
          id: index + 1,
          studentName: enrollment.student_id?.username || "Unknown",
          studentImage: enrollment.student_id?.imageUrl || "/default-avatar.png",
          courseTitle: enrollment.course_id?.title || "Unknown Course",
          enrollmentDate: new Date(enrollment.enrollment_date).toLocaleDateString(),
        }));

        setEnrolledStudents(formattedStudents);
      } catch (error) {
        console.error("Error fetching enrolled students:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchEnrolledStudents();
    }
  }, [user]); // Runs only when user data is available

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
        <table className="table-fixed md:table-auto w-full overflow-hidden pb-4">
          <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
            <tr>
              <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell">#</th>
              <th className="px-4 py-3 font-semibold">Student Name</th>
              <th className="px-4 py-3 font-semibold">Course Title</th>
              <th className="px-4 py-3 font-semibold hidden sm:table-cell">Enrollment Date</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-500">
            {enrolledStudents.map((item) => (
              <tr key={item.id} className="border-b border-gray-500/20">
                <td className="px-4 py-3 text-center hidden sm:table-cell">{item.id}</td>
                <td className="md:px-4 px-2 py-3 flex items-center space-x-3">
                  <img src={item.studentImage} alt="" className="w-9 h-9 rounded-full" />
                  <span className="truncate">{item.studentName}</span>
                </td>
                <td className="px-4 py-3 truncate">{item.courseTitle}</td>
                <td className="px-4 py-3 hidden sm:table-cell">{item.enrollmentDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentsEnrolled;
