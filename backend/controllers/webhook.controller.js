const express = require("express");
const stripe = require("stripe")(process.env.stripe_Secret_key);
const asyncWrapper = require("../middlewares/asyncWrapper");
const enroll_schema = require("../models/enrollment.model");
const course_schema = require("../models/courses.model");
const user_schema = require("../models/users.model");
const Purchase_schema = require("../models/purches.model");

const webhookHandler = asyncWrapper(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ✅ Handle successful payment
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const purchaseId = session.metadata?.PurchaseId;

    if (!purchaseId) {
      return res.status(400).json({ message: "Missing Purchase ID" });
    }

    const purchase = await Purchase_schema.findById(purchaseId);
    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    // Prevent duplicate enrollments
    const alreadyEnrolled = await enroll_schema.findOne({
      course_id: purchase.course_Id,
      student_id: purchase.user_Id,
    });
    if (alreadyEnrolled) {
      console.log("⚠️ Already enrolled — skipping");
      return res.status(200).json({ received: true });
    }

    const course = await course_schema.findById(purchase.course_Id).populate("instructor_id");
    const instructor = await user_schema.findById(course.instructor_id._id);
    const student = await user_schema.findById(purchase.user_Id);

    // Create Enrollment
    const newEnrollment = new enroll_schema({
      course_id: course._id,
      student_id: student._id,
      instructor_id: instructor._id,
      enrollment_duration: 5,
    });
    await newEnrollment.save();

    // Update course
    if (!course.students.includes(student._id)) {
      course.students.push(student._id);
      await course.save();
    }

    // Update student
    if (!student.enrolledCourses.includes(course._id)) {
      student.enrolledCourses.push(course._id);
      await student.save();
    }

    // Update instructor
    instructor.Total_Enrollments = (instructor.Total_Enrollments || 0) + 1;
    await instructor.save();

    // Update purchase status
    purchase.status = "completed";
    await purchase.save();

    console.log("✅ Enrollment completed from Stripe session");
  }

  res.status(200).json({ received: true });
});

module.exports = webhookHandler;
