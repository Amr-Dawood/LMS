const express = require('express')
const router = express.Router()
let Userscontroller = require('../controllers/Users.controller')
let logincontroller = require('../controllers/login.controller')
let {user_mid} = require('../middlewares/signup')
const verify_token = require('../middlewares/auth_token')
const allowed_To = require('../middlewares/allowed_To')
const User_Rules = require('../utils/User_Roles')
const path = require('path')
const pages = require('../controllers/pages.controller')
const multer = require('multer')
const handel_upload = require('../utils/handel_upload.js')

const upload = multer({
        storage:handel_upload.diskstorage,
        filefilter:handel_upload.filefilter
})

router.route('/api/users')
        .get(verify_token.verify_token,allowed_To(User_Rules.ADMIN), Userscontroller.Get_users) 
        .post(user_mid(),Userscontroller.Adduser)

router.route('/api/login')
        .post(logincontroller.login)

router.route('/api/logout')
        .post(logincontroller.logout)


router.route('/api/user')
        .get(verify_token.verify_token,Userscontroller.Get_single_User)
        .delete(allowed_To(User_Rules.ADMIN),Userscontroller.deluser)
        .patch(verify_token.verify_token,Userscontroller.update_user)

router.route('/api/users/instructors')
        .get(verify_token.verify_token,allowed_To(User_Rules.ADMIN),Userscontroller.get_all_instructor)        

router.route('/api/users/profile')
        .get(verify_token.verify_token,Userscontroller.user_profile)
        .post(verify_token.verify_token,logincontroller.change_password)

router.route('/api/users/reset')
        .post(logincontroller.forget_password)

router.route('/api/users/verifycode')
        .post(logincontroller.reset_code)        
        
router.route('/api/users/reset_password')
        .post(logincontroller.reset_password)

router.route('/auth_me')
        .get(verify_token.verify_token,Userscontroller.auth_me)

module.exports = router

        