const mongoose = require ("mongoose");

const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Questions = require ("../models/questions");
const User = require("../models/user");


exports.postAnswer = catchAsyncErrors(async (req, res,next) => {
  const { id: _id } = req.params;
  const { noOfAnswers, answerBody, userAnswered } = req.body;
  const userId = req.user._id;
  const user = await User.findById(userId)
  const userAvatar = user.avatar.url

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("question unavailable...");
  }

  updateNoOfQuestions(_id, noOfAnswers);
  try {
    const updatedQuestion = await Questions.findByIdAndUpdate(_id, {
      $addToSet: { answer: [{ answerBody, userAnswered, userId, userAvatar }] },
    });
    res.status(200).json(updatedQuestion);
  } catch (error) {
    res.status(400).json("error in updating");
  }
});

const updateNoOfQuestions = catchAsyncErrors(async (_id, noOfAnswers) => {
  try {
    await Questions.findByIdAndUpdate(_id, {
      $set: { noOfAnswers: noOfAnswers },
    });
  } catch (error) {
    console.log(error);
  }
});

exports.deleteAnswer = catchAsyncErrors(async (req, res, next) => {
  const { id: _id } = req.params;
  const { answerId, noOfAnswers } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("Question unavailable...");
  }
  if (!mongoose.Types.ObjectId.isValid(answerId)) {
    return res.status(404).send("Answer unavailable...");
  }
  updateNoOfQuestions(_id, noOfAnswers);
  try {
    await Questions.updateOne(
      { _id },
      { $pull: { answer: { _id: answerId } } }
    );
    res.status(200).json({ message: "Successfully deleted..." });
  } catch (error) {
    res.status(405).json(error);
  }
});
