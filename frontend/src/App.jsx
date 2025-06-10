// Your App.js
// import { Outlet, Link, useLocation } from 'react-router-dom';
// import { FaHome, FaUsers, FaClipboardList, FaSignOutAlt } from 'react-icons/fa';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { useEffect, useState } from 'react'; // ✅ You forgot this
// import Cookies from "js-cookie";
import Home from './components/pages/student/Home';
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import RoleBasedDashboard from "./routes/RoleBasedDashboard"
import ProtectedRoute from "./routes/ProtectedRoute"
import AdminDashboard from "./components/pages/Admin/adminDashboard";
import OrganizerDashboard from './components/pages/educator/Dashboard';
// import LoggedInNavbar from './components/student/LoggedInNavbar';
// import Navbar from './components/student/Navbar';
import CoursesList from './components/pages/student/coursesList';
import MyEnrollments from './components/pages/student/MyEnrollments';
// import Player from './components/pages/student/Player';
// import Loading from './components/student/Loading';
// import Educator from './components/pages/educator/Educator';
// import AddCourse from './components/pages/educator/AddCourse';
// import MyCourses from './components/pages/educator/MyCourses';
// import StudentsEnrolled from './components/pages/educator/StudentsEnrolled';
// import PendingCourses from "./components/pages/Admin/pendingcourses";
import CourseDetails from "./components/pages/courses/coursedetails";
// import AddLesson from "./components/pages/educator/add_lesson";
// import CourseLessonsPage from "./components/pages/student/lesson_page";
// import "quill/dist/quill.snow.css";
const App = () => {
  return (
    <Routes>
      
      {/* public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/courses" element={<CoursesList />} />

      <Route path="/dashboard" element={<RoleBasedDashboard />} />
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute element={<AdminDashboard />} allowedRoles={['admin']} />
        }
      />
      <Route
        path="/organizer-dashboard"
        element={
          <ProtectedRoute element={<OrganizerDashboard />} allowedRoles={['instructor']} />
        }
      />
      <Route
        path="/user-dashboard"
        element={
          <ProtectedRoute element={<Home />} allowedRoles={['student']} />
        }
      />
      {/* user routes */}
      <Route
        path="/my-enrollments"
        element={<ProtectedRoute element={<MyEnrollments />} allowedRoles={['student']} />}
      />

        <Route
        path="/course/:id"
        element={<ProtectedRoute element={<CourseDetails />} allowedRoles={['student']} />}
      />
      </Routes>

  );
};



export default App;
