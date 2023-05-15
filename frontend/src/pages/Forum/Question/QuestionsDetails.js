import React, { useState } from "react";
import { useParams, Link, useHistory, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import copy from "copy-to-clipboard";

import upvote from "../../../assets/sort-up.svg";
import downvote from "../../../assets/sort-down.svg";
import "./Questions.css";
import { Avatar } from 'antd';
import DisplayAnswer from "./DisplayAnswer";
import {
  postAnswer,
  deleteQuestion,
  voteQuestion,
} from "../../../actions/questionAction";
import Loader from "../../../components/layout/Loader";
import { useAlert } from "react-alert";

const QuestionsDetails = () => {
  const { id } = useParams();
  const questionsList = useSelector((state) => state.questionsReducer);
  const alert = useAlert()

  const [Answer, setAnswer] = useState("");
  const Navigate = useHistory();
  const dispatch = useDispatch();
  const User = useSelector((state) => state.auth.user);
  const location = useLocation();
  const url = "http://localhost:3000";

  const handlePostAns = (e, answerLength) => {
    e.preventDefault();
    if (User === null) {
      alert.error("Đăng nhập hoặc đăng ký để trả lời câu hỏi");
      Navigate.push("/login");
    } else {
      if (Answer === "") {
        alert.info("Không được để trống phần trả lời");
      } else {
        dispatch(
          postAnswer({
            id,
            noOfAnswers: answerLength + 1,
            answerBody: Answer,
            userAnswered: User.name,
          })
        );
        setAnswer("");
      }
    }
  };

  const handleShare = () => {
    copy(url + location.pathname);
    alert("Đường dẫn được sao chép : " + url + location.pathname);
  };

  const handleDelete = () => {
    dispatch(deleteQuestion(id, Navigate));
  };

  const handleUpVote = () => {
    if (User === null) {
      alert.error("Đăng nhập hoặc đăng ký để trả lời câu hỏi");
      Navigate.push("/login");
    } else {
      dispatch(voteQuestion(id, "upVote"));
    }
  };

  const handleDownVote = () => {
    if (User === null) {
      alert.error("Đăng nhập hoặc đăng ký để trả lời câu hỏi");
      Navigate.push("/login");
    } else {
      dispatch(voteQuestion(id, "downVote"));
    }
  };

  return (
    <div className="container mt-2">
      {questionsList.data === null ? (
        <Loader/>
      ) : (
        <>
          {questionsList.data
            .filter((question) => question._id === id)
            .map((question) => (
              <div key={question._id}>
                <section className="question-details-container">
                  <h1>{question.questionTitle}</h1>
                  <div className="question-details-container-2">
                    <div className="question-votes">
                      <img
                        src={upvote}
                        alt=""
                        width="18"
                        className="votes-icon"
                        onClick={handleUpVote}
                      />
                      <p>{question.upVote.length - question.downVote.length}</p>
                      <img
                        src={downvote}
                        alt=""
                        width="18"
                        className="votes-icon"
                        onClick={handleDownVote}
                      />
                    </div>
                    <div style={{ width: "100%" }}>
                      <p className="question-body">{question.questionBody}</p>
                      <div className="question-details-tags">
                        {question.questionTags.map((tag) => (
                          <p key={tag}>{tag}</p>
                        ))}
                      </div>
                      <div className="question-actions-user">
                        <div>
                          <button type="button" onClick={handleShare}>
                            Lấy đường dẫn chia sẻ
                          </button>
                          {User?._id === question?.user?._id && (
                            <button type="button" onClick={handleDelete}>
                              Xóa
                            </button>
                          )}
                        </div>
                        <div>
                          <p>đã đặt ra {moment(question.askedOn).fromNow()} bởi</p>
                          <Link
                            to={`/profile/${question.user?._id}`}
                            className="user-link"
                            style={{ color: "#0086d8" }}
                          >
                            <Avatar
                              src={ process.env.REACT_APP_API_URL + question.user.avatar.url}
                            >
                            
                            </Avatar>
                            <div>{question.userPosted}</div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                {question.noOfAnswers !== 0 && (
                  <section>
                    <h3>{question.noOfAnswers} câu trả lời</h3>
                    <DisplayAnswer
                      key={question._id}
                      question={question}
                      handleShare={handleShare}
                    />
                  </section>
                )}
                <section className="post-ans-container">
                  <h3>Câu trả lời của bạn</h3>
                  <form
                    onSubmit={(e) => {
                      handlePostAns(e, question.answer.length);
                    }}
                  >
                    <textarea
                      name=""
                      id=""
                      cols="30"
                      rows="10"
                      value={Answer}
                      onChange={(e) => setAnswer(e.target.value)}
                    ></textarea>
                    <br />
                    <input
                      type="submit"
                      className="btn btn-success my-2"
                      value="Đăng câu trả lời của bạn"
                    />
                  </form>
                  <p>
                    Tìm câu hỏi cùng được gắn thẻ
                    {question.questionTags.map((tag) => (
                      <Link to={`/forum?keyword=${tag}`} key={tag} className="ans-tags">
                        {" "}
                        {tag}{" "}
                      </Link>
                    ))}{" "}
                    hoặc
                    <Link
                      to="/forum/ask"
                      style={{ textDecoration: "none", color: "#009dff" }}
                    >
                      {" "}
                      tự mình đặt câu hỏi
                    </Link>
                  </p>
                </section>
              </div>
            ))}
        </>
      )}
    </div>
  );
};

export default QuestionsDetails;
