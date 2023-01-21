const Course = require('../models/course')
const Notify = require('../models/notify');
const Media = require('../models/media')
const mongoose = require('mongoose')
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures')
const cloudinary = require('cloudinary')
const fs = require('fs');

// Create new course   =>   /api/v1/admin/course/new
exports.newCourse = catchAsyncErrors(async (req, res, next) => {

    let imagesLinks = [];

  if (Array.isArray(req.files.images) && req.files.images.length > 0) {
    for (let image of req.files.images) {
        imagesLinks.push({
                public_id: Date.now(),
                url: "/" + image.path
         })
    }
  }


    req.body.images = imagesLinks;
    req.body.user = req.user.id;

    const course = await Course.create(req.body);

    res.status(201).json({
        success: true,
        course
    })
})


// Get all courses   =>   /api/v1/courses?keyword=apple
exports.getCourses = catchAsyncErrors(async (req, res, next) => {

    const resPerPage = 4;
    const coursesCount = await Course.countDocuments({accepted: true});

    const apiFeatures = new APIFeatures(Course.find({accepted: true}), req.query)
        .search()
        .filter()

    let courses = await apiFeatures.query;
    let filteredCoursesCount = courses.length;
    apiFeatures.pagination(resPerPage)
    courses = await apiFeatures.query;


    res.status(200).json({
        success: true,
        coursesCount,
        resPerPage,
        filteredCoursesCount,
        courses
    })

})

// Get all courses (Admin)  =>   /api/v1/admin/courses
exports.getMeCourses = catchAsyncErrors(async (req, res, next) => {
    const courses = await Course.find({user: req.params.userId});

    res.status(200).json({
        success: true,
        courses
    })

})

exports.getAdminCourses = catchAsyncErrors(async (req, res, next) => {

    const courses = await Course.find();

    res.status(200).json({
        success: true,
        courses
    })

})

exports.adminAcceptCourse = catchAsyncErrors(async (req, res, next) => {

    let courseNotAccept = await Course.findById(req.params.id);

    if (!courseNotAccept) {
        return next(new ErrorHandler('Course not found', 404));
    }

    const course = await Course.findByIdAndUpdate(req.params.id, {...req.body,accepted:true}, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    const notify = await Notify.create({
        user: course.user,
        content: `Quản trị viên đã phê duyệt khóa học ${course.name} của bạn`
    })

    res.status(200).json({
        success: true,
        course
    })

})

// Get single course details   =>   /api/v1/course/:id
exports.getSingleCourse = catchAsyncErrors(async (req, res, next) => {

    const course = await Course.findById(req.params.id);

    if (!course) {
        return next(new ErrorHandler('Course not found', 404));
    }


    res.status(200).json({
        success: true,
        course
    })

})

// Update Course   =>   /api/v1/admin/course/:id
exports.updateCourse = catchAsyncErrors(async (req, res, next) => {

    let course = await Course.findById(req.params.id);

    if (!course) {
        return next(new ErrorHandler('Course not found', 404));
    }
    
    let imagesLinks = [];

    if (Array.isArray(req.files.images) && req.files.images.length > 0) {
        for (let i = 0; i < course.images.length; i++) {
            //const result = await cloudinary.v2.uploader.destroy(course.images[i].public_id)
            fs.unlink("../backend" + course.images[i].url, (err => {
                if (err) console.log(err);
                else {
                  console.log("\nDeleled file succesffully");
                }
            }));
        }
        for (let image of req.files.images) {
            imagesLinks.push({
                    public_id: Date.now(),
                    url: "/" + image.path
            })
        }
        req.body.images = imagesLinks
    }



    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        course
    })

})

// Delete Course   =>   /api/v1/admin/course/:id
exports.deleteCourse = catchAsyncErrors(async (req, res, next) => {

    const course = await Course.findById(req.params.id);

    const medias = await Media.find({course: req.params.id})

    if (!course) {
        return next(new ErrorHandler('Course not found', 404));
    }

    for(let i = 0; i < medias.length; i++) {
        console.log(medias[i])
        fs.unlink("../backend" + medias[i].videos[0], (err => {
            if (err) console.log(err);
          }));
    }

    await Media.deleteMany({course: req.params.id})

    // Deleting images associated with the course
    for (let i = 0; i < course.images.length; i++) {
        //const result = await cloudinary.v2.uploader.destroy(course.images[i].public_id)
        fs.unlink("../backend" + course.images[i].url, (err => {
            if (err) console.log(err);
        }));
    }

    await course.remove();

    res.status(200).json({
        success: true,
        message: 'Course is deleted.'
    })

})


// Create new review   =>   /api/v1/review
exports.createCourseReview = catchAsyncErrors(async (req, res, next) => {

    const { rating, comment, courseId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const course = await Course.findById(courseId);

    const isReviewed = course.reviews.find(
        r => r.user.toString() === req.user._id.toString()
    )

    if (isReviewed) {
        course.reviews.forEach(review => {
            if (review.user.toString() === req.user._id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        })

    } else {
        course.reviews.push(review);
        course.numOfReviews = course.reviews.length
    }

    course.ratings = course.reviews.reduce((acc, item) => item.rating + acc, 0) / course.reviews.length

    await course.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
    })

})


// Get Course Reviews   =>   /api/v1/reviews
exports.getCourseReviews = catchAsyncErrors(async (req, res, next) => {
    const course = await Course.findById(req.query.id);

    res.status(200).json({
        success: true,
        reviews: course.reviews
    })
})

// Delete Course Review   =>   /api/v1/reviews
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {

    const course = await Course.findById(req.query.courseId);

    console.log(course);

    const reviews = course.reviews.filter(review => review._id.toString() !== req.query.id.toString());

    const numOfReviews = reviews.length;

    const ratings = course.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length

    await Course.findByIdAndUpdate(req.query.courseId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})

exports.createCourseLesson = catchAsyncErrors(async (req, res, next) => {
    const result = await cloudinary.v2.uploader.upload(req.body.video, {
        folder: 'videos',
        width: 400,
        crop: "scale"
    })

    const { title, courseId } = req.body;

    const lesson = {
        title,
        video: {
            public_id: result.public_id,
            url: result.secure_url
        }
    }

    const course = await Course.findById(courseId);
    course.lessons.push(lesson);

    await course.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
    })

})

exports.getCourseLessons = catchAsyncErrors(async (req, res, next) => {
    const course = await Course.findById(req.query.id);

    res.status(200).json({
        success: true,
        lessons: course.lessons
    })
})