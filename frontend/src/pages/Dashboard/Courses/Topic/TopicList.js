import React from "react";
import { Link } from "react-router-dom";

const TopicList = ({ topics,deleteTopicHandler }) => {
  return (
    <div className="row">
      <div className="col-md-12">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Danh sách các chủ đề</th>
              <th>Câu hỏi & bài tập</th>
            </tr>
          </thead>
          <tbody>
            {topics &&
              topics.map((topic) => {
                return (
                  <tr>
                    <td>
                      {topic.name}
                      <button className="float-right" onClick={() => deleteTopicHandler(topic._id)}>Xóa</button>
                    </td>
                    <td>
                    <Link to={`/me/topic/${topic._id}/quizs`} className="btn btn-primary py-1 px-2">
                        <i className="fa fa-eye"></i>
                    </Link>
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

export default TopicList;
