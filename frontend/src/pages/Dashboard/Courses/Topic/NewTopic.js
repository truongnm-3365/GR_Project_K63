import React, { useState, useEffect } from "react";

import Loader from '../../../../components/layout/Loader'
import MetaData from "../../../../components/layout/MetaData";
import Sidebar from '../../Sidebar'
import { useAlert } from 'react-alert'
import {  newTopic, clearErrors, getCourseTopics, deleteTopic,updateTopic } from '../../../../actions/courseActions'
import { useDispatch, useSelector } from 'react-redux'
import { NEW_TOPIC_RESET,DELETE_TOPIC_RESET, UPDATE_TOPIC_RESET } from '../../../../constants/courseConstants'
import TopicForm from "./TopicForm";
import TopicList from "./TopicList";
import FinalTestTopicForm from "./FinalTestTopicForm";

const NewTopic = ({match}) => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, topics,error } = useSelector(state => state.courseTopics)
  const { error: topicError, success } = useSelector(state => state.newTopic)
  const { error: crudError, isDeleted, isUpdated } = useSelector(state => state.topic)

  const isHaveFinalTest = () =>{

    for(let i = 0; i< topics.length; i++){
      if(topics[i].isFinalTest === true){
        return true
      }
    }
    return false
  }
  useEffect(() => {
    dispatch(getCourseTopics(match.params.id))

        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }

    if (topicError) {
        alert.error(topicError);
        dispatch(clearErrors())
    }
    
    if (success) {
        alert.success('Đăng tải thành công')
        dispatch({ type: NEW_TOPIC_RESET })
    }

    if (crudError) {
      alert.error(crudError);
      dispatch(clearErrors())
    }

    if (isDeleted) {
        alert.success('Xóa thành công');
        dispatch({ type: DELETE_TOPIC_RESET })
    }
    if (isUpdated) {
      alert.success('Cập nhật thành công');
      dispatch({ type: UPDATE_TOPIC_RESET })
  }

}, [dispatch, alert, error,topicError,success,crudError, isDeleted,isUpdated, match.params.id])

  const deleteTopicHandler = (id) => {
    dispatch(deleteTopic(id))
  }
  return (
    <>
      <MetaData title={'Những bài học mới'} />
      <div className="row">
        <div className="col-12 col-md-2">
          <Sidebar />
        </div>

        <div className="col-12 col-md-10">
          <div className="row">
            <div className="col-md-5">
              <div
                className="card"
                style={{
                  height: "auto",
                  width: "auto",
                  margin: "40px",
                  border: "1px solid black",
                  padding:"10px"
                }}
              >
                <div className="card-body">
                  <TopicForm courseId={match.params.id} newTopic={newTopic}/>
                </div>
                {!isHaveFinalTest() &&
                <div className="card-body">
                  <FinalTestTopicForm courseId={match.params.id} newTopic={newTopic}/>
                </div>}
                
              </div>
            </div>
            <div className="col-md-7">
              <div
                className="card"
                style={{
                  height: "auto",
                  width: "auto",
                  margin: "40px",
                  border: "1px solid black",
                  padding:"10px"
                }}
              >
                {loading ? <Loader /> :
                <div className="card-body">
                  <TopicList  topics={topics} deleteTopicHandler={deleteTopicHandler} />
                </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default NewTopic;
