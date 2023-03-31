import React, { useState, useEffect } from "react";
import { useAlert } from 'react-alert'
import { useDispatch } from 'react-redux'

const DocumentForm = ({courseId, newDocument,topics }) => {
  const [name, setName] = useState("");
  const [topicId,setTopicId] = useState('');
  const [documents, setDocuments] = useState([]);
 
  const alert = useAlert();
  const dispatch = useDispatch();
  
 useEffect(() =>{
  if(topics.length > 0)
    setTopicId(topics[0]._id)
 },[topics])

  const hadleSubmit = (e) => {
    e.preventDefault();

    let formdata = new FormData();
    for (let key in documents) {
      formdata.append("documents", documents[key]);
    }

    formdata.append("name", name);
    formdata.append("courseId",courseId);
    formdata.append("topicId",topicId)
    setName("");
    dispatch(newDocument(formdata));

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
          <label htmlFor="name">Chủ đề</label>
          <select className="form-control" value={topicId} onChange={(e) => setTopicId(e.target.value)}>
            {topics && topics.map(topic => {
              return <option key={topic._id} value={topic._id}>{topic.name}</option>
            })} 
            
            
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="documents">Đăng tải document bài giảng</label>
          <input
            type="file"
            name="documents"
            id="documents"
            className="form-control"
            accept=".pdf"
            
            onChange={(e) => {
              setDocuments(e.target.files);
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

export default DocumentForm;
