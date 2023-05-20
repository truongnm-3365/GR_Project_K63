import React from "react";
import { Button, Divider, List, Typography } from 'antd';
const QuizList = ({ quizs,deleteQuizHandler }) => {
  return (
    <div className="row">
      <div className="col-md-12">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Danh sách các câu hỏi</th>
              <th>Câu trả lời</th>
            </tr>
          </thead>
          <tbody>
            {quizs &&
              quizs.map((quiz) => {
                return (
                  <tr>
                    <td>
                      {quiz.question}
                      <Button className="float-right" onClick={() => deleteQuizHandler(quiz._id)}>Xóa</Button>
                    </td>
                    <td>
                    <ul className="list-group">
                      {quiz.choice && quiz.choice.map((choice,index) => {
                        return (
                          <li index={index} class="list-group-item d-flex justify-content-between align-items-center">
                            {choice.body}
                            {choice.isCorrect &&<span className="badge badge-success badge-pill">Đáp án đúng</span>}
                           
                          </li>
                        )
                      })}
                    </ul>
                    </td>
                    
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuizList;
