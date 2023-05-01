import React, { useState, useEffect } from "react";
import { useAlert } from 'react-alert'
import { useDispatch } from 'react-redux'

const FinalTestTopicForm = ({courseId, newTopic }) => {
  const [name, setName] = useState("");
  const alert = useAlert();
  const dispatch = useDispatch();
  
  const hadleSubmit = (e) => {
    e.preventDefault();

    dispatch(newTopic({name:"Bài kiểm tra cuối khóa",courseId,isFinalTest:true}));

  };

  return (
    <>
      <form onSubmit={hadleSubmit}>

        <button type="submit" className="btn btn-primary mt-2">
          Thêm bài kiểm tra cuối khóa
        </button>
      </form>
    </>
  );
};

export default FinalTestTopicForm;
