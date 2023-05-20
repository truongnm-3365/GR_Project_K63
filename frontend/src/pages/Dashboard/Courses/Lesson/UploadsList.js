import { Button, Form, Input, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCourseTopics, updateLesson } from "../../../../actions/courseActions";

const UploadsList = ({ topics,medias,deleteLessonHandler }) => {

  const dispatch = useDispatch();
  
  const [topicId,setTopicId] = useState("")
  const [videoName,setVideoName] = useState("")
  const [videoId,setVideoId] = useState("");
  const [videos,setVideos] = useState([]);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);

  const showModalEdit = (topic,id,vodName) => {
    setTopicId(topic)
    setVideoId(id)
    setVideoName(vodName)

    setIsModalEditOpen(true);
  };
  const handleOkEdit = (id) => {
    console.log(topicId,videoName);
    if(topicId && videoName ){
      let formdata = new FormData();
      for (let key in videos) {
        formdata.append("videos", videos[key]);
      }

      formdata.append("name", videoName);
      formdata.append("topicId",topicId)
      dispatch(updateLesson(id,formdata))
    }
    setIsModalEditOpen(false);
  };
  const handleCancelEdit = () => {
    setIsModalEditOpen(false);
  };

  const [isModalOpenDel, setIsModalOpenDel] = useState(false);
  const showModalDel = (id) => {
    setVideoId(id)
    setIsModalOpenDel(true);
  };
  const handleOkDel = (id) => {
    deleteLessonHandler(id)
    setIsModalOpenDel(false);
  };
  const handleCancelDel = () => {
    setIsModalOpenDel(false);
  };
  
  return (
    <div className="row">
      <div className="col-md-12">
        <Modal title="Chỉnh sửa" open={isModalEditOpen} onOk={() =>handleOkEdit(videoId)} onCancel={handleCancelEdit} okText={"Hoàn thành"} cancelText={"Hủy bỏ"}>
            <Form>
              <Form.Item label="Tên Video">
                <Input value={videoName} onChange={(e) => setVideoName(e.target.value)} ></Input>
              </Form.Item>
              <Form.Item label="Chủ đề">
                <Select value={topicId} options={topics?.map(item => { return {value:item._id,label:item.name}})} onChange={(value) => setTopicId(value)}></Select>
              </Form.Item>
              <Form.Item label="Video">
                <Input onChange={(e) => setVideos(e.target.files)} accept=".mp4, .mkv" type="file"></Input>
              </Form.Item>
            </Form>

            
        </Modal>
        <Modal title="Xóa chủ đề" open={isModalOpenDel} onOk={() => handleOkDel(videoId)} onCancel={handleCancelDel} okText={"Hoàn thành"} cancelText={"Hủy bỏ"}>
            Bạn có chắc sẽ xóa chủ đề này
        </Modal>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th width="180">Tiêu đề</th>
              <th width="180">Chủ đề</th>
              <th width="310">Bài giảng</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {medias &&
              medias.map((media) => {
                return (
                  <tr>
                    <td>{media.name}</td>
                    <td>{media.topic}</td>
                    <td>

                        <video
                            preload="auto"
                            width="320"
                            height="240"
                            controls
                            >
                              <source src={process.env.REACT_APP_API_URL + media.videos[0]} />
                              
                        </video>


                    </td>
                    <td>
                      <Button onClick={() => showModalEdit(media.topicId,media._id,media.name)}>Sửa</Button>
                      <Button onClick={() => showModalDel(media._id)}>Xóa</Button>
                    
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

export default UploadsList;
