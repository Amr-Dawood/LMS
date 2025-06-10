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

const add_quiz = asyncWrapper(async(req,res) => {
    const {lesson_id} = req.params
    const {title,duration,passingScore, isRandomized,attemptsAllowed,quiz_code} = req.body
    const check_code = await quiz_schema.findOne({quiz_code:quiz_code})
    
    if(check_code){
        return res.status(400).json({status: status_code.Fail_Status, message:'this quiz already exist'})
    }

    const lesson = await lesson_schema.findById(lesson_id)

    const quiz  = await quiz_schema.find({lesson_id:lesson_id})
    if(quiz.length !== 0){
        return res.status(400).json({status: status_code.Fail_Status, message:'the quiz already exist in lesson '})
    }
    

    if(!lesson){
        return res.status(400).json({status: status_code.Fail_Status, message:'this lesson not exist'})
    }else{
            const add_quiz = new quiz_schema({
                    title,
                    duration,
                    passingScore,
                    isRandomized,
                    attemptsAllowed,
                    quiz_code,
                    lesson_id:lesson_id,
                    course_id:lesson.course_id
                        })
            await add_quiz.save()
            return res.json({status: status_code.Success_Status ,data: {add_quiz}})
            
    }
})

const add_question = asyncWrapper (async(req,res)=>{
    const {quiz_id} = req.params
    const {questionText,type,options,correctAnswer,quesiont_code} =req.body
    const quiz = await quiz_schema.findById(quiz_id)   
    const check_code = await question_schema.findOne({quesiont_code:quesiont_code})
    
    if(check_code){
        return res.status(400).json({status: status_code.Fail_Status, message:'this question already exist'})
    }

    if(!quiz){
        return res.status(400).json({status: status_code.Fail_Status, message:'this quiz Not exist'})
    }
    
    const hash_answer = await bcrypt.hash(correctAnswer,10)
    
    const add_question = new question_schema({
        questionText,
        type,
        options,
        correctAnswer:hash_answer,
        quiz_id:quiz_id,
        quesiont_code
            })
    await add_question.save()
    res.json({status: status_code.Success_Status ,data: {add_question}})
})

const get_quiz  =asyncWrapper(async (req,res) => {
    const {lesson_id} = req.params
    const lesson = await lesson_schema.findById(lesson_id)
    if(!lesson){
        return res.status(400).json({status: status_code.Fail_Status, message:'this lesson not exist'})
    }

    const quiz = await quiz_schema.findOne({lesson_id:lesson_id})
    const questions = await question_schema.find({quiz_id:quiz._id})
    if(!quiz){
        return res.status(400).json({status: status_code.Fail_Status, message:'this quiz not exist'})
    }

    if(!questions){
        return res.status(400).json({status: status_code.Fail_Status, message:'Not avalable questions'})
    }

    return res.json({NUM_Questions:questions.length,status: status_code.Success_Status ,data:{quiz:quiz,questions:{questions}} })

    
})

const userAttempts = asyncWrapper (async (req,res) => {
    const {quiz_id} = req.params
    const user_id = req.user.id
    const {answers,} = req.body
    
    const user = await User_schema.findById(user_id)
    const quiz = await quiz_schema.findById(quiz_id)

    if(!user){
        return res.status(400).json({status: status_code.Fail_Status, message:'this user not exist'})
    }

    if(!quiz){
        return res.status(400).json({status: status_code.Fail_Status, message:'this quiz not exist'})
    }
    const questions = await question_schema.find({ quiz_id: quiz_id });

    if (questions.length === 0) {
      return res.status(400).json({ message: "No questions found for this quiz" });
    }
    let correctAnswers = 0;
    
        
        for (const attempt of answers) {
            const question = questions.find(q => q._id.toString() === attempt.question);

            
            if(question.quiz_id.toString() !== quiz_id){
                return res.status(400).json({ message: "This Question Not Available in This Quiz" });
            }

            if (question) {
                const isCorrect = await bcrypt.compare(attempt.selectedAnswer, question.correctAnswer);
                
                if (isCorrect) {
                    correctAnswers++;
                }
            }
        }
                
              // Step 4: Calculate score
    const  score = (correctAnswers / questions.length) * 100;

    
    const passed = score >= quiz.passingScore;

    const attempt = new UserAttempt_schema({
        user_id:user_id,
        quiz_id:quiz_id,
        answers,
        score,
        passed,
      });
      await attempt.save();

      return res.status(201).json({
        message: "User Attempt Inserted Successfully",
        attempt,
      });
            
})

const get_userattempts = asyncWrapper(async (req,res) => {
    const {quiz_id} = req.params
    const user_id = req.user.id
    const quiz = await quiz_schema.findById(quiz_id)
    if(!quiz){
        return res.status(404).json({status:status_code.Fail_Status,message:'quiz_not_found'})
    }

    const userAttempts = await UserAttempt_schema.find({user_id:user_id,quiz_id:quiz_id})
    if(!userAttempts){
        return res.status(404).json({status:status_code.Fail_Status,message:'Not Found'})
    }

    res.status(200).json({status:status_code.Success_Status,message:'This Your Score',Data:userAttempts})

})

const generate_Certificate_after_quiz  = asyncWrapper(async(req,res) => {
    const {quiz_id} = req.params
    const user_id = req.user.id
    
    const user = await User_schema.findById(user_id);
    const quiz = await quiz_schema.findById(quiz_id);
    
    const userAttempts = await UserAttempt_schema.find({user_id:user_id,quiz_id:quiz_id})

    if (!user || userAttempts.length === 0) {
        return res.status(400).json({ message: "User or Quiz not found" });
    }
    const full_name = user.first_name.toUpperCase() +" "+user.last_name.toUpperCase()
    if (userAttempts[0].passed) {
        const certificatePath = await generateCertificate(full_name, quiz.title);
        return res.download(certificatePath);
        // res.status(200).json({status:status_code.Success_Status,message:`Certificate generated at: ${certificatePath}`})
    } else {
        console.log("User did not pass the quiz. No certificate generated.");
        res.status(404).json({status:status_code.Fail_Status,message:`User did not pass the quiz. No certificate generated.`})
    console.log('mazen');
    
    }
})




module.exports = {
    add_quiz,
    add_question,
    get_quiz,
    userAttempts,
    get_userattempts,
    generate_Certificate_after_quiz,
} 