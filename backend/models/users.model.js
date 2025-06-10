const mongoose = require('mongoose');
const validator = require('validator')
const User_Rules = require('../utils/User_Roles')

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: [true, 'First name is required'],
    minlength: [2, 'First name must be at least 2 characters long'],
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  last_name: {
    type: String,
    required: [true, 'Last name is required'],
    minlength: [2, 'Last name must be at least 2 characters long'],
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  phone_number: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\d{10,15}$/, 'Phone number must be between 10 and 15 digits']
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: [true, 'Gender is required']
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [18, 'Age must be at least 18'],
    max: [100, 'Age cannot exceed 100']
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [20, 'Username cannot exceed 20 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    // match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    validate: [validator.isEmail]
  },
  password_hash: {
    type: String,
    required: [true, 'Password hash is required']
  },
  role: {
    type: String,
    enum: [User_Rules.ADMIN,User_Rules.INSTRUCTOR,User_Rules.STUDENT],
    required: [false
      , 'Role is required'],
    default: User_Rules.STUDENT

  },
  created_at: {
    type: Date,
    default: Date.now
  },
  token:{
    type: String,
  },
  avatar:{
    type:String,
    default:'../uploads/profile.png'
  },
  Total_Enrollments: {type: Number},
  Total_Courses: {type: Number},
  password_reset_code:{type: String},
  password_reset_expire: {type: Date},
  psssword_reset_verify: {type: Boolean},
  enrolledCourses: [{course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course_schema' },}]
  // enrolledCourses: [{
  //   course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }, // Course reference
  //   lessons: [{ 
  //     lesson_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }, // Single Lesson reference
  //     favorite: { type: Boolean, default: false }, // Whether the user favorited the 
  //     viwed: { type: Boolean, default: false },
  //   }]
  // }]  
});

module.exports = mongoose.model('User_schema', userSchema);
