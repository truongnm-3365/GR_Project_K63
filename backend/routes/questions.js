const express = require("express");

const {
  AskQuestion,
  getAllQuestions,
  deleteQuestion,
  voteQuestion,
  markSolveQuestion,
}= require("../controllers/questionsController.js");

const { isAuthenticatedUser } = require('../middlewares/auth');

const router = express.Router();

router.post("/Ask",isAuthenticatedUser, AskQuestion);
router.get("/get", getAllQuestions);
router.delete("/delete/:id",isAuthenticatedUser, deleteQuestion);
router.patch("/vote/:id",isAuthenticatedUser, voteQuestion);
router.put("/mark-solved/:id",isAuthenticatedUser,markSolveQuestion);

module.exports = router;
