import { useParams } from "react-router-dom";
import { useState, useRef } from "react";

const AddLesson = () => {
  const { _id } = useParams();
  const [lesson, setLesson] = useState({
    title: "",
    content: "",
    duration: "",
  });
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // SVG Icons as components
  const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  );

  const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const FileTextIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  const VideoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );

  const validateForm = () => {
    const newErrors = {};
    if (!lesson.title.trim()) newErrors.title = "Title is required";
    if (!lesson.content.trim()) newErrors.content = "Content is required";
    if (!lesson.duration.trim()) newErrors.duration = "Duration is required";
    if (!videoFile) newErrors.video = "Video file is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("title", lesson.title);
      formData.append("content", lesson.content);
      formData.append("duration", lesson.duration);
      formData.append("video", videoFile);

      const res = await fetch(`http://localhost:5000/api/course/lessons/${_id}`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (data.status === "Success") {
        setSuccess(true);
        // Reset form on success
        setLesson({
          title: "",
          content: "",
          duration: "",
        });
        setVideoFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert(data.message || "Error adding lesson");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading video");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Basic validation for video files
      const validTypes = ["video/mp4", "video/webm", "video/ogg"];
      if (!validTypes.includes(file.type)) {
        setErrors({ ...errors, video: "Please upload a valid video file (MP4, WebM, or OGG)" });
        return;
      }
      
      // Check file size (e.g., 100MB limit)
      if (file.size > 100 * 1024 * 1024) {
        setErrors({ ...errors, video: "File size must be less than 100MB" });
        return;
      }
      
      setVideoFile(file);
      setErrors({ ...errors, video: "" });
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Lesson</h2>
      
      {success && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          Lesson added successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Field */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <FileTextIcon /> Lesson Title
          </label>
          <input
            type="text"
            id="title"
            placeholder="Introduction to React"
            value={lesson.title}
            onChange={(e) => setLesson({ ...lesson, title: e.target.value })}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.title ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        {/* Video Upload */}
        <div>
          <label htmlFor="video" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <VideoIcon /> Lesson Video
          </label>
          <div className={`border-2 border-dashed rounded-lg p-6 text-center ${errors.video ? "border-red-500" : "border-gray-300"}`}>
            <input
              type="file"
              id="video"
              ref={fileInputRef}
              accept="video/mp4,video/webm,video/ogg"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100"
            >
              <UploadIcon />
              {videoFile ? videoFile.name : "Select Video File"}
            </button>
            <p className="mt-2 text-sm text-gray-500">MP4, WebM, or OGG. Max 100MB.</p>
            {errors.video && <p className="mt-2 text-sm text-red-600">{errors.video}</p>}
          </div>
        </div>

        {/* Duration Field */}
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <ClockIcon /> Duration
          </label>
          <input
            type="text"
            id="duration"
            placeholder="e.g. 10:30 or 45 min"
            value={lesson.duration}
            onChange={(e) => setLesson({ ...lesson, duration: e.target.value })}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.duration ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration}</p>}
        </div>

        {/* Content Field */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Lesson Content
          </label>
          <textarea
            id="content"
            placeholder="Detailed lesson description and notes..."
            value={lesson.content}
            onChange={(e) => setLesson({ ...lesson, content: e.target.value })}
            rows={5}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.content ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={uploading}
            className={`px-6 py-3 rounded-lg text-white font-medium ${uploading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"} transition-colors flex items-center`}
          >
            {uploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </>
            ) : (
              "Add Lesson"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddLesson;