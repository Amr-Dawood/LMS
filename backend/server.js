require("./utils/check_expire_enroll.js");
const express = require('express')
const signupRouter = require('./routes/signup.route')
const usersRouter = require('./routes/users.route')
const courserouter = require('./routes/courses.route')
const enrollroute = require('./routes/enrollment.route.js')
const LessonRouter = require('./routes/lesson.route.js')
const quizrouter = require('./routes/quiz.route.js')
const uploadrouter = require('./routes/Upload.route.js')
const cors = require("cors")
const status_code = require('./utils/httpStatus')
const cron = require('node-cron');
const removeExpiredEnrollments = require('./utils/auto_remove');
const port = process.env.port
const url = process.env.Mongo_conn
const path = require('path')
const app = express()
const cookieParser = require("cookie-parser");
const multer = require('multer')
const handel_upload = require('./utils/handel_upload.js')
const bodyParser = require('body-parser');
const enroll = require('./controllers/enrollment.controller.js')
const webhookHandler = require("./controllers/webhook.controller");

// const upload = multer({ dest: path.join(__dirname, '../uploads')})
const upload = multer({
    storage: handel_upload.diskstorage,
    filefilter: handel_upload.filefilter
}); 

require('dotenv').config()

app.use(express.json())

app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));

app.use(cookieParser()); 
app.post("/webhook", bodyParser.raw({ type: "application/json" }), webhookHandler);


//mongo connection
const mongose = require('mongoose')
mongose.connect(url).then(()=>{
    console.log('mongodb connect success')
})

app.use((req, res, next) => {
    // Set the timeout to 10 minutes (600000ms)
    req.setTimeout(600000); // 10 minutes for request processing
    res.setTimeout(600000); // 10 minutes for response processing
    next(); // Pass control to the next middleware
  });

// routing
// app.use('/uploads', express.static('uploads'));

app.use("/uploads", express.static("uploads"));
app.use('/',signupRouter)
app.use('/',usersRouter)
app.use('/api/course',courserouter)
app.use('/api/course',enrollroute)
app.use('/api/course',LessonRouter)
app.use('/api/course',quizrouter)
app.use('/api/course',uploadrouter)

// app.use('/client/dashboard.html', (req, res) => {
//     res.status(403).json({ error: "Access to this directory is forbidden" });
// });


app.use(signupRouter) // to access image

// app.use(userRouter) // to access html code

app.all('*',(req,res,next) => {
    // return res.status(404).json({status: status_code.Error_Status ,message : 'page not found'})
    res.status(404).sendFile(path.join(__dirname, 'client', '404.html'));
})



//listen port
app.listen(port,()=>{ 
    console.log(`listening on port ${port}`)
})

