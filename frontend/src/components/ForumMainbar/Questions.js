import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import 'moment/locale/vi';


const Questions = ({ question }) => {
  return (
    <div className="display-question-container">
      <div className="display-votes-ans">
        <p>{question?.upVote.length - question?.downVote.length}</p>
        <p>Bình chọn</p>
      </div>
      <div className="display-votes-ans">
        <p>{question?.noOfAnswers}</p>
        <p>Trả lời</p>
      </div>
      <div className="display-question-details">
        <Link to={`/forum/questions/${question?._id}`} className="question-title-link">
          {question?.questionTitle.length > (window.innerWidth <= 400 ? 70 : 90)
            ? question?.questionTitle.substring(
                0,
                window.innerWidth <= 400 ? 70 : 90
              ) + "..."
            : question?.questionTitle}
        </Link>
        <div className="display-tags-time">
          <div className="display-tags">
            {question?.questionTags.map((tag) => (
              <p key={tag}>{tag}</p>
            ))}
          </div>
          <p className="display-time">
            {moment(question?.askedOn).locale('vi').fromNow()} bởi {question?.userPosted}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Questions;
