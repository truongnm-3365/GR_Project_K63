const Course = require('../models/course')
const User = require('../models/user')
const Topic = require('../models/topic');
const Media = require('../models/media');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const RegisterCourse = require('../models/registerCourse')


exports.registerCourse = catchAsyncErrors(async(req,res,next)=>{
    req.body.user = req.user.id
    req.body.course = req.params.id
    const course = await Course.findById(req.params.id)
    const topics = await Topic.find({courseId: req.params.id})
    const topic = topics.sort((a,b)=>a.createdAt - b.createdAt)[0]
    const medias = await Media.find({course: req.params.id})

    const media = medias.sort((a,b)=>a.createdAt - b.createdAt)[0]

    req.body.topic = topic._id
    req.body.media = media._id
    req.body.name = course.name
    req.body.images = course.images
    req.body.createdAt = Date.now();
    req.body.timeLimit = course.timeLimit;

    const registerCourse = await RegisterCourse.create(req.body)

    res.status(201).json({
        success: true,
        course: registerCourse
    })
})

exports.completeVideo = catchAsyncErrors(async(req,res) => {
    req.body.user = req.user.id

    let completeVideo = await RegisterCourse.findOne(req.body);
    if(!completeVideo){
        completeVideo = await RegisterCourse.create(req.body)
        res.status(201).json({
            success: true,
            completeVideo
        })
    }
})


exports.completedCourse = catchAsyncErrors(async (req,res) => {
    req.body.user = req.user.id
    req.body.course = req.params.id
    req.body.finalTestPassed = true
    req.body.completed = true;
    req.body.createdAt = Date.now();
    const completedCourse = await RegisterCourse.create(req.body)

    res.status(201).json({
        success: true,
        course: completedCourse
    })
})

exports.completedVideo = catchAsyncErrors(async (req, res, next) => {

    req.body.user = req.user.id
    let completedVideo = await RegisterCourse.findOne(req.body);


    if (!completedVideo) {
        res.status(404).json({
            success: false,
            message:"Không tìm thấy video"
        })
       
    }
    req.body.completed = true

    completedVideo = await RegisterCourse.findByIdAndUpdate(completedVideo._id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        completedVideo
    })

})

exports.getRegisterCourse = catchAsyncErrors(async(req, res, next) =>{
    const coursesTmp = await RegisterCourse.find({user: req.user.id})
    const courses = coursesTmp.filter(item => item.name !== undefined ) 

    let coursesTmpp = courses.map(course => {
        let isPassed = false
        coursesTmp.forEach(item => {
            if(item.course.toString() === course.course.toString() && item.finalTestPassed === true){
                isPassed = true
            }
        })
        return {...course._doc,isPassed}
    })


    res.status(201).json({
        success: true,
        courses:coursesTmpp,
        videos:coursesTmp
    })
})

exports.deleteRegisterCourse = catchAsyncErrors(async(req, res, next) =>{
    const course = await RegisterCourse.findById(req.params.id);
    if (!course) {
        res.status(404).json({
            success: false,
            message:"Không tìm thấy khóa học"
        })
       
    }

    await course.remove();

    res.status(200).json({
        success: true,
        message: 'Hủy bỏ khóa học'
    })
})

exports.courseExtend = catchAsyncErrors(async(req,res,next) =>{
    req.body.user = req.user.id
    let course = await RegisterCourse.findOne(req.body);

    if (!course) {
        res.status(404).json({
            success: false,
            message:"Không tìm thấy khóa học"
        })
       
    }

    req.body.createdAt = Date.now()

    course = await RegisterCourse.findByIdAndUpdate(course._id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        course
    })
})