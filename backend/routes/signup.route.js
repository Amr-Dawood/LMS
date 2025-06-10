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




// const upload = multer({ dest: path.join(__dirname, '../uploads')})
const upload = multer({
        storage:handel_upload.diskstorage,
        filefilter:handel_upload.filefilter
})



router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

router.use('/client',express.static(path.join(__dirname,'../client')))

router.get('/', pages.Login_Page); 
router.get('/dashboard',verify_token.verify_token,allowed_To(User_Rules.ADMIN,), pages.Dashboard_page);  




        module.exports = router

