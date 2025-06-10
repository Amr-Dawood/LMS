const Enrollment = require("../models/enrollment.model");
const lessons = require('../models/lesson.model')

const getLesson = async (req, res) => {
    const { lessonId } = req.params;
    const userId = req.user.id;

    const enrollment = await Enrollment.findOne({ student: userId, course: req.body.courseId });

    if (!enrollment) {
        return res.status(403).json({ status: "fail", message: "You are not enrolled in this course" });
    }
    const lesson = lessons.findById(lessonId)
    if(!lesson){
        res.status(400).json({status:'Failed',message: 'lesson not found'})
    }else{
        res.status(200).json({ status: "success", data: { lesson } });
    }
};
module.exports = {
    getLesson,
    
}