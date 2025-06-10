import Quill from "quill";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

const AddCourse = () => {
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("English");
  const [course_lesson, setCourseLesson] = useState(0);
  const [course_hour, setCourseHour] = useState(0);
  const [course_level, setCourseLevel] = useState("beginner");
  const [course_price, setCoursePrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [instructor_id, setInstructorId] = useState("");
  const [loading, setLoading] = useState(false);
  const [video, setVideo] = useState(null);
const [image, setImage] = useState(null);


  // Fetch the logged-in user's instructor ID when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/auth_me", {
          withCredentials: true,
        });
        if (response.data && response.data._id) {
          setInstructorId(response.data._id);
        }
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: "snow" });
      quillRef.current.on("text-change", () => {
        setDescription(quillRef.current.root.innerHTML);
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!title || !code || !language || course_lesson <= 0 || course_hour <= 0 || !course_level || course_price <= 0 || !description || !category || !video || !image) {
      alert("Please fill in all required fields and upload files.");
      return;
    }
  
    setLoading(true);
  
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("code", code);
      formData.append("language", language);
      formData.append("course_lesson", course_lesson);
      formData.append("course_hour", course_hour);
      formData.append("course_level", course_level);
      formData.append("course_price", course_price);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("instructor_id", instructor_id);
      formData.append("video", video);
      formData.append("image", image);
  
      const response = await axios.post("http://localhost:5000/api/course", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
  
      if (response.status === 201 || response.status === 200) {
        alert("Course added successfully!");
      } else {
        alert("Unexpected response from server.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add course");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="h-screen overflow-scroll flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md w-full text-gray-500">
        <input type="text" placeholder="Course Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input type="text" placeholder="Course Code" value={code} onChange={(e) => setCode(e.target.value)} required />
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
          <option value="French">French</option>
          <option value="German">German</option>
          <option value="Arabic">Arabic</option>
        </select>
        <input type="number" placeholder="Course Lesson" value={course_lesson} onChange={(e) => setCourseLesson(Number(e.target.value))} required />
        <input type="number" placeholder="Course Hour" value={course_hour} onChange={(e) => setCourseHour(Number(e.target.value))} required />
        <select value={course_level} onChange={(e) => setCourseLevel(e.target.value)}>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <input type="number" placeholder="Course Price" value={course_price} onChange={(e) => setCoursePrice(Number(e.target.value))} required />
        <div ref={editorRef}></div>
        <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} required />
        <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} required />
<input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} required />

        <button type="submit" disabled={loading} className="bg-blue-500 text-white p-2 rounded">
          {loading ? "Submitting..." : "Add Course"}
        </button>
      </form>
    </div>
  );
};

export default AddCourse;
