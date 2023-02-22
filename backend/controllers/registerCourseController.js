const Course = require('../models/course')
const User = require('../models/user')
const mongoose = require('mongoose')
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const RegisterCourse = require('../models/registerCourse')


exports.registerCourse = catchAsyncErrors(async(req,res,next)=>{
    req.body.user = req.user.id
    req.body.course = req.params.id
    const course = await Course.findById(req.params.id)
    //console.log(course);
    req.body.name = course.name
    req.body.images = course.images
    const registerCourse = await RegisterCourse.create(req.body)
    res.status(201).json({
        success: true,
        course: registerCourse
    })
})

exports.getRegisterCourse = catchAsyncErrors(async(req, res, next) =>{
    const courses = await RegisterCourse.find({user: req.user.id})
    res.status(201).json({
        success: true,
        courses
    })
})

exports.deleteRegisterCourse = catchAsyncErrors(async(req, res, next) =>{
    const course = await RegisterCourse.findById(req.params.id);
    if (!course) {
        return next(new ErrorHandler('Not found', 404));
    }

    await course.remove();

    res.status(200).json({
        success: true,
        message: 'Course is cancelled.'
    })
})