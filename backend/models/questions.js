const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  questionTitle: { type: String, required: "Question must have a title" },
  questionBody: { type: String, required: "Question must have a body" },
  questionTags: { type: [String], required: "Question must have a tags" },
  noOfAnswers: { type: Number, default: 0 },
  upVote: { type: [String], default: [] },
  downVote: { type: [String], default: [] },
  userPosted: { type: String, required: "Question must have an author" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  askedOn: { type: Date, default: Date.now },
  answer: [
    {
      answerBody: String,
      userAnswered: String,
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      userAvatar: String,
      answeredOn: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Question", QuestionSchema);
