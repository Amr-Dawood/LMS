const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    minlength: [2, 'Title must be at least 2 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  code: {
    type: String,
    required: [true, 'Course code is required'],
    unique: true, // Ensures the course code is unique for each course
    minlength: [3, 'Course code must be at least 3 characters long'],
    maxlength: [10, 'Course code cannot exceed 10 characters']
  },
  language: {
    type: String,
    required: [true, 'Language is required'],
    enum: ['English', 'Spanish', 'French', 'German', 'Arabic'], // Add more languages as required
    message: 'Language must be one of: English, Spanish, French, German, or Arabic'
  },
  course_lesson: {
    type: Number,
    default: 0,
    min: [0, 'Course must have at least 1 lesson'],
    max: [100, 'Course cannoxt have more than 100 lessons']
  },
  course_hour: {
    type: Number,
    required: [true, 'Course hours are required'],
    min: [1, 'Course must have at least 1 hour'],
    max: [500, 'Course cannot have more than 500 hours']
  },
  course_level: {
    type: String,
    required: [true, 'Course level is required'],
    enum: ['beginner', 'intermediate', 'advanced'], // You can add more levels as required
    message: 'Course level must be one of: beginner, intermediate, or advanced'
  },
  course_price: {
    type: Number,
    required: [true, 'Course price is required'],
    min: [0, 'Course price must be at least 0'],
    validate: {
      validator: function(value) {
        return value >= 0;
      },
      message: 'Course price must be a positive number'
    }
  },
  reviews: [{
    username: { type: String, }, // Store the username of the reviewer
    review: { type: String, maxlength: 500, } // The review text
}],
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [10, 'Description must be at least 10 characters long'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  instructor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User_schema', // Reference to the User schema for the instructor
    required: [true, 'Instructor ID is required'],
    // validate: {
    //   validator: async function(value) {
    //     // Check if instructor_id exists in the User schema
    //     const instructor = await mongoose.model('User_schema').findById(value);
    //     return instructor !== null; // Ensure the instructor exists
    //   },
    //   message: 'Instructor ID is invalid or does not exist'
    // }
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User_schema' }], // Student referen
  lessons: [{lesson_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: false },}],
  category: {type: String},
  video: { type: String },
  image: { type: String },
  
});

// Add a pre-save hook to update the `updated_at` field when a course is updated
courseSchema.pre('save', function(next) {
  if (this.isModified()) {
    this.updated_at = Date.now();
  }
  next();
});

module.exports = mongoose.model('Course_schema', courseSchema);
