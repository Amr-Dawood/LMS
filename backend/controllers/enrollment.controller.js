    // {status: "success" ,data: {adduser}} //standard for resbonse in project
    const course_schema = require('../models/courses.model')
    const {validationResult} = require('express-validator')
    const status_code = require('../utils/httpStatus')
    const bcrypt = require('bcrypt')
    require('dotenv').config()
    const CJWT = require('../utils/createJWT')
    const asyncWrapper = require('../middlewares/asyncWrapper')
    const User_schema = require('../models/users.model')
    const enroll_schema = require('../models/enrollment.model')
    const User = require('../models/users.model');
    const Course = require('../models/courses.model');
    const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // use .env to store the key

const enroll_course = asyncWrapper(async (req, res) => {
        const { course_id } = req.params;
        const student_id = req.user.id; // Assuming authentication middleware
        const enrollment_duration = 5;
        
        // Check if course exists and populate instructor data
        const course = await course_schema.findById(course_id).populate("instructor_id");
        const instructor = await User_schema.findById(course.instructor_id._id);
        
        if (!course) {
            return res.status(404).json({ status: "Fail", message: "Course not found" });
        }
        
        // Prevent duplicate enrollment
        const existingEnrollment = await enroll_schema.findOne({ course_id, student_id });
        if (existingEnrollment) {
            return res.status(400).json({ status: "Fail", message: "Already enrolled in this course" });
        }
        console.log(1);
    
        // Create enrollment
        const newEnrollment = new enroll_schema({ course_id, student_id, enrollment_duration ,instructor_id:instructor._id});
        await newEnrollment.save();
    
        // ✅ Fetch the instructor document
    
        if (instructor) {
            // ✅ Increase total enrollments manually
            if (!instructor.Total_Enrollments) {
                instructor.Total_Enrollments = 0; // Initialize if not set
            }
            instructor.Total_Enrollments += 1;
    
            await instructor.save(); // Save instructor data
        }
    
        console.log("Total Enrollments:", instructor.Total_Enrollments);
    
        // ✅ Update course to add student
        if (!course.students.includes(student_id)) {
            course.students.push(student_id);
            await course.save();
        }
    
        // ✅ Update student to add enrolled course
        const student = await User_schema.findById(student_id);
        if (student) {
            student.enrolledCourses.push(course_id);
            await student.save();
        }
    
        return res.status(201).json({ status: "Success", message: "Enrolled successfully", data: newEnrollment });
    });
    

const unenroll_course = asyncWrapper (async (req,res) => {
    const { enrollment_id } = req.params; // Enrollment ID
    const student_id = req.user.id;

    // Find the enrollment
    const enrollment = await enroll_schema.findOne({ _id: enrollment_id, student_id });
    if (!enrollment) return res.status(404).json({ status: "Fail", message: "Enrollment not found" });

    // Delete the enrollment
    await enroll_schema.findByIdAndDelete(id);
    return res.status(200).json({ status: "Success", message: "Unenrolled successfully" });

})    

const get_enrolled_for_student = asyncWrapper(async (req, res) => { //to fetch all courses that student enrolled in
    const user_id = req.user.id;
  
    const enrollments = await enroll_schema.find({ student_id: user_id })
      .populate({
        path: "course_id",
        model: "Course_schema",
        select: "title image lessons course_lesson course_hour instructor_id", // choose what fields you want
      })
      .populate({
        path: "instructor_id",
        model: "User_schema",
        select: "first_name last_name", // optional
      });
       console.log(enrollments);
       
    //   enrollments.populate("course_id")
    // Optional: Format the result to include lectureCompleted (add logic if stored)
    const formatted = enrollments.map((enroll) => {
      return {
        _id: enroll.course_id?._id,
        title: enroll.course_id?.title,
        courseThumbnail: enroll.course_id?.image,
        totalLecture: enroll.course_id?.course_lesson,
        lectureCompleted: 0, // Or pull from another tracking source
        enrollment_duration: enroll.enrollment_duration,
        enrollment_end: enroll.enrollment_end,
        instructor: enroll.instructor_id?.first_name + " " + enroll.instructor_id?.last_name,
    };
});     
    return res.status(200).json({
      status: "Success",
      data: formatted,
    });
  });

const students_enrolled_for_course = asyncWrapper (async (req,res) => { // to fetch all student on singel course
    const{course_id} = req.params
    const course = await course_schema.findOne({_id:course_id}).select("students")
    return res.json(course.students)
}) 

const get_enroll = asyncWrapper(async (req,res) => {
    const user_id = req.user.id
    console.log(user_id);
    
    const enrollment = await enroll_schema.findOne({student_id:user_id})
    console.log(enrollment)
    res.status(200).json({status:status_code.Success_Status,message:enrollment})

})  

const get_instructor_enrollment = asyncWrapper(async (req, res) => {
    const instructor_id = req.user._id;
    console.log("Instructor ID:", instructor_id);

    const enrollments = await enroll_schema.find({ instructor_id: instructor_id })
        .populate("course_id") // Get course title
        .populate("student_id"); // Get student name & image

    console.log("Enrollments:", JSON.stringify(enrollments, null, 2));

    res.status(200).json({
        status: status_code.Success_Status,
        message: enrollments,
    });
});


module.exports = { 
        enroll_course, //
        unenroll_course, 
        get_enrolled_for_student, //
        students_enrolled_for_course,
        get_enroll,
        get_instructor_enrollment
};