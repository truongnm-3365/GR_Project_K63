import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import {Button, Input, Modal } from 'antd'
import { useAlert } from "react-alert";
import { updateTopic } from "../../../../actions/courseActions";



const TopicList = ({ topics,deleteTopicHandler }) => {

  const dispatch = useDispatch();

  const [topicName,setTopicName] = useState("")
  const [topicId,setTopicId] = useState("");
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);

  const showModalEdit = (name,id) => {
    setTopicName(name)
    setTopicId(id)

    setIsModalEditOpen(true);
  };
  const handleOkEdit = (id) => {
    if(topicName){
      dispatch(updateTopic(id,{name:topicName})) 
    }
    setIsModalEditOpen(false);
  };
  const handleCancelEdit = () => {
    setIsModalEditOpen(false);
  };

  const [isModalOpenDel, setIsModalOpenDel] = useState(false);
  const showModalDel = (id) => {
    setTopicId(id)
    setIsModalOpenDel(true);
  };
  const handleOkDel = (id) => {
    deleteTopicHandler(id)
    setIsModalOpenDel(false);
  };
  const handleCancelDel = () => {
    setIsModalOpenDel(false);
  };


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
          <Modal title="Chỉnh sửa" open={isModalEditOpen} onOk={() =>handleOkEdit(topicId)} onCancel={handleCancelEdit} okText={"Hoàn thành"} cancelText={"Hủy bỏ"}>
            <Input value={topicName} onChange={(e) => setTopicName(e.target.value)} ></Input>
          </Modal>
          <Modal title="Xóa chủ đề" open={isModalOpenDel} onOk={() => handleOkDel(topicId)} onCancel={handleCancelDel} okText={"Hoàn thành"} cancelText={"Hủy bỏ"}>
            Bạn có chắc sẽ xóa chủ đề này
          </Modal>

            {topics &&
              topics.map((topic) => {
                return (
                  <tr>
                    <td>
                      {topic.name}
                      <Button  className="float-right" onClick={() => showModalDel(topic._id)}>Xóa</Button>
                      {!topic.isFinalTest && 
                      <Button type="primary" className="float-right mr-2"  onClick={() => showModalEdit(topic.name,topic._id)}>
                        Sửa 
                      </Button>
                      }

                    </td>
                    <td>
                    <Link to={`/me/topic/${topic._id}/quizs`} className="btn btn-success py-1 px-2">
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
