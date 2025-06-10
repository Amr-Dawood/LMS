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
const quiz_schema = require('../models/quizzes.model')
const question_schema = require('../models/questions.model')
const lesson_schema = require('../models/lesson.model')
const UserAttempt_schema = require('../models/userAttempts.model')
const generateCertificate = require('../utils/generateCertificate')
const uploadToDrive = require("../utils/uploadToDrive");


const uploadFile = asyncWrapper (async (req,res) => {
    const fileData = await uploadToDrive.uploadToDrive(req.file);
    res.json({ message: "File uploaded", fileId: fileData.id });
})

const getFiles_from_drive  = asyncWrapper (async (req,res) => {
    const folderId = "1IEpoP5jxYa9Ljvcqc5wqLGhJTqeIZgId"; // Your folder ID
    const files = await uploadToDrive.listFiles(folderId);
    res.json({ files });
})

const downloadFile  = asyncWrapper (async (req,res) => {
    const fileId = req.params.id; // Get file ID from request
    await downloadFile(fileId);
    res.json({ message: "File downloaded successfully" });
})

module.exports = {
    uploadFile, 
    getFiles_from_drive,
    downloadFile
}
