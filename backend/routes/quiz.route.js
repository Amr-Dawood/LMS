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
const { route } = require('./signup.route.js')
const check_role = require('../middlewares/check_instructor.midellware.js')
const check_enroll = require('../middlewares/check_enroll.js')
const { __routes } = require('Router')
const quizs = require('../controllers/evaluation.controller.js') 


router.route('/quiz/:lesson_id')
            .post(quizs.add_quiz)
            .get(quizs.get_quiz)
            
router.route('/question/:quiz_id')
            .post(quizs.add_question)

router.route('/attempts/:quiz_id')
            .post(verify_token.verify_token,quizs.userAttempts)
        
router.route('/userAttempts/:quiz_id')
            .get(verify_token.verify_token,quizs.get_userattempts)
            .post(verify_token.verify_token,quizs.generate_Certificate_after_quiz)
module.exports = router