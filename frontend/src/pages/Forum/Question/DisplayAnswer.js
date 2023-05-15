import React from "react";
import moment from "moment";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Avatar } from 'antd';

import { deleteAnswer } from "../../../actions/questionAction";

const DisplayAnswer = ({ question, handleShare }) => {
  const User = useSelector((state) => state.auth.user);
  const { id } = useParams();
  const dispatch = useDispatch();
  const handleDelete = (answerId, noOfAnswers) => {
    dispatch(deleteAnswer(id, answerId, noOfAnswers - 1));
  };
  return (
    <div>
      {question.answer.map((ans) => (
        <div className="display-ans" key={ans._id}>
          <p>{ans.answerBody}</p>
          <div className="question-actions-user">
            <div>
              <button type="button" onClick={handleShare}>
                Chia sẻ
              </button>
              {User?._id === ans?.userId && (
                <button
                  type="button"
                  onClick={() => handleDelete(ans._id, question.noOfAnswers)}
                >
                  Xóa
                </button>
              )}
            </div>
            <div>
              <p>đã trả lời {moment(ans.answeredOn).fromNow()}</p>
              <Link
                to={`/profile/${ans.userId}`}
                className="user-link"
                style={{ color: "#0086d8" }}
              >
                <Avatar
                  src={process.env.REACT_APP_API_URL + ans.userAvatar}
                >
                  
                </Avatar>
                <div>{ans.userAnswered}</div>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DisplayAnswer;
