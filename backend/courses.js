const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/courses', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB Connected');
}).catch(err => {
  console.error('MongoDB Connection Error:', err);
});

// Define Course Schema
const courseSchema = new mongoose.Schema({
  title: String,
  code: String,
  language: String,
  course_lesson: Number,
  course_hour: Number,
  course_level: String,
  course_price: Number,
  Comments: String,
  description: String,
  instructor_id: mongoose.Schema.Types.ObjectId,
  created_at: Date,
  updated_at: Date
});

// Create Model
const Course = mongoose.model('Course', courseSchema);

// Sample JSON Data
const courses = [
  {
    "title": "Introduction to JavaScript",
    "code": "JS101",
    "language": "English",
    "course_lesson": 12,
    "course_hour": 24,
    "course_level": "beginner",
    "course_price": 49.99,
    "Comments": "This course is great for beginners.",
    "description": "A comprehensive introduction to JavaScript programming, covering the basics and some advanced concepts.",
    "instructor_id": "65c255b0a1d2f0f8a3c4d5e6",
    "created_at": new Date(),
    "updated_at": new Date()
  },
  {
    "title": "Advanced Python Programming",
    "code": "PY202",
    "language": "English",
    "course_lesson": 20,
    "course_hour": 40,
    "course_level": "advanced",
    "course_price": 79.99,
    "Comments": "Perfect for experienced developers.",
    "description": "This course dives into advanced Python concepts, including data structures, algorithms, and best practices.",
    "instructor_id": "65c255b0a1d2f0f8a3c4d5e7",
    "created_at": new Date(),
    "updated_at": new Date()
  },
  {
    "title": "Web Development with React",
    "code": "WD301",
    "language": "English",
    "course_lesson": 15,
    "course_hour": 35,
    "course_level": "intermediate",
    "course_price": 59.99,
    "Comments": "Includes hands-on projects.",
    "description": "Learn how to build modern web applications using React.js, covering components, hooks, and state management.",
    "instructor_id": "65c255b0a1d2f0f8a3c4d5e8",
    "created_at": new Date(),
    "updated_at": new Date()
  },
  {
    "title": "Cybersecurity Fundamentals",
    "code": "SEC101",
    "language": "English",
    "course_lesson": 18,
    "course_hour": 50,
    "course_level": "beginner",
    "course_price": 69.99,
    "Comments": "Great for aspiring security professionals.",
    "description": "A beginner-friendly course covering cybersecurity principles, ethical hacking, and network security.",
    "instructor_id": "65c255b0a1d2f0f8a3c4d5e9",
    "created_at": new Date(),
    "updated_at": new Date()
    },
    {
    "title": "Machine Learning with Python",
    "code": "ML401",
    "language": "English",
    "course_lesson": 25,
    "course_hour": 60,
    "course_level": "advanced",
    "course_price": 99.99,
    "Comments": "Hands-on projects with real-world data.",
    "description": "Learn machine learning algorithms, data preprocessing, and model evaluation using Python.",
    "instructor_id": "65c255b0a1d2f0f8a3c4d5f0",
    "created_at": new Date(),
    "updated_at": new Date()
  }
];

// Insert Data into MongoDB
Course.insertMany(courses)
  .then(() => {
    console.log('Courses inserted successfully');
    mongoose.connection.close(); // Close DB connection after insertion
  })
  .catch(err => {
    console.error('Error inserting courses:', err);
    mongoose.connection.close();
  });
