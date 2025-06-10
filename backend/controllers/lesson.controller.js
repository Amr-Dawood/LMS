// {status: "success" ,data: {adduser}} //standard for resbonse in project
const User_schema = require('../models/users.model')
const {validationResult} = require('express-validator')
const status_code = require('../utils/httpStatus')
const bcrypt = require('bcrypt')
require('dotenv').config()
const CJWT = require('../utils/createJWT')
const asyncWrapper = require('../middlewares/asyncWrapper')
const { update_user } = require('./Users.controller')
const send_Email = require('../utils/send_Email')
const encrypt = require('../utils/encrypt_crypto')
const lesson_schema = require('../models/lesson.model')
const course_schema = require('../models/courses.model')





const add_lesson = asyncWrapper(async (req, res) => {
    const { courseId } = req.params;
    const { title, content, duration} = req.body;
    const course = await course_schema.findById(courseId);
    if (!course) {
        return res.status(404).json({ status: "error", message: "Course not found" });
    }
    console.log(1);
    
    const num_video = +(course.course_lesson + 1)    
    const video_number = course.lessons.length + 1
    const videoPath = req.files?.video?.[0]?.path;
    // const imagePath = req.files?.image?.[0]?.path;
    
    const newLesson =  new lesson_schema({
        title,
        content,
        video_url : videoPath,
        duration,
        video_number,
        course_id: courseId
    });
    console.log(1);

    await newLesson.save();
    console.log(1);

    course.lessons.push({lesson_id:newLesson._id})
    course.course_lesson = num_video 
    await course.save()
    res.status(200).json({ status: "success", data: { newLesson } });
});

const update_lesson = asyncWrapper (async (req, res) => {
    const { lessonId } = req.params
    const lesson = await lesson_schema.findById(lessonId)
    if (!lesson) {
        return res.status(404).json({ status: "error", message: "lesson not found" })
      }
    
    const updatelesson = await lesson_schema.updateOne ({ _id:lessonId},{$set:{...req.body}})  
    res.status(200).json({ status: "updated", data: { updatelesson } })

})

const delete_lesson = asyncWrapper (async (req, res) => {
    const { lessonId } = req.params
    const lesson = await lesson_schema.findById(lessonId)
    if (!lesson) {
        return res.status(404).json({ status: "error", message: "lesson not found"})
    }

    const deletelesson = await lesson_schema.deleteOne ({ _id:lessonId})
    res.status(200).json({ status: "deleted", data: {deletelesson}})
})

const view_all = asyncWrapper (async (req, res) => {
    const { courseId } = req.params
    console.log(courseId);
    
    const course = await course_schema.findById(courseId)
    if(!course) {
        return res.status(404).json ({ status: "error", message: "course not found" })
    }
    const all_lessons = await course.populate('lessons.lesson_id')
    const lessonsOnly = all_lessons.lessons.map(l => l.lesson_id);

    res.status(200).json({ status: " Veiwed ALL ", data: {lessonsOnly}})
})

const view_single_lesson = asyncWrapper(async (req, res) => {
    const { lessonId } = req.params;
    const cleanLessonId = lessonId.trim();  // Remove extra spaces or newlines
    
    const lesson = await lesson_schema.findById(cleanLessonId);
    
    if (!lesson) {
        return res.status(404).json({ status: status_code.Fail_Status, message: "Lesson not found" });
    }

    // Increase view count
    // lesson.views += 1;
    // await lesson.save();

    res.status(200).json({ status: status_code.Success_Status, data: {lesson}  });
});

// const counter_views = asyncWrapper(async (req, res) => {
//     const { lessonId } = req.params;
//     const cleanLessonId = lessonId.trim(); // Remove unwanted spaces or newlines

//     try {
//         const lesson = await lesson_schema.findById(cleanLessonId);
        
//         if (!lesson) {
//             return res.status(404).json({ status: "error", message: "Lesson not found" });
//         }

//         // Increment views
//         lesson.views += 1;
//         await lesson.save();  // Save updated lesson

//         res.status(200).json({ 
//             status: "success", 
//             message: "Lesson view counted", 
//             data: { lesson } 
//         });

//     } catch (error) {
//         res.status(500).json({ status: "error", message: "Internal Server Error", error: error.message });
//     }
// });

const search_lessons = asyncWrapper(async (req, res) => {
    const { query } = req.query; // Get the search query from request parameters

    if (!query) {
        return res.status(400).json({ status: "error", message: "Search query is required" });
    }

    // Search in `title` and `content` fields using a case-insensitive regex


    // const lessons = await lesson_schema.find({
    //     $or: [
    //         { title: { $regex: query, $options: "i" } }, // regex = Regular Expressions (Case-Insensitive)
    //         { content: { $regex: query, $options: "i" } }
    //     ]
    // });


    // Using $text is better than $regex to improve search performance.
     const lessons = await lesson_schema.find({
        $text: { $search: query }
    });

    if (lessons.length === 0) {
        return res.status(404).json({ status: "error", message: "No lessons found" });
    }

    res.status(200).json({ status: "success", data: lessons });
});

const filter_lessons = asyncWrapper(async (req, res) => {
    let { title, minDuration, maxDuration, videoNumber, startDate, endDate } = req.query;
    
    let filter = {};

    // Filter by title (case-insensitive search)
    if (title) {
        filter.title = { $regex: title, $options: "i" };
    }

    // Filter by duration range
    if (minDuration || maxDuration) {
        filter.duration = {};
        if (minDuration) filter.duration.$gte = parseInt(minDuration);
        if (maxDuration) filter.duration.$lte = parseInt(maxDuration);
    }

    // Filter by specific video number
    if (videoNumber) {
        filter.video_number = parseInt(videoNumber);
    }

    // Filter by createdAt date range
    if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Fetch filtered lessons
    const lessons = await lesson_schema.find(filter);

    if (lessons.length === 0) {
        return res.status(404).json({ status: "error", message: "No lessons found" });
    }

    res.status(200).json({ status: "success", data: lessons });
});

const sort_lessons = asyncWrapper(async (req, res) => {
    try {
        const { courseId } = req.params;   // Extract Course ID
        const { sortBy } = req.query;      // Extract sorting query parameter

        // Validate course existence
        const course = await course_schema.findById(courseId);
        if (!course) {
            return res.status(404).json({ status: "error", message: "Course not found" });
        }

        // Define sorting order
        let sortOrder = sortBy === 'desc' ? -1 : 1;   // Default is ascending

        // Fetch and sort lessons based on video_number
        const lessons = await lesson_schema.find({ course_id: courseId }).sort({ video_number: sortOrder });

        res.status(200).json({ status: "success", data: lessons });
    } catch (error) {
        console.error("Error sorting lessons:", error);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
});


const add_to_favorites = asyncWrapper(async (req, res) => {
    const { lessonId } = req.params;
    const userId = req.user.id; // Ensure req.user.id exists

    // Check if lesson exists
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
        return res.status(404).json({ status: "error", message: "Lesson not found" });
    }
       
    // Convert userId to string to avoid object mismatches
    const isFavorited = lesson.favorites.some(id => id.toString() === userId);
     


    if (isFavorited) {
        // Remove from favorites
        lesson.favorites = lesson.favorites.filter(id => id.toString() !== userId);
        await lesson.save();
        return res.status(200).json({ status: "success", message: "Removed from favorites", data: lesson });
    } else {
        // Add to favorites
        lesson.favorites.push(userId);
        await lesson.save();
        return res.status(200).json({ status: "success", message: "Added to favorites", data: lesson });
    }
});




module.exports = {
    add_lesson,  //
    update_lesson, 
    delete_lesson, 
    view_all, //
    view_single_lesson,
    search_lessons,  
    filter_lessons,  
    sort_lessons,
    add_to_favorites,
}