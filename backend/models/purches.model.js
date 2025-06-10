const mongoose = require("mongoose");

const PurchaseSchema = new mongoose.Schema(
  {
    course_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    user_Id: {
      type: mongoose.Schema.Types.ObjectId, // Changed from String to ObjectId
      ref: "User",
      required: true,
    },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Purchase", PurchaseSchema);
