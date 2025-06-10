import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../../../context/AppContext";
import { assets } from "../../../assets/assets";
import Loading from "../../student/Loading";

const Dashboard = () => {
  const { currency } = useContext(AppContext);
  const [dashboardData, setDashboardData] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/user/", {
        withCredentials: true, // Enables sending cookies with the request
      });

      if (response.data && response.data.status === "Success") {
        setDashboardData(response.data.data); // Accessing `data.getuser`
      } else {
        console.error("Unexpected API response:", response.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return dashboardData ? (
    <div className="min-h-screen flex flex-col items-start justify-between gap-8 md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="space-y-5">
        <div className="flex flex-wrap gap-5 items-center">
          <div className="flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md">
            <img src={assets.patients_icon} alt="patient_icon" />
            <div>
              <p className="text-2xl font-medium text-gray-600">{dashboardData.Total_Enrollments || 0}</p>
              <p className="text-base text-gray-500">Total Enrollments</p>
            </div>
          </div>

          <div className="flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md">
            <img src={assets.appointments_icon} alt="patient_icon" />
            <div>
              <p className="text-2xl font-medium text-gray-600">{dashboardData.Total_Courses || 0}</p>
              <p className="text-base text-gray-500">Total Courses</p>
            </div>
          </div>

          <div className="flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md">
            <img src={assets.earning_icon} alt="patient_icon" />
            <div>
              <p className="text-2xl font-medium text-gray-600">
                {currency} {dashboardData.totalEarnings || 0}
              </p>
              <p className="text-base text-gray-500">Total Earnings</p>
            </div>
          </div>
        </div>

        {/* Latest Enrollments */}
        <div>
          <h2 className="pb-4 text-lg font-medium">Latest Enrollments</h2>
          <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
            <table className="table-fixed md:table-auto w-full overflow-hidden">
              <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell">#</th>
                  <th className="px-4 py-3 font-semibold">Student Name</th>
                  <th className="px-4 py-3 font-semibold">Course Title</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-500">
                {dashboardData.enrolledCourses && dashboardData.enrolledCourses.length > 0 ? (
                  dashboardData.enrolledCourses.map((item, index) => (
                    <tr key={index} className="border-b border-gray-500/20">
                      <td className="px-4 py-3 text-center hidden sm:table-cell">{index + 1}</td>
                      <td className="md:px-4 px-2 py-3 flex items-center space-x-3">
                        <img
                          src={dashboardData.avatar || "../uploads/profile.png"}
                          alt="profile"
                          className="w-9 h-9 rounded-full"
                        />
                        <span className="truncate">{dashboardData.first_name} {dashboardData.last_name}</span>
                      </td>
                      <td className="px-4 py-3 truncate">{item.course_id}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-4 text-gray-500">
                      No enrollments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Dashboard;
