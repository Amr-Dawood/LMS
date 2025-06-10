const mongoose = require("mongoose");

const UserAttemptSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  quiz_id: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  answers: [
    {
      question: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
      selectedAnswer: { type: String, required: true }
    }
  ],
  score: { type: Number, required: true },
  passed: { type: Boolean, required: true },
  completedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("UserAttempt", UserAttemptSchema);
