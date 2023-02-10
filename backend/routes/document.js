const express = require("express");
const documentController = require("../controllers/documentController");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync("public")) {
      fs.mkdirSync("public");
    }

    if (!fs.existsSync("public/documents")) {
      fs.mkdirSync("public/documents");
    }

    cb(null, "public/documents");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    var ext = path.extname(file.originalname);

    if (ext !== ".pdf" && ext !== ".docx" ) {
      return cb(new Error("Only documents are allowed!"));
    }

    cb(null, true);
  },
});

const router = express.Router();

//get all document
router.get("/all/:courseId", documentController.getAll);

router.get("/:courseId/:index", documentController.getDocument);

//post create new document
router.post(
  "/create",
  isAuthenticatedUser,
  upload.fields([
    {
      name: "documents",
      maxCount: 100,
    },
  ]),
  documentController.create
);

// router.delete(
//   "/delete/:id",
//   isAuthenticatedUser,
//   documentController.delete
// );

router.route("/delete/:id").delete(isAuthenticatedUser,documentController.delete)

module.exports = router;
