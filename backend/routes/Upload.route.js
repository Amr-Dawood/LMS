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
const upload = require('../controllers/Uplods.controller')


const upload_multer = multer({
        storage:handel_upload.diskstorage,
        filefilter:handel_upload.filefilter
})

router.route('/upload')
        .post(upload_multer.single('file'),upload.uploadFile)
        .get(upload.getFiles_from_drive)

router.route('/upload/:id')
        .post(upload.downloadFile)


        module.exports = router