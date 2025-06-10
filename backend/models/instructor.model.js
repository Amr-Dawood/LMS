const mongoose = require('mongoose');


const InstructorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    bio: { type: String },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course_schema' }] // Courses taught
});

module.exports = mongoose.model('Instructor', InstructorSchema);
