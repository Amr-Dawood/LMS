const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema({
  lesson_id: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson"},
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course_schema"},
  quiz_code:{type:String, required: true},
  title: { type: String, required: true },
  duration: { type: Number, required: true }, // in minutes
  passingScore: { type: Number, required: true },
  attemptsAllowed: { type: Number, default: 1 },
  isRandomized: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Quiz", QuizSchema);
