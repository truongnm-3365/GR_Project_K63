const Course = require('../models/course')
const Notify = require('../models/notify');
const Media = require('../models/media')
const User = require('../models/user')
const mongoose = require('mongoose')
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures')
const cloudinary = require('cloudinary')
const fs = require('fs');
const Topic = require('../models/topic');
const Quiz = require('../models/quiz');
const RegisterCourse = require('../models/registerCourse');
const Note = require('../models/note');
const Follow = require('../models/follow');

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
    req.body.user = req.user._id;

    const course = await Course.create(req.body);

    const admins = await User.find({role:'admin'})

    for(let admin of admins) {
      const notify = await Notify.create({
          user: admin._id,
          content: `Có một yêu cầu phê duyệt khóa học ${course.name} từ ${req.user.name}`,
          course:course._id
      })
    }

    res.status(201).json({
        success: true,
        course
    })
})


// Get all courses   =>   /api/v1/courses?keyword=apple
exports.getCourses = catchAsyncErrors(async (req, res, next) => {

    const resPerPage = 8;
    const resPerPageSearch = 4;
    const coursesCount = await Course.countDocuments({accepted: true});

    const apiFeatures = new APIFeatures(Course.find({accepted: true}).sort({ createdAt:-1}), req.query)
        .search()
        .filter()

    let courses = await apiFeatures.query;
    let filteredCoursesCount = courses.length;

    if(Object.keys(req.query).length === 1 && Object.keys(req.query).includes("page")){
        apiFeatures.pagination(resPerPage)
    }else if(Object.keys(req.query).length >= 1){
        
        apiFeatures.pagination(resPerPageSearch)
    }
    

    
    courses = await apiFeatures.query;
    const registerCourse = await RegisterCourse.find();
    

    let coursesTmp = courses.map((course) => {
        let users = registerCourse.filter(item => item.course.toString() === course._id.toString())
        users = users.map(item => item.user.toString())
        users = [...new Set(users)]
        
        return {...course._doc,users}
    })

   
    

    res.status(200).json({
        success: true,
        coursesCount,
        resPerPage,
        resPerPageSearch,
        filteredCoursesCount,
        courses:coursesTmp
    })

})


exports.getMeCourses = catchAsyncErrors(async (req, res, next) => {
    const courses = await Course.find({user: req.params.userId});
   
    res.status(200).json({
        success: true,
        courses
    })

})

exports.getAdminCourses = catchAsyncErrors(async (req, res) => {

    const courses = await Course.find();

    res.status(200).json({
        success: true,
        courses
    })

})

exports.getRegularCourses = catchAsyncErrors(async (req, res, next) => {

    let courses = await Course.find();
    const registerCourse = await RegisterCourse.find();

    let coursesTmp = courses.map((course) => {
        let users = registerCourse.filter(item => item.course.toString() === course._id.toString())
        users = users.map(item => item.user.toString())
        users = [...new Set(users)]
        
        return {...course._doc,users}
    })
    

    let regularCourses = coursesTmp.sort(function(a,b){
        return b.users?.length - a.users?.length;
    }).splice(0,10)

    res.status(200).json({
        success: true,
        regularCourses
    })

})

exports.adminAcceptCourse = catchAsyncErrors(async (req, res, next) => {

    let courseNotAccept = await Course.findById(req.params.id);

    

    if (!courseNotAccept) {
        res.status(404).json({
            success: false,
            message:"Không tìm thấy khóa học"
        })
        
    }

    const course = await Course.findByIdAndUpdate(req.params.id, {...req.body,accepted:true}, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    const notify = await Notify.create({
        user: course.user,
        content: `Quản trị viên đã phê duyệt khóa học ${course.name} của bạn`,
        course:course._id
    })
    
    const followers = await Follow.find({user: course.user })

    for(let follower of followers){
        await Notify.create({
            user: follower.follower,
            content: `Người bạn đang theo dõi đã thêm khóa học ${course.name}`,
            course:course._id
        })
    }

    res.status(200).json({
        success: true,
        course
    })

})


exports.adminChangeStatusCourse = catchAsyncErrors(async (req, res, next) => {

    let course = await Course.findById(req.params.id);

    


    if (!course) {
        res.status(404).json({
            success: false,
            message:"Không tìm thấy khóa học"
        })
       
    }

    course = await Course.findByIdAndUpdate(req.params.id, {...req.body,accepted:!course.accepted}, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    const notify = await Notify.create({
        user: course.user,
        content: `Quản trị viên đã ${course.accepted ? "hiện" :"ẩn"} khóa học ${course.name} của bạn`,
        course:course._id
    })

    res.status(200).json({
        success: true,
        course
    })

})

// Get single course details   =>   /api/v1/course/:id
exports.getSingleCourse = catchAsyncErrors(async (req, res, next) => {

    const courseDetails = await Course.findById(req.params.id)


    if (!courseDetails) {
        res.status(404).json({
            success: false,
            message:"Không tìm thấy khóa học"
        })
    }


    const registerCourse = await RegisterCourse.find();
    let users = registerCourse.filter(item => item.course.toString() === courseDetails._id.toString())
    users = users.map(item => item.user.toString())
    users = [...new Set(users)]

    users  = users.map(item => mongoose.Types.ObjectId(item))
    users = await User.find({_id:{ $in: users}});

    const user = await User.findById(courseDetails.user)


    let course = {
        details:courseDetails,
        user,
        registerUsers:users
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
        res.status(404).json({
            success: false,
            message:"Không tìm thấy khóa học"
        })
       
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
        res.status(404).json({
            success: false,
            message:"Không tìm thấy khóa học"
        })
        
    }

    for(let i = 0; i < medias.length; i++) {
        console.log(medias[i])
        fs.unlink("../backend" + medias[i].videos[0], (err => {
            if (err) console.log(err);
          }));
    }

    await Media.deleteMany({course: req.params.id})
    await Topic.deleteMany({course: req.params.id})

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
        avatar: req.user.avatar.url,
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
                review.avatar = req.user.avatar.url;
                review.createdAt = Date.now();
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


exports.newTopic = catchAsyncErrors(async (req, res, next) => {

    const topic = await Topic.create(req.body);

    res.status(201).json({
        success: true,
        topic
    })
})

exports.getCourseTopic = catchAsyncErrors(async (req, res, next) => {
    const topics = await Topic.find({courseId: req.params.courseId});

    let topicsTmp = topics.filter(item => item.isFinalTest === false).sort((a,b) => a.createdAt - b.createdAt)

    let topicFinalTest = topics.filter(item => item.isFinalTest === true)

    topicsTmp = topicsTmp.concat(topicFinalTest)

    res.status(200).json({
        success: true,
        topics:topicsTmp
    })

})

exports.deleteTopic = catchAsyncErrors(async (req, res, next) => {
    const topic = await Topic.findById(req.params.id);
  
    if (!topic) {
        res.status(404).json({
            success: false,
            message:"Không tìm thấy chủ đề"
        })
      
    }
  
    await topic.remove();
    
  
    res.status(200).json({
        success: true,
        message: 'Topic is deleted.'
    })
  });

exports.updateTopic = catchAsyncErrors(async (req, res, next) => {

    let topic = await Topic.findById(req.params.id);

    if (!topic) {
        res.status(404).json({
            success: false,
            message:"Không tìm thấy chủ đề"
        })
        
    }
    

    topic = await Topic.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        topic
    })

})


exports.newTopicQuiz = catchAsyncErrors(async (req, res, next) => {
   

    const quiz = await Quiz.create( req.body);

    res.status(201).json({
        success: true,
        quiz
    })

})


// Get Course Reviews   =>   /api/v1/reviews
exports.getTopicQuizs = catchAsyncErrors(async (req, res, next) => {
    const quiz = await Quiz.find({topicId:req.params.topicId});

    res.status(200).json({
        success: true,
        quiz
    })
})

exports.deleteTopicQuiz = catchAsyncErrors(async (req, res, next) => {
    const quiz= await Quiz.findById(req.params.id);
  
    if (!quiz) {
        res.status(404).json({
            success: false,
            message:"Không tìm thấy câu đố"
        })
        
    }
  
    await quiz.remove();
    
  
    res.status(200).json({
        success: true,
        message: 'Đã xóa câu đố'
    })
  });

  exports.updateTopicQuiz = catchAsyncErrors(async (req, res, next) => {

    let quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
        res.status(404).json({
            success: false,
            message:"Không tìm thấy câu đố"
        })
       
    }
    
    

    quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        quiz
    })

})


exports.newNote = catchAsyncErrors(async (req, res, next) => {
    req.body.user = req.user._id

    const note = await Note.create(req.body);

    res.status(201).json({
        success: true,
        note
    })
})

exports.getNotes = catchAsyncErrors(async (req, res, next) => {

    const notes = await Note.find({course: req.params.courseId, user: req.user._id}).populate("media", "_id topic name topicId");

    res.status(200).json({
        success: true,
        notes
    })

})

exports.deleteNote = catchAsyncErrors(async (req, res, next) => {
    const note = await Note.findById(req.params.id);
  
    if (!note) {
        res.status(404).json({
            success: false,
            message:"Không tìm thấy ghi chú"
        })
      
    }
  
    await note.remove();
    
  
    res.status(200).json({
        success: true,
        message: 'Note is deleted.'
    })
  });

exports.updateNote = catchAsyncErrors(async (req, res, next) => {

    let note = await Note.findById(req.params.id);

    if (!note) {
        res.status(404).json({
            success: false,
            message:"Không tìm thấy ghi chú"
        })
        
    }
    
    

    note = await Note.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        note
    })

})
