const express = require('express');
const { newBanner, updateBanner, deleteBanner, getBanners, getBanner } = require('../controllers/bannerController');
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if (!fs.existsSync("public")) {
        fs.mkdirSync("public");
      }
  
      if (!fs.existsSync("public/banners")) {
        fs.mkdirSync("public/banners");
      }
  
      cb(null, "public/banners");
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
router.route('/banners').get(getBanners);
router.route('/admin/banner/:id').get(isAuthenticatedUser, authorizeRoles('admin'), getBanner)
router.route('/admin/banner/new').post(isAuthenticatedUser,authorizeRoles('admin'), upload.fields([
    {
      name: "images",
      maxCount: 1000,
    },
  ]),newBanner);
router.route('/admin/banner/update/:id').put(isAuthenticatedUser,authorizeRoles('admin'),upload.fields([
    {
      name: "images",
      maxCount: 1000,
    },
  ]),updateBanner);
router.route('/admin/banner/delete/:id').delete(isAuthenticatedUser,authorizeRoles('admin'), deleteBanner);

module.exports = router;