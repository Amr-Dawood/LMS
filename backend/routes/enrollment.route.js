const express = require('express')
const router = express.Router()
let signupcontroller = require('../controllers/Users.controller')
let logincontroller = require('../controllers/login.controller')
let {user_mid} = require('../middlewares/signup')
const verify_token = require('../middlewares/auth_token')
const allowed_To = require('../middlewares/allowed_To')
const User_Rules = require('../utils/User_Roles')
const path = require('path')
const pages = require('../controllers/pages.controller')
const multer = require('multer')
const handel_upload = require('../utils/handel_upload.js')
const courses = require('../controllers/courses.controller.js')
const enroll = require('../controllers/enrollment.controller.js')


router.route('/:course_id/enroll')
            .post(verify_token.verify_token,enroll.enroll_course)

router.route('/enroll/:course_id')
            .delete(verify_token.verify_token,enroll.unenroll_course)
            .get(verify_token.verify_token,enroll.students_enrolled_for_course)
            
router.route('/student_enrolled')
            .get(verify_token.verify_token,enroll.get_enrolled_for_student)

router.route('/getEnroll')
            .get(verify_token.verify_token,enroll.get_enroll)

router.route("/getinstructorenrollment")
            .get(verify_token.verify_token,enroll.get_instructor_enrollment)
module.exports = router