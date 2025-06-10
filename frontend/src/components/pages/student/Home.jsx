import { useEffect, useState } from "react";
import axios from "axios";
import { FiSearch, FiClock, FiUsers, FiGlobe, FiStar, FiArrowRight } from "react-icons/fi";
import { FaChalkboardTeacher } from "react-icons/fa";

const Hero = () => (
  <section className="relative py-20 bg-gradient-to-r from-blue-800 to-indigo-900 text-white">
    <div className="container mx-auto px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-md">
        Expand Your Knowledge
      </h1>
      <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-blue-100">
        Learn from industry experts with our comprehensive courses
      </p>
      
      <div className="max-w-xl mx-auto relative">
        <div className="flex items-center bg-white rounded-lg overflow-hidden shadow-lg">
          <input
            type="text"
            placeholder="Search courses, instructors, or topics..."
            className="w-full pl-5 pr-4 py-4 text-gray-800 focus:outline-none"
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 m-1 rounded-md transition-colors">
            <FiSearch className="inline mr-2" />
            Search
          </button>
        </div>
      </div>
      
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {['Web Development', 'Data Science', 'Business', 'Design', 'Marketing'].map((category) => (
          <span 
            key={category}
            className="px-4 py-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full backdrop-blur-sm transition-all cursor-pointer"
          >
            {category}
          </span>
        ))}
      </div>
    </div>
    <div className="absolute bottom-0 left-0 right-0 h-16 bg-white transform skew-y-1 -mb-8 z-10"></div>
  </section>
);

const CourseCard = ({ course }) => {
  const getPriceDisplay = () => {
    if (!course.course_price || course.course_price === 0) return 'FREE';
    return `$${course.course_price.toFixed(2)}`;
  };

  const getButtonText = () => {
    if (!course.course_price || course.course_price === 0) return 'Enroll Now';
    return 'Apply to enroll';
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
      {course.image ? (
        <div className="h-48 overflow-hidden">
          <img 
            src={course.image} 
            alt={course.title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center">
          <FaChalkboardTeacher className="text-blue-500 text-5xl" />
        </div>
      )}
      
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {course.category || "General"}
          </span>
          <div className="flex items-center text-yellow-500">
            <FiStar className="fill-current" />
            <span className="ml-1 text-gray-700 text-sm">4.8</span>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{course.title}</h3>
        <p className="text-gray-600 mb-4 flex items-center">
          <FaChalkboardTeacher className="mr-2 text-blue-500" />
          {course.instructor_id?.username || "Unknown Instructor"}
        </p>
        
        <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-4">
          <span className="flex items-center">
            <FiClock className="mr-1" /> 8 hours
          </span>
          <span className="flex items-center">
            <FiUsers className="mr-1" /> {course.students?.length || 0} students
          </span>
          <span className="flex items-center">
            <FiGlobe className="mr-1" /> {course.language || "English"}
          </span>
        </div>
        
        <div className="mt-auto flex justify-between items-center">
          <span className={`font-bold text-lg ${
            !course.course_price || course.course_price === 0 
              ? 'text-green-600' 
              : 'text-blue-600'
          }`}>
            {getPriceDisplay()}
          </span>
          <button className={`px-4 py-2 rounded-md font-medium flex items-center ${
            !course.course_price || course.course_price === 0 
              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
          }`}>
            {getButtonText()}
            <FiArrowRight className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

const CoursesSection = ({ courses, loading, error, onRetry }) => {
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 text-left">
          <p className="font-medium">{error}</p>
          <button 
            onClick={onRetry}
            className="mt-3 bg-red-500 hover:bg-red-700 text-white font-medium py-2 px-4 rounded inline-flex items-center"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Courses</h2>
            <p className="text-gray-600 mt-2">
              {courses.length} courses to boost your career
            </p>
          </div>
          <button className="mt-4 md:mt-0 px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium">
            View All Courses
          </button>
        </div>
        
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FaChalkboardTeacher className="text-gray-400 text-3xl" />
            </div>
            <h3 className="text-xl font-medium text-gray-700">No courses available</h3>
            <p className="text-gray-500 mt-2">Check back later for new courses</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {courses.map(course => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const StatsSection = () => (
  <section className="py-16 bg-gray-50">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div className="p-6">
          <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
          <div className="text-gray-600">Students Enrolled</div>
        </div>
        <div className="p-6">
          <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
          <div className="text-gray-600">Courses Available</div>
        </div>
        <div className="p-6">
          <div className="text-4xl font-bold text-blue-600 mb-2">200+</div>
          <div className="text-gray-600">Expert Instructors</div>
        </div>
        <div className="p-6">
          <div className="text-4xl font-bold text-blue-600 mb-2">95%</div>
          <div className="text-gray-600">Satisfaction Rate</div>
        </div>
      </div>
    </div>
  </section>
);

const TestimonialsSection = () => (
  <section className="py-16 bg-white">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What Our Students Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-gray-50 p-6 rounded-xl">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-4">
                {item}
              </div>
              <div>
                <h4 className="font-medium">Student Name</h4>
                <div className="flex text-yellow-400">
                  <FiStar className="fill-current" />
                  <FiStar className="fill-current" />
                  <FiStar className="fill-current" />
                  <FiStar className="fill-current" />
                  <FiStar className="fill-current" />
                </div>
              </div>
            </div>
            <p className="text-gray-600">
              "This platform transformed my career. The courses are well-structured and the instructors are knowledgeable."
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("http://localhost:5000/api/course");
      
      // Handle the specific API response structure
      const coursesData = Array.isArray(response?.data?.course) ? response.data.course : [];
      setCourses(coursesData);
      
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load courses. Please try again later.");
      console.error("Failed to load courses", err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <CoursesSection 
        courses={courses} 
        loading={loading} 
        error={error} 
        onRetry={fetchCourses} 
      />
      <StatsSection />
      <TestimonialsSection />
    </div>
  );
};

export default Home;