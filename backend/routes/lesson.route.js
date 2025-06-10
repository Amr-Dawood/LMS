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
const upload = require("../middlewares/multer.js");

const lessons = require ('../controllers/lesson.controller.js')


router.route ('/lessons/:courseId')
      .post(upload.fields([
            { name: 'video', maxCount: 1 },
            { name: 'image', maxCount: 1 }
          ]),lessons.add_lesson)
      .get(verify_token.verify_token,allowed_To(User_Rules.STUDENT),lessons.view_all);

      
router.route('/lesson/:lessonId') 
      .get(lessons.view_single_lesson)
      .patch(lessons.update_lesson)
      .delete(lessons.delete_lesson);

// router.route('/lesson/view/:lessonId')  
//       .get(lessons.counter_views);
     
router.get('/lessons/search', lessons.search_lessons);

router.route('/lessons/filter').get(lessons.filter_lessons);

router.route('/lessons/:courseId/sort')  
      .get(lessons.sort_lessons);
    
router.route('/lesson/:lessonId/favorite')
      .patch(lessons.add_to_favorites);





module.exports = router