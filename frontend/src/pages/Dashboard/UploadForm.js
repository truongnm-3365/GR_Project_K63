import React, { useState, useEffect } from "react";
import { useAlert } from 'react-alert'
import { useDispatch } from 'react-redux'

const UploadForm = ({courseId, newLesson }) => {
  const [name, setName] = useState("");
  const [videos, setVideos] = useState([]);
  const [videoName, setVideoName] = useState("");
  const alert = useAlert();
  const dispatch = useDispatch();
  
  const hadleSubmit = (e) => {
    e.preventDefault();

    let formdata = new FormData();
    for (let key in videos) {
      formdata.append("videos", videos[key]);
    }

    formdata.append("name", name);
    formdata.append("courseId",courseId);
    setName("");
    console.log(videos.length)
    dispatch(newLesson(formdata));

  };

  return (
    <>
      <form onSubmit={hadleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Tiêu đề</label>
          <input
            type="text"
            name="name"
            id="name"
            value={name}  
            className="form-control"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="videos">Đăng tải video bài giảng</label>
          <input
            type="file"
            name="videos"
            id="videos"
            multiple
            className="form-control"
            accept=".mp4, .mkv"
            
            onChange={(e) => {
              setVideos(e.target.files);
            }}
          />
        </div>

        <button type="submit" className="btn btn-primary mt-2">
          Submit
        </button>
      </form>
    </>
  );
};

export default UploadForm;
