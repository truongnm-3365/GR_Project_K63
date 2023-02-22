const express = require('express');
const { getRegisterCourse, registerCourse, deleteRegisterCourse } = require('../controllers/registerCourseController');
const { isAuthenticatedUser } = require('../middlewares/auth');
const router = express.Router();


router.route('/getRegisterCourses').get(isAuthenticatedUser,getRegisterCourse)
router.route('/registerCourse/:id').post(isAuthenticatedUser,registerCourse)
router.route('/cancelRegister/:id').delete(isAuthenticatedUser,deleteRegisterCourse)
module.exports = router;