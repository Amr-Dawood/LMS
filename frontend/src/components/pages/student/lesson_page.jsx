import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../../student/Loading";

const CourseLessonsPage = () => {
    const { id } = useParams();
    const [lessons, setLessons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [courseTitle, setCourseTitle] = useState("Course Lessons");
    const [expandedLesson, setExpandedLesson] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`http://localhost:5000/api/course/lessons/${id}` , {
                    withCredentials: true,
                  });;
                
                if (response.data?.data?.lessonsOnly) {
                    const validLessons = response.data.data.lessonsOnly
                        .filter(lesson => lesson !== null)
                        .map(lesson => ({
                            ...lesson,
                            video_url: lesson.video_url?.replace(/\\/g, '/')
                        }));
                    
                    setLessons(validLessons);
                }
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLessons();
    }, [id]);

    const toggleExpandLesson = (lessonId) => {
        setExpandedLesson(expandedLesson === lessonId ? null : lessonId);
    };

    const filteredLessons = lessons.filter(lesson =>
        lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lesson.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) return <Loading />;

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{courseTitle}</h1>
                    <p className="text-gray-600 mt-2">
                        {lessons.length} lessons available
                    </p>
                </div>
                
                {/* Search Bar */}
                <div className="w-full md:w-64">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search lessons..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="absolute left-3 top-2.5 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            {filteredLessons.length > 0 ? (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                    {/* Lessons List Header */}
                    <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-800">
                            All Lessons
                        </h2>
                        <div className="text-sm text-gray-500">
                            Showing {filteredLessons.length} of {lessons.length} lessons
                        </div>
                    </div>

                    {/* Lessons List */}
                    <div className="divide-y divide-gray-200">
                        {filteredLessons.map((lesson, index) => (
                            <div 
                                key={lesson._id || index} 
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <div 
                                    className="p-5 cursor-pointer flex justify-between items-center"
                                    onClick={() => toggleExpandLesson(lesson._id)}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900">
                                                {index + 1}. {lesson.title}
                                            </h3>
                                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                                                {lesson.duration && (
                                                    <span className="flex items-center gap-1">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        {lesson.duration}
                                                    </span>
                                                )}
                                                {lesson.video_number && (
                                                    <span>Video #{lesson.video_number}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-gray-400">
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            className={`h-5 w-5 transform transition-transform ${expandedLesson === lesson._id ? 'rotate-180' : ''}`}
                                            viewBox="0 0 20 20" 
                                            fill="currentColor"
                                        >
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Expanded Lesson Content */}
                                {expandedLesson === lesson._id && (
                                    <div className="px-5 pb-5 ml-16">
                                        {lesson.content && (
                                            <div className="prose prose-sm max-w-none text-gray-600 mb-4">
                                                <p>{lesson.content}</p>
                                            </div>
                                        )}
                                        
                                        {lesson.video_url && (
                                            <div className="mb-4">
                                                <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden">
                                                    <video 
                                                        controls 
                                                        className="w-full"
                                                        poster="/placeholder-video.jpg"
                                                    >
                                                        <source 
                                                            src={`http://localhost:5000/${lesson.video_url}`} 
                                                            type="video/mp4" 
                                                        />
                                                        Your browser does not support the video tag.
                                                    </video>
                                                </div>
                                            </div>
                                        )}
                                        
                                        <div className="flex flex-wrap gap-3">
                                            {lesson.video_url && (
                                                <a 
                                                    href={`http://localhost:5000/${lesson.video_url}`} 
                                                    download
                                                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                    </svg>
                                                    Download Video
                                                </a>
                                            )}
                                            <button className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                                                Mark as Complete
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center py-12">
                    {searchTerm ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="mt-4 text-lg font-medium text-gray-900">No lessons found</h3>
                            <p className="mt-1 text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
                            <button 
                                onClick={() => setSearchTerm("")}
                                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                            >
                                Clear search
                            </button>
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="mt-4 text-lg font-medium text-gray-900">No lessons available</h3>
                            <p className="mt-1 text-gray-500">This course doesn't have any lessons yet.</p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default CourseLessonsPage;