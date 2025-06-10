const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course', // Reference to the Course model
    required: [true, 'Course ID is required'],
    // validate: {
    //   validator: async function(value) {
    //     // Ensure that the provided course_id exists in the Course collection
    //     const course = await mongoose.model('Course').findById(value);
    //     return course !== null;
    //   },
    //   message: 'Invalid Course ID, it must exist in the database'
    // }
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    minlength: [5, 'Title must be at least 5 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    minlength: [10, 'Content must be at least 10 characters long'],
    maxlength: [1000, 'Content cannot exceed 1000 characters']
  },
  video_url: {
    type: String,
    required: [true, 'Video URL is required'],
    // match: [/^(https?:\/\/)([a-z0-9]+[.])*([a-z]{2,})/, 'Invalid video URL format'] // Validates URL format
  },
  duration: {
    type: String,
    required: [true, 'Duration is required'],
    // match: [/^\d+:\d{2}$/, 'Duration must be in the format MM:SS (minutes:seconds)']
  },
  video_number: {
    type: Number,
    required: [true, 'Video number is required'],
    min: [1, 'Video number must be at least 1'],
    max: [10000, 'Video number cannot exceed 10000']
  },
  viewers: {
    type: Number,
    default: 0,
    min: [0, 'Viewers cannot be negative']
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  

});

// Add a pre-save hook to update the `created_at` field if it's being modified
lessonSchema.pre('save', function(next) {
  if (this.isModified('created_at')) {
    this.created_at = Date.now();
  }
  next();
});

module.exports = mongoose.model('Lesson', lessonSchema);
