const Questions = require ("../models/questions");
const User = require("../models/user");
const mongoose = require ("mongoose");
const Notify = require("../models/notify");
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

exports.AskQuestion = catchAsyncErrors(async (req, res) => {
  const postQuestionData = req.body;
  const user = req.user._id;
  const postQuestion = new Questions({ ...postQuestionData, user });
  try {
    await postQuestion.save();
    res.status(200).json("Posted a question successfully");
  } catch (error) {
    console.log(error);
    res.status(409).json("Couldn't post a new question");
  }
});

exports.getAllQuestions = catchAsyncErrors(async (req, res) => {
  try {
    const questionList = await Questions.find().sort({ askedOn: -1 }).populate("user","avatar _id");
    res.status(200).json(questionList);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

exports.deleteQuestion = catchAsyncErrors(async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("question unavailable...");
  }

  try {
    await Questions.findByIdAndRemove(_id);
    res.status(200).json({ message: "successfully deleted..." });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});


exports.markSolveQuestion = catchAsyncErrors(async (req,res) =>{
  let question = await Questions.findById(req.params.id);

  let users = req.body.answeredUsers



  if (!question) {
      return next(new ErrorHandler('Question not found', 404));
  }

  for (let user of users){
    userTmp = await User.findById(user);

    await User.findByIdAndUpdate(user, { consumPoint: userTmp.consumPoint + 1 }, {
      new: true,
      runValidators: true,
      useFindAndModify: false
    });


    await Notify.create({

      user: user,
      content: `Bạn được cộng điểm do câu trả lời của bạn có ích đối với câu hỏi ${question.questionTitle}`,
      type: 2
    })



  }


  question = await Questions.findByIdAndUpdate(req.params.id, { isSolved:true }, {

    new: true,
      runValidators: true,
      useFindAndModify: false
  });




  res.status(200).json({
      success: true,
      question
  })
})

exports.voteQuestion = catchAsyncErrors(async (req, res) => {
  const { id: _id } = req.params;
  const { value } = req.body;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("question unavailable...");
  }

  try {
    const question = await Questions.findById(_id);
    const upIndex = question.upVote.findIndex((id) => id === String(userId));
    const downIndex = question.downVote.findIndex(
      (id) => id === String(userId)
    );

    if (value === "upVote") {
      if (downIndex !== -1) {
        question.downVote = question.downVote.filter(
          (id) => id !== String(userId)
        );
      }
      if (upIndex === -1) {
        question.upVote.push(userId);
      } else {
        question.upVote = question.upVote.filter((id) => id !== String(userId));
      }
    } else if (value === "downVote") {
      if (upIndex !== -1) {
        question.upVote = question.upVote.filter((id) => id !== String(userId));
      }
      if (downIndex === -1) {
        question.downVote.push(userId);
      } else {
        question.downVote = question.downVote.filter(
          (id) => id !== String(userId)
        );
      }
    }
    await Questions.findByIdAndUpdate(_id, question);
    res.status(200).json({ message: "voted successfully..." });
  } catch (error) {
    res.status(404).json({ message: "id not found" });
  }
});
