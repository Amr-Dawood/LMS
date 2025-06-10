// {status: "success" ,data: {adduser}} //standard for resbonse in project
const course_schema = require('../models/courses.model')
const {validationResult} = require('express-validator')
const status_code = require('../utils/httpStatus')
const bcrypt = require('bcrypt')
require('dotenv').config()
const CJWT = require('../utils/createJWT')
const asyncWrapper = require('../middlewares/asyncWrapper')
const { json } = require('body-parser')
const PendingCourseSchema = require('../models/PendingCourse.model')
const User_schema = require('../models/users.model')
const send_Email = require('../utils/send_Email')
const multer = require("multer");
const path = require("path");
const cloudinary = require('../cloudinary');
const streamifier = require('streamifier');



const add_course = asyncWrapper(async (req, res) => {
    const {
      title, code, language, course_lesson, course_hour,
      course_level, course_price, description, category, 
    } = req.body;
    const instructor_id = req.user._id
    const course_code1 = await course_schema.findOne({ code });
    const course_code2 = await PendingCourseSchema.findOne({ code });
    if (course_code1 || course_code2) {
      return res.status(400).json({
        status: status_code.Fail_Status,
        message: "Code already exists"
      });
    }
    const videoPath = req.files?.video?.[0]?.path;
    const imagePath = req.files?.image?.[0]?.path;
  
  
    const addcourse = new PendingCourseSchema({
      title,
      code,
      language,
      course_lesson,
      course_hour,
      course_level,
      course_price,
      description,
      category,
      instructor_id: instructor_id,
      video: videoPath,
      image: imagePath
    });

    await addcourse.save();
    res.status(201).json({
      status: status_code.Success_Status,
      data: addcourse
    });
  });
  
const del_course = asyncWrapper(async (req,res) => {
    const code = await course_schema.findOne({code:req.params.course})
    console.log(code);
    
    if (!code){
        res.status(400).json({status: status_code.Fail_Status, message:'this course not exist'})
    }else{
        const delcourse = await course_schema.deleteOne({code:req.params.course})
        res.status(200).json({status: status_code.Success_Status ,data:delcourse})
    }
})

const show_singel_course = asyncWrapper(async (req,res) => {
    const course = await course_schema.findOne({code:req.params.course}).populate("instructor_id")
    console.log(course);
    
    if(!course){
        res.status(400).json({status:status_code.Fail_Status,message: "this course not exist"})
    }else{
        res.status(200).json({status: status_code.Success_Status ,data:course})
    }
})

const show_all_course = asyncWrapper(async (req, res) => {
    const query = req.query;
    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;

    const courses = await course_schema
        .find({}, { "__v": false })
        .limit(limit)
        .skip(skip)
        .populate("lessons.lesson_id")
        .populate("instructor_id", "username");

    if (courses.length === 0) {
        return res.status(200).json({ status: status_code.Fail_Status, message: "There are no courses" });
    }

    // Ensure the correct URL format for images
    const baseUrl = req.protocol + "://" + req.get("host"); // Example: http://localhost:5000

    const coursesWithFullImagePath = courses.map((course) => ({
        ...course._doc,
        image: course.image ? `${baseUrl}/${course.image.replace("../", "")}` : `${baseUrl}/uploads/default.png`,
    }));

    res.status(200).json({
        num_courses: courses.length,
        course: coursesWithFullImagePath,
    });
});


const update_course = asyncWrapper( async(req,res) => {
        const course = await course_schema.findOne({code:req.params.course})

    if(!course){
        res.status(400).json({status: status_code.Fail_Status,message:'this course not exist'})
    }else{
        const update_course = await course_schema.updateOne({code:req.params.course},{$set: {...req.body}})
        res.status(200).json({status: status_code.Success_Status ,data:course})
    }
})

const filterCourses = asyncWrapper(async (req, res) => {
    const { title, language, course_level, course_price_min, course_price_max } = req.query;
    let filter = {};

    if (title) {
        filter.title = { $regex: title, $options: 'i' }; // Case-insensitive match
    }

    // Filter by language
    if (language) {
        filter.language = language;
    }

    // Filter by course level
    if (course_level) {
        filter.course_level = course_level;
    }

    // Filter by course price range
    if (course_price_min || course_price_max) {
        filter.course_price = {};
        if (course_price_min) {
            filter.course_price.$gte = parseFloat(course_price_min); // Greater than or equal to min price
        }
        if (course_price_max) {
            filter.course_price.$lte = parseFloat(course_price_max); // Less than or equal to max price
        }
    }

    // Fetch courses from the database based on the filter criteria
    const courses = await course_schema.find(filter);

    // If no courses match the filter, return a 404 status
    if (courses.length === 0) {
        return res.status(404).json({
            status: status_code.Fail_Status,
            message: 'No courses found matching the criteria'
        });
    }

    // Return the filtered courses in the response
    return res.status(200).json({
        status: status_code.Success_Status,
        data: courses
    });

})

const enrooled_or_not = asyncWrapper (async (req,res) => {
    const { courseid } = req.params;
    const user_id = req.user.id; // Get user ID from authenticated session (JWT or session-based auth)

    
    // Validate input
    if (!course_id) {
        return res.status(400).json({ message: "Course ID is required" });
    }

    const course = await course_schema.findOne({ _id: courseid }).select("students");

    if (!course) {
        return res.status(404).json({ message: "Course not found" });
    }

    const isEnrolled = course.students.includes(user_id);

    return res.json({ enrolled: isEnrolled });
})

const get_review_course = asyncWrapper (async (req,res) => {
    const{courseid} = req.params
    const course = await course_schema.findById(courseid)
    
    if(!course){
        res.status(404).json({status:status_code.Fail_Status,message:'course Not found'})
    }else{
        const reviews_num =  course.reviews.length
        const reviews =   course.reviews
        res.status(200).json({status:status_code.Success_Status,mesaage:'reviews',data:{reviews_num:reviews_num,reviews}})
    }
})

const add_review = asyncWrapper (async (req,res) =>{
    const {courseid} = req.params
    const {review} = req.body 
    const username = req.user.username
    const course = await course_schema.findById(courseid)
    if(!course){
        res.status(404).json({status:status_code.Fail_Status,message:'course Not found'})
    }else{
        course.reviews.push({username,review})
        await course.save()
        res.status(200).json({status:status_code.Success_Status,message: 'review added successfuly',data:{reviews:review,username:username,reviews:course.reviews}})
    }
})

const delete_review =asyncWrapper (async (req,res) =>{
    const{courseid,reviewid} = req.params
    const course = await course_schema.findById(courseid)
    if(!course){
        res.status(404).json({status:status_code.Fail_Status,message:'course Not found'})
    }else{
    const reviewIndex = course.reviews.findIndex(review => review._id.toString() === reviewid);
    if (reviewIndex === -1) {
        return res.status(404).json({ status: status_code.Fail_Status, message: "Review not found" });
    }
    course.reviews.splice(reviewIndex, 1);
    await course.save();
        res.status(200).json({status:status_code.Success_Status,message:'review deleted'})
    }
    // console.log(course.reviews[0]._id.toString())
    // if(!course){
    //     res.status(404).json({status:status_code.Fail_Status,message:'course Not found'})
    // }else{
    //     const del_review = await course_schema.deleteOne({_id:courseid})
    // }
})

const get_all_instructor_courses = asyncWrapper(async (req,res) => {
    const instructorid = req.user._id
    const instructor_courses = await course_schema.find({instructor_id:instructorid})
    if(instructor_courses.length === 0){
        res.status(404).json({statu:status_code.Fail_Status,message:'this instructor dose not have courses'})
    }else{
        res.status(200).json({status:status_code.Success_Status,data:{courses_num:instructor_courses.length,message:'all_courses',courses:instructor_courses}})
    }
})

const my_courses_for_instructor = asyncWrapper(async (req,res) => {
    const instructorid = req.user._id
    const instructor_courses = await course_schema.find({instructor_id:instructorid})
    if(instructor_courses.length === 0){
        res.status(404).json({statu:status_code.Fail_Status,message:'this instructor dose not have courses'})
    }else{
        res.status(200).json({status:status_code.Success_Status,data:{courses_num:instructor_courses.length,message:'all_courses',courses:instructor_courses}})
    }
})

const get_by_categroy = asyncWrapper(async (req,res) => {
    const {category} =req.query
    const courses = await course_schema.find({ category: new RegExp(category, 'i') });
    if(courses.length === 0){
        res.status(404).json({status: status_code.Fail_Status,message:'This Category Not Found'})
    }else{
        res.status(200).json({status:status_code.Success_Status,message: courses})
    }
})

const getUniqueCategories  = asyncWrapper(async  (req,res) => {
    // Fetch all categories from MongoDB
    const data = await course_schema.find({}, "category").lean();
    if(data.length === 0){
        return res.status(404).json({status: status_code.Fail_Status,message:'Not Found'})
    }
    // Extract category values
    const categories = data.map(item => item.category);
    
    // Remove duplicates while preserving order
    const uniqueCategories = [...new Set(categories)];

    res.status(200).json({status:status_code.Success_Status,message:uniqueCategories})
})

const pending_course = asyncWrapper (async (req,res) => {
    const pending = await PendingCourseSchema.find({})
    if (pending.length === 0 ){
        return res.status(404).json({status:status_code.Fail_Status,message:'not found pending'})
    }else{
        const baseUrl = req.protocol + "://" + req.get("host"); // Example: http://localhost:5000

        const coursesWithFullImagePath = pending.map((pending) => ({
            ...pending._doc,
            image: pending.image ? `${baseUrl}/${pending.image.replace("../", "")}` : `${baseUrl}/uploads/default.png`,
        }));
        return res.status(200).json({ status: status_code.Success_Status, data: coursesWithFullImagePath });
    }
})



const approve_course = asyncWrapper(async (req,res) => {
    const {pending_id} = req.params
    const pendingCourse = await PendingCourseSchema.findById(pending_id);
    const instructor = await User_schema.findById(pendingCourse.instructor_id)
console.log(1);

if (!pendingCourse) return res.status(404).json({ error: "Course not found" });

// Move course from PendingCourse to Course collection
const approve_course = new course_schema({
    title: pendingCourse.title,
        code: pendingCourse.code,
        language: pendingCourse.language,
        course_lesson: pendingCourse.course_lesson,
        course_hour: pendingCourse.course_hour,
        course_level: pendingCourse.course_level,
        course_price: pendingCourse.course_price,
        review: pendingCourse.review,
        description: pendingCourse.description,
        instructor_id: pendingCourse.instructor_id, // Keep this consistent with your schema
        category: pendingCourse.category,
        image:pendingCourse.image,
        video:pendingCourse.video
    });
    // ✅ Ensure Total_Enrollments is a valid number before incrementing
    console.log(instructor);
    console.log(instructor.Total_Courses);
    instructor.Total_Courses = Number(instructor.Total_Courses) || 0;
    console.log(1);
    instructor.Total_Courses += 1;
    console.log(1);
    await instructor.save(); 
    console.log(1);
    await approve_course.save();
    const user = await User_schema.findById(pendingCourse.instructor_id)
    await send_Email({email:user.email,subject:'approved course',message:`aprroved course is ${approve_course.code}`})
    
    await PendingCourseSchema.findByIdAndDelete(pending_id);

    res.json({ message: "Course approved and published!",data:approve_course });
})

const reject_course = asyncWrapper(async (req,res)=>{
    const {pending_id} = req.params 
    
    const pending = await PendingCourseSchema.findById(pending_id)
    
    if(!pending){
        return res.status(404).json({status: status_code.Fail_Status,message:'Not Found'})
    }
    await PendingCourseSchema.findByIdAndDelete(pending_id);
    res.json({ message: "Course rejected and removed!" });
})

const getInstructorCourses = asyncWrapper (async (req, res) => {
    const  instructor_id  = req.user._id;
    const courses = await course_schema.find({ instructor_id: instructor_id }).select("_id title");
    res.json(courses);
  })
  

module.exports = {
        add_course, // 
        del_course, //
        show_singel_course, //
        show_all_course,    //
        update_course,    
        filterCourses,   
        enrooled_or_not,   //
        get_review_course,   
        add_review,
        delete_review,
        get_all_instructor_courses,
        get_by_categroy,
        getUniqueCategories, 
        pending_course, //
        approve_course, //
        reject_course, //
        my_courses_for_instructor, 
        getInstructorCourses 
}