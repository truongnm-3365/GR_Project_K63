import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import "./AskQuestion.css";
import { askQuestion } from "../../../actions/questionAction";
import { useAlert } from "react-alert";
import Editor from "../../../components/editor/Editor";

const AskQuestion = () => {
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionBody, setQuestionBody] = useState("");
  const [questionTags, setQuestionTags] = useState("");

  const dispatch = useDispatch();
  const User = useSelector((state) => state.auth.user);
 
  const history = useHistory();

  const alert = useAlert()

  const handleSubmit = (e) => {
    e.preventDefault();
    if (User) {
      if (questionTitle && questionBody && questionTags) {
        dispatch(
          askQuestion(
            {
              questionTitle,
              questionBody,
              questionTags,
              userPosted: User.name,
            },
            history
          )
        );
      } else alert.error("Hãy nhập đầy đủ tất cả các trường");
    } else alert.error("Đăng nhập trước khi đặt câu hỏi");
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      setQuestionBody(questionBody + "\n");
    }
  };
  return (
    <div className="">
      <div className="ask-ques-container">
        <h1>Đặt câu hỏi</h1>
        <form onSubmit={handleSubmit}>
          <div className="ask-form-container">
            <div className="form-group">
              <label style={{fontSize:'20px'}} className="font-weight-bolder" htmlFor="ask-ques-title">Tiêu đề</label>
              <p style={{fontSize:'14px',marginTop:'-10px'}}>
                Hãy đặt tiêu đề thật cụ thể và ngắn gọn để người khác có thể dễ dàng hình dung
              </p>
                <input
                  type="text"
                  id="ask-ques-title"
                  className="form-control"
                  onChange={(e) => {
                    setQuestionTitle(e.target.value);
                  }}
                  placeholder="Nhập tiêu đề ..."
                                        
                />
            </div>

            <div className="form-group">
              <label style={{fontSize:'20px'}} className="font-weight-bolder" htmlFor="ask-ques-body">Nội dung</label>
              <p  style={{fontSize:'14px',marginTop:'-10px'}}>
                Hãy viết tất cả thông tin mà ai đó sẽ cần để trả lời câu hỏi của bạn
              </p>
                <Editor 
                  value={questionBody} 
                  onChange={setQuestionBody}

                />
            </div>

            <div className="form-group">
              <label style={{fontSize:'20px'}} className="font-weight-bolder" htmlFor="ask-ques-tags">Tag</label>
              <p  style={{fontSize:'14px',marginTop:'-10px'}}>
                Thêm tối đa 5 tag để mô tả nội dung câu hỏi của bạn
              </p>
              <input
                className="form-control"
                type="text"
                id="ask-ques-tags"
                onChange={(e) => {
                  setQuestionTags(e.target.value.split(","));
                }}
                placeholder="VD: (xml,typescript,wordpress)"
              />
            </div>
            

          </div>
          <input
            type="submit"
            value="Đưa lên diễn đàn"
            className="btn btn-success mt-2"
          />
        </form>
      </div>
    </div>
  );
};

export default AskQuestion;
