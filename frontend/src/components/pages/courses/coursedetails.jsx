import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../../student/Loading";
import Footer from "../../student/Footer";
import { assets } from "../../../assets/assets";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [courseData, setCourseData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [isEnrolling, setIsEnrolling] = useState(false);
    const [isEnrolled, setIsEnrolled] = useState(false);

    const fetchCourseData = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/course/singel/${id}`);
            const result = await response.json();

            if (result.status === "Success" && result.data) {
                setCourseData(result.data);
                // Check if user is already enrolled
                // checkEnrollmentStatus(result.data._id);
            } else {
                console.error("Error fetching course data:", result);
                navigate("/not-found", { replace: true });
            }
        } catch (error) {
            console.error("Fetch error:", error);
            navigate("/error", { replace: true });
        } finally {
            setIsLoading(false);
        }
    };

    // const checkEnrollmentStatus = async (courseId) => {
    //     try {
    //         const response = await axios.get(
    //             `http://localhost:5000/api/course/${courseId}/enrollment-status`,
    //             { withCredentials: true }
    //         );
    //         setIsEnrolled(response.data.isEnrolled);
    //     } catch (error) {
    //         console.error("Error checking enrollment status:", error);
    //     }
    // };

    const handleEnroll = async () => {
        if (!courseData?._id) return;
      
        setIsEnrolling(true);
      
        try {
          if (courseData.price === 0) {
            // 👉 Free course - enroll directly
            const response = await axios.post(
              `http://localhost:5000/api/course/${courseData._id}/enroll`,
              {},
              { withCredentials: true }
            );
      
            alert(response.data.message || "Enrolled successfully!");
            setIsEnrolled(true);
            fetchCourseData();
      
          } else {
            // 👉 Paid course - go to Stripe checkout
            const stripe = await stripePromise;
            const storedUser = JSON.parse(localStorage.getItem("user"));
const token = storedUser?.token;

const response = await axios.post(
  `http://localhost:5000/api/course/purchese/${courseData._id}`,
  {},
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      
            if (response.data.message) {
              window.location.href = response.data.message;
            } else {
              throw new Error("No session URL returned from server");
            }
          }
        } catch (error) {
          alert(error.response?.data?.message || "Enrollment failed!");
          console.error("Error enrolling:", error);
      
          if (error.response?.status === 401) {
            navigate("/login", { state: { from: `/course/${id}` } });
          }
        } finally {
          setIsEnrolling(false);
        }
      };
      

    useEffect(() => {
        fetchCourseData();
    }, [id]);

    const calculateRating = (course) => {
        if (!course || !course.reviews || course.reviews.length === 0) return 0;
        const totalRating = course.reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
        return (totalRating / course.reviews.length).toFixed(1);
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<img key={i} src={assets.star} alt="star" className="w-4 h-4" />);
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(<img key={i} src={assets.star_half} alt="half star" className="w-4 h-4" />);
            } else {
                stars.push(<img key={i} src={assets.star_blank} alt="empty star" className="w-4 h-4" />);
            }
        }
        return stars;
    };

    if (isLoading) return <Loading />;
    if (!courseData) return <p className="text-center mt-10 text-gray-600">Course not found</p>;

    return (
        <>
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-blue-50 to-cyan-50 py-12 md:py-20">
                <div className="container mx-auto px-4 md:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Left Column - Course Info */}
                        <div className="flex-1 z-10">
                            <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium mb-4">
                                {courseData.category || "Course"}
                            </div>
                            
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                                {courseData?.title || "Course Title Not Available"}
                            </h1>
                            
                            <p className="text-gray-600 mb-6">
                                {showFullDescription ? courseData.description : `${courseData.description?.slice(0, 200)}...`}
                                {courseData.description?.length > 200 && (
                                    <button 
                                        onClick={() => setShowFullDescription(!showFullDescription)}
                                        className="text-blue-600 ml-2 font-medium"
                                    >
                                        {showFullDescription ? "Show less" : "Read more"}
                                    </button>
                                )}
                            </p>

                            {/* Instructor Info */}
                            <div className="flex items-center mb-6">
                                <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center mr-3">
                                    <span className="text-blue-800 font-medium">
                                        {courseData?.instructor_id?.username?.charAt(0)?.toUpperCase() || "U"}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Created by</p>
                                    <p className="font-medium text-gray-800">
                                        {courseData?.instructor_id?.username || "Unknown Instructor"}
                                    </p>
                                </div>
                            </div>

                            {/* Rating and Students */}
                            <div className="flex flex-wrap items-center gap-4 mb-6">
                                <div className="flex items-center">
                                    <div className="flex mr-1">
                                        {renderStars(calculateRating(courseData))}
                                    </div>
                                    <span className="ml-1 text-gray-700 font-medium">
                                        {calculateRating(courseData)}
                                    </span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <img src={assets.users_icon} alt="students" className="w-4 h-4 mr-1" />
                                    <span>{courseData?.students?.length || 0} students</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <img src={assets.book_icon} alt="lessons" className="w-4 h-4 mr-1" />
                                    <span>{courseData?.course_lesson || 0} lessons</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Course Card */}
                        <div className="w-full md:w-96 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 sticky top-24">
                            {courseData?.thumbnail && (
                                <div className="relative h-48 bg-gray-200 overflow-hidden">
                                    <img 
                                        src={`http://localhost:5000/${courseData.thumbnail}`} 
                                        alt={courseData.title}
                                        className="w-full h-full object-cover"
                                    />
                                    {courseData.video && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <button className="bg-white p-4 rounded-full shadow-lg hover:bg-blue-50 transition-all">
                                                <img src={assets.play_icon} alt="play" className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-2xl font-bold text-gray-900">
                                        ${courseData.course_price || "Free"}
                                    </span>
                                    {courseData.discount && (
                                        <span className="text-sm line-through text-gray-500">
                                            ${courseData.discount}
                                        </span>
                                    )}
                                </div>
                                
                                <button 
  onClick={handleEnroll}
  disabled={isEnrolling || isEnrolled}
  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors mb-4 ${
      isEnrolled 
        ? "bg-green-600 text-white cursor-default"
        : isEnrolling
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
  }`}
>
  {isEnrolled 
    ? "Already Enrolled" 
    : isEnrolling 
        ? "Enrolling..." 
        : "Enroll Now"}
</button>

                                
                                <div className="text-center text-sm text-gray-500 mb-4">
                                    <p>30-Day Money-Back Guarantee</p>
                                </div>
                                
                                <div className="space-y-3">
                                    <div className="flex items-center text-gray-700">
                                        <img src={assets.clock_icon} alt="duration" className="w-4 h-4 mr-2" />
                                        <span>{courseData.course_hour || 0} hours on-demand video</span>
                                    </div>
                                    <div className="flex items-center text-gray-700">
                                        <img src={assets.book_icon} alt="lessons" className="w-4 h-4 mr-2" />
                                        <span>{courseData.course_lesson || 0} lessons</span>
                                    </div>
                                    <div className="flex items-center text-gray-700">
                                        <img src={assets.level_icon} alt="level" className="w-4 h-4 mr-2" />
                                        <span>{courseData.course_level || "All levels"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Course Content Section */}
            <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="border-b border-gray-200 mb-6">
                            <nav className="flex space-x-8">
                                <button
                                    onClick={() => setActiveTab("overview")}
                                    className={`py-4 px-1 font-medium text-sm border-b-2 ${activeTab === "overview" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                                >
                                    Overview
                                </button>
                                <button
                                    onClick={() => setActiveTab("curriculum")}
                                    className={`py-4 px-1 font-medium text-sm border-b-2 ${activeTab === "curriculum" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                                >
                                    Curriculum
                                </button>
                                <button
                                    onClick={() => setActiveTab("reviews")}
                                    className={`py-4 px-1 font-medium text-sm border-b-2 ${activeTab === "reviews" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                                >
                                    Reviews
                                </button>
                            </nav>
                        </div>

                        {activeTab === "overview" && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">What you'll learn</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {courseData.learning_outcomes?.map((outcome, index) => (
                                            <div key={index} className="flex items-start">
                                                <img src={assets.check_icon} alt="check" className="w-5 h-5 mr-2 mt-0.5" />
                                                <span className="text-gray-700">{outcome}</span>
                                            </div>
                                        )) || (
                                            <p className="text-gray-500">No learning outcomes specified</p>
                                        )}
                                    </div>
                                </div>

                                {courseData?.video && (
                                    <div className="mt-8">
                                        <h3 className="text-xl font-bold text-gray-900 mb-4">Course Preview</h3>
                                        <div className="rounded-lg overflow-hidden shadow-md">
                                            <video
                                                controls
                                                width="100%"
                                                className="w-full"
                                                poster={courseData.thumbnail ? `http://localhost:5000/${courseData.thumbnail}` : undefined}
                                                src={`http://localhost:5000/${courseData.video}`}
                                            >
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-8">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Course Details</h3>
                                    <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
                                        <div className="flex items-center">
                                            <img src={assets.code_icon} alt="code" className="w-5 h-5 mr-3" />
                                            <div>
                                                <p className="text-sm text-gray-500">Course Code</p>
                                                <p className="font-medium">{courseData.code || "N/A"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <img src={assets.language_icon} alt="language" className="w-5 h-5 mr-3" />
                                            <div>
                                                <p className="text-sm text-gray-500">Language</p>
                                                <p className="font-medium">{courseData.language || "N/A"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <img src={assets.level_icon} alt="level" className="w-5 h-5 mr-3" />
                                            <div>
                                                <p className="text-sm text-gray-500">Level</p>
                                                <p className="font-medium">{courseData.course_level || "N/A"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <img src={assets.category_icon} alt="category" className="w-5 h-5 mr-3" />
                                            <div>
                                                <p className="text-sm text-gray-500">Category</p>
                                                <p className="font-medium">{courseData.category || "N/A"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

 {activeTab === "curriculum" && (
    <div>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Course Curriculum</h3>
            <button 
                onClick={() => navigate(`/course/${courseData._id}/lessons`)}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
                View All Lessons
            </button>
        </div>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* ... existing curriculum content ... */}
        </div>
    </div>
)}

                        {activeTab === "reviews" && (
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Student Reviews</h3>
                                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                                    <div className="flex items-center mb-4">
                                        <div className="text-4xl font-bold mr-4">{calculateRating(courseData)}</div>
                                        <div>
                                            <div className="flex mb-1">
                                                {renderStars(calculateRating(courseData))}
                                            </div>
                                            <p className="text-gray-600">
                                                Course Rating • {courseData?.reviews?.length || 0} reviews
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {courseData.reviews?.length > 0 ? (
                                        courseData.reviews.map((review, index) => (
                                            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                                                <div className="flex justify-between mb-2">
                                                    <div className="font-medium">{review.user?.name || "Anonymous"}</div>
                                                    <div className="flex">
                                                        {renderStars(review.rating)}
                                                    </div>
                                                </div>
                                                <p className="text-gray-600 text-sm mb-2">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </p>
                                                <p className="text-gray-700">{review.comment}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            No reviews yet. Be the first to review this course!
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Instructor Section */}
            {courseData?.instructor_id && (
                <div className="bg-gray-50 py-12">
                    <div className="container mx-auto px-4 md:px-6 lg:px-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">About the Instructor</h2>
                        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 flex flex-col md:flex-row gap-6">
                            <div className="flex-shrink-0">
                                <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                                    <span className="text-3xl text-blue-800 font-medium">
                                        {courseData.instructor_id.username?.charAt(0)?.toUpperCase() || "I"}
                                    </span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {courseData.instructor_id.username}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {courseData.instructor_id.bio || "No bio available"}
                                </p>
                                <div className="flex flex-wrap gap-4 text-sm">
                                    <div className="flex items-center">
                                        <img src={assets.users_icon} alt="students" className="w-4 h-4 mr-2" />
                                        <span>X students</span>
                                    </div>
                                    <div className="flex items-center">
                                        <img src={assets.book_icon} alt="courses" className="w-4 h-4 mr-2" />
                                        <span>X courses</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
};

export default CourseDetails;