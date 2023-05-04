const { isAuthenticatedUser } = require ("../middlewares/auth.js");

const express = require("express");

const { postAnswer, deleteAnswer } = require("../controllers/answersController.js");

const router = express.Router();

router.patch("/post/:id", isAuthenticatedUser, postAnswer);
router.patch("/delete/:id", isAuthenticatedUser, deleteAnswer);


module.exports = router;
