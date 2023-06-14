import React from "react";
import { Link, useHistory } from "react-router-dom";
import moment from "moment";
import 'moment/locale/vi';
import { Tag } from "antd";


const Questions = ({ question }) => {
  const history = useHistory();
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
        
        <Link to={`/forum/questions/${question?._id}`} className="question-title-link mr-3">
          {question?.questionTitle.length > (window.innerWidth <= 400 ? 70 : 90)
            ? question?.questionTitle.substring(
                0,
                window.innerWidth <= 400 ? 70 : 90
              ) + "..."
            : question?.questionTitle}
        </Link>
        {question.isSolved && <Tag color="green">Đã giải quyết</Tag>}
        <div className="display-tags-time">
          <div className="display-tags">
            {question?.questionTags.map((tag) => (
              <p style={{cursor:'pointer'}} onClick={(() => history.push(`/forum?keyword=${tag}`))} key={tag}>{tag}</p>
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
