import React, { useState, useEffect } from "react";
import { useAlert } from 'react-alert'
import { useDispatch } from 'react-redux'

const TopicForm = ({courseId, newTopic }) => {
  const [name, setName] = useState("");
  const alert = useAlert();
  const dispatch = useDispatch();
  
  const hadleSubmit = (e) => {
    e.preventDefault();

    let formdata = new FormData();

    formdata.append("name", name);
    formdata.append("courseId",courseId);
    setName("");
    dispatch(newTopic({name,courseId}));

  };

  return (
    <>
      <form onSubmit={hadleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Tên chủ đề</label>
          <input
            type="text"
            name="name"
            id="name"
            value={name}  
            className="form-control"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary mt-2">
          Hoàn thành
        </button>
      </form>
    </>
  );
};

export default TopicForm;
