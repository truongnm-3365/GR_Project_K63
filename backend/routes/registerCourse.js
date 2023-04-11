const express = require('express');
const { getRegisterCourse, registerCourse, deleteRegisterCourse, completeVideo, completedVideo } = require('../controllers/registerCourseController');
const { isAuthenticatedUser } = require('../middlewares/auth');
const router = express.Router();


router.route('/getRegisterCourses').get(isAuthenticatedUser,getRegisterCourse)
router.route('/registerCourse/:id').post(isAuthenticatedUser,registerCourse)
router.route('/cancelRegister/:id').delete(isAuthenticatedUser,deleteRegisterCourse)
router.route('/completeVideo').post(isAuthenticatedUser,completeVideo)
router.route('/completedVideo').put(isAuthenticatedUser,completedVideo)
module.exports = router;