const express = require("express");

const {
  AskQuestion,
  getAllQuestions,
  deleteQuestion,
  voteQuestion,
}= require("../controllers/questionsController.js");

const { isAuthenticatedUser } = require('../middlewares/auth');

const router = express.Router();

router.post("/Ask",isAuthenticatedUser, AskQuestion);
router.get("/get", getAllQuestions);
router.delete("/delete/:id",isAuthenticatedUser, deleteQuestion);
router.patch("/vote/:id",isAuthenticatedUser, voteQuestion);

module.exports = router;
