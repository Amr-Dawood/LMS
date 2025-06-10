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
const purches = require('../controllers/payment.controller.js')
const upload = require("../middlewares/multer.js");


router.route('/')
            .post(verify_token.verify_token,allowed_To(User_Rules.INSTRUCTOR),upload.fields([
              { name: 'video', maxCount: 1 },
              { name: 'image', maxCount: 1 }
            ]),courses.add_course)
            .get(courses.show_all_course)

router.route('/singel/:course')
            .delete(verify_token.verify_token,allowed_To(User_Rules.INSTRUCTOR),courses.del_course) 
            .get(courses.show_singel_course)           
            .patch(verify_token.verify_token,allowed_To(User_Rules.INSTRUCTOR),courses.update_course)

router.route('/filter')
            .get(courses.filterCourses)

router.route('/checkenroll/:courseid')
            .get(verify_token.verify_token,courses.enrooled_or_not)

router.route('/reviews/:courseid')            
            .get(courses.get_review_course)
            .post(verify_token.verify_token,courses.add_review)

router.route('/:courseid/review/:reviewid')
            .delete(verify_token.verify_token,courses.delete_review)

router.route('/instructors/courses')   
            .get(verify_token.verify_token,courses.get_all_instructor_courses)

router.route('/category')
            .get(courses.get_by_categroy)

router.route('/categorys')
            .get(courses.getUniqueCategories)

router.route('/pending')
            .get(verify_token.verify_token,courses.pending_course)

router.route('/approve/:pending_id')
            .post(courses.approve_course)

router.route('/reject/:pending_id')
            .post(courses.reject_course)

router.route('/purchese/:course_id')
            .post(verify_token.verify_token,purches.purches_course)

router.route("/instructor/mycourses")
            .get(verify_token.verify_token,courses.my_courses_for_instructor)

router.route("/instructor/getInstructorCourses")
            .get(verify_token.verify_token,courses.getInstructorCourses)
module.exports = router