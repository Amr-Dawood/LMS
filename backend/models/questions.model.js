const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  quiz_id: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  quesiont_code:{type:String, required: true},
  questionText: { type: String, required: true },
  type: { type: String, enum: ["multiple_choice", "true_false", "fill_in_the_blank"], required: true },
  options: { type: [String], default: [] }, 
  correctAnswer: { type: String, required: true }
});

module.exports = mongoose.model("Question", QuestionSchema);
