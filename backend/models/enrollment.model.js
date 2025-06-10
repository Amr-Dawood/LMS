const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course_schema', // Reference to Course model
    required: [true, 'Course ID is required']
  },
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User_schema', // Reference to User model
    required: [true, 'Student ID is required']
  },
  instructor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User_schema', // Reference to User model
    required: [true, 'instructor ID is required']
  },
  enrollment_duration: {
    type: Number,
    required: [true, 'Enrollment duration is required'],
    min: [1, 'Enrollment duration must be at least 1 month'],
    max: [12, 'Enrollment duration cannot exceed 12 months']
  },
  enrollment_end: {
    type: Date,
    // required: true
  },
  enrollment_date: {
    type: Date,
    default: Date.now
  }
});

// Auto-calculate enrollment_end based on duration
enrollmentSchema.pre('save', function (next) {
  if (this.isModified('enrollment_duration')) {
    this.enrollment_end = new Date(this.enrollment_date);
    this.enrollment_end.setMonth(this.enrollment_end.getMonth() + this.enrollment_duration);
  }
  next();
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);
