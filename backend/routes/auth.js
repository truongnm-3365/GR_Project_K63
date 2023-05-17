const express = require('express');

const authController = require("../controllers/authController");

const {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
    getUserProfile,
    updatePassword,
    updateProfile,
    logout,
    allUsers,
    getUserDetails,
    updateUser,
    deleteUser,
    getPublicUserProfile

} = require('../controllers/authController');



const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if (!fs.existsSync("public")) {
        fs.mkdirSync("public");
      }
  
      if (!fs.existsSync("public/avatar")) {
        fs.mkdirSync("public/avatar");
      }
  
      cb(null, "public/avatar");
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

const router = express.Router();


router.post("/register",
    upload.fields([
    {
      name: "avatar",
      maxCount: 1000,
    },
  ]),registerUser);

  
router.route('/login').post(loginUser);

router.route('/password/forgot').post(forgotPassword)
router.route('/password/reset/:token').put(resetPassword)

router.route('/logout').get(logout);

router.route('/me').get(isAuthenticatedUser, getUserProfile)

router.route('/profile/:id').get(getPublicUserProfile)
router.route('/password/update').put(isAuthenticatedUser, updatePassword)
router.route('/me/update').put(isAuthenticatedUser, upload.fields([
  {
    name: "avatar",
    maxCount: 100,
  },
]),updateProfile)


router.route('/admin/users').get(isAuthenticatedUser, authorizeRoles('admin'), allUsers)
router.route('/user').get(isAuthenticatedUser, authController.allUsersChat)
router.route('/admin/user/:id')
    .get(isAuthenticatedUser, authorizeRoles('admin'), getUserDetails)
    .put(isAuthenticatedUser, authorizeRoles('admin'), updateUser)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUser)

module.exports = router;