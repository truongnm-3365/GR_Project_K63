const express = require('express')
const router = express.Router();


const {
    getCourses,
    getMeCourses,
    newCourse,
    getSingleCourse,
    updateCourse,
    deleteCourse,
    createCourseReview,
    getCourseReviews,
    deleteReview,
    createCourseLesson,
    getCourseLessons,
    getAdminCourses,
    adminAcceptCourse

} = require('../controllers/courseController')

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if (!fs.existsSync("public")) {
        fs.mkdirSync("public");
      }
  
      if (!fs.existsSync("public/courses")) {
        fs.mkdirSync("public/courses");
      }
  
      cb(null, "public/courses");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
  });
  
  const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
      var ext = path.extname(file.originalname);
  
      if (ext !== ".jpg" && ext !== ".png" && ext !== '.jpeg' ) {
        return cb(new Error("Only images are allowed!"));
      }
  
      cb(null, true);
    },
  });

router.route('/courses').get(getCourses);
router.route('/me/courses/:userId').get(isAuthenticatedUser,getMeCourses);
router.route('/admin/courses').get(isAuthenticatedUser, authorizeRoles('admin'),getAdminCourses);
router.route('/course/:id').get(getSingleCourse);

//router.route('/course/new').post(isAuthenticatedUser,newCourse);

router.post('/course/new',isAuthenticatedUser,
upload.fields([
    {
      name: "images",
      maxCount: 1000,
    },
  ]),newCourse)

router.route('/course/:id')
    .put(isAuthenticatedUser, upload.fields([
      {
        name: "images",
        maxCount: 1000,
      },
    ]),updateCourse)
    .delete(isAuthenticatedUser, deleteCourse);

router.route('/admin/course/accept/:id')
    .put(isAuthenticatedUser, authorizeRoles('admin'), adminAcceptCourse)

router.route('/admin/course/:id')
    .put(isAuthenticatedUser, authorizeRoles('admin'), updateCourse)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteCourse);


router.route('/review').put(isAuthenticatedUser, createCourseReview)
router.route('/reviews').get(isAuthenticatedUser, getCourseReviews)
router.route('/reviews').delete(isAuthenticatedUser, deleteReview)

router.route('/lesson').put(isAuthenticatedUser, createCourseLesson)
router.route('/lessons').get(isAuthenticatedUser, getCourseLessons)


module.exports = router;