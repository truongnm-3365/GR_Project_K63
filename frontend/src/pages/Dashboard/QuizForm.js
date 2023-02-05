import React, { useState, useEffect } from "react";
import { useAlert } from 'react-alert'
import { useDispatch } from 'react-redux'
import { Divider, List, Typography } from 'antd';
import { newQuiz } from "../../actions/courseActions";
const QuizForm = ({topicId}) => {
  const [question, setQuestion] = useState("");
  const [quantity,setQuantity] = useState([1]);
  const [choice,setChoice] = useState({})
  const [choices,setChoices] = useState([])
  const [correct,setCorrect] = useState(true)
  const alert = useAlert();
  const dispatch = useDispatch();
  console.log(question)
  const hadleSubmit = (e) => {
    e.preventDefault();

    let formdata = new FormData();

    formdata.append("question", question);
    formdata.append("topicId",topicId);
    formdata.append("choice",choices);

   
    dispatch(newQuiz({question,topicId,choice:choices}));
    setQuestion("");
    setChoices([]);
    setChoice("");
  };

  const addChoice = () =>{
    setChoices(prev => [...prev,choice])
    
  }

  const deleteChoice = (body) => {
    let newChoices = choices.filter(choice => {
      if(choice.body !== body)
      return choice
    })

    setChoices(newChoices)
  }

  const addCorrect = (e) =>{
    let newChoices = choices.map(item => {
        if(item.body === e){
            return {body:item.body,isCorrect:true}
        }else{
            return {body:item.body,isCorrect:false}
        }
    })
    setChoices(newChoices)
  }

  return (
    <>
      <form onSubmit={(e) => hadleSubmit(e)}>
        <div className="form-group">
          <label htmlFor="name">Câu hỏi</label>
          <input
            type="text"
            name="question"
            id="question"
            value={question}  
            className="form-control"
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>

        <button style={{position:'absolute', bottom:'10px'}} type="submit" className="btn btn-success mt-2">
          Gửi
        </button>
      </form>
      <div className="form-group">
                <label htmlFor="name">Phương án lựa chọn</label>
                <input
                  type="text"
                  name="choice"
                 
                  className="form-control"
                  onChange={(e) => setChoice({body: e.target.value, isCorrect:false})}
                />
                <button onClick={() => addChoice()} className="mt-1 btn btn-success float-right">Thêm</button>
        </div>

        <div className="mb-5">
        {choices[0] ? <h4 className="mt-5">Danh sách đáp án</h4> : ''}
        <ul class="list-group">
          {choices && choices.map((choice,index) => {
            return (
              <li index={index} class="list-group-item d-flex justify-content-between align-items-center">
                {choice.body}
                {choice.isCorrect &&<span class="badge badge-primary badge-pill">Đáp án đúng</span>}
                <button onClick={() => addCorrect(choice.body)} className="btn btn-success float-right btn-sm mb-2">Đặt đúng</button>
                <button onClick={() => deleteChoice(choice.body)} className="btn btn-success float-right btn-sm mb-2">Xóa</button>
              </li>
            )
          })}
        </ul>
        </div>
        
    </>
  );
};

export default QuizForm;
