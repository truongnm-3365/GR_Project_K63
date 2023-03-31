import React, { useState, useEffect } from "react";

import Loader from '../../../../components/layout/Loader'
import MetaData from "../../../../components/layout/MetaData";
import Sidebar from '../../Sidebar'
import { useAlert } from 'react-alert'
import {   clearErrors, deleteQuiz, getTopicQuizs, newQuiz } from '../../../../actions/courseActions'
import { useDispatch, useSelector } from 'react-redux'
import { NEW_QUIZ_RESET,DELETE_QUIZ_RESET, UPDATE_QUIZ_RESET } from '../../../../constants/courseConstants'
import QuizForm from "./QuizForm";
import QuizList from "./QuizList";

const NewQuiz = ({match}) => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, quizs,error } = useSelector(state => state.topicQuizs)
  const { error: quizError, success } = useSelector(state => state.newQuiz)
  const { error: crudError, isDeleted, isUpdated } = useSelector(state => state.quiz)
  console.log(quizs)
  useEffect(() => {
    dispatch(getTopicQuizs(match.params.id))

        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }

    if (quizError) {
        alert.error(quizError);
        dispatch(clearErrors())
    }
    
    if (success) {
        alert.success('Thành công')
        dispatch({ type: NEW_QUIZ_RESET })
    }

    if (crudError) {
      alert.error(crudError);
      dispatch(clearErrors())
    }

    if (isDeleted) {
        alert.success('Xóa thành công');
        dispatch({ type: DELETE_QUIZ_RESET })
    }
    if (isUpdated) {
      alert.success('Cập nhật thành công');
      dispatch({ type: UPDATE_QUIZ_RESET })
  }

}, [dispatch, alert, error,quizError,success,crudError, isDeleted,isUpdated, match.params.id])

  const deleteQuizHandler = (id) => {
    dispatch(deleteQuiz(id))
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
                  <QuizForm topicId={match.params.id}/>
                </div>
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
                  <QuizList  quizs={quizs} deleteQuizHandler={deleteQuizHandler} />
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

export default NewQuiz;
