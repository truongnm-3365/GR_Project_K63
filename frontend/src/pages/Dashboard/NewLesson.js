import React, { useState, useEffect } from "react";
import axios from "axios";
import UploadForm from "./UploadForm";
import UploadsList from "./UploadsList";
import Loader from '../../components/layout/Loader'
import MetaData from "../../components/layout/MetaData";
import Sidebar from './Sidebar'
import { useAlert } from 'react-alert'
import {  newLesson, clearErrors, getCourseLessons, deleteLesson, getCourseTopics } from '../../actions/courseActions'
import { useDispatch, useSelector } from 'react-redux'
import { NEW_LESSON_RESET,DELETE_LESSON_RESET } from '../../constants/courseConstants'

const NewLesson = ({match}) => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, lessons,error } = useSelector(state => state.courseLessons)
  const { error: lessonError, success } = useSelector(state => state.newLesson)
  const { error: deleteError, isDeleted } = useSelector(state => state.lesson)
  const {  topics } = useSelector(state => state.courseTopics)
  useEffect(() => {
    dispatch(getCourseLessons(match.params.id))

    dispatch(getCourseTopics(match.params.id))
        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }

    if (lessonError) {
        alert.error(lessonError);
        dispatch(clearErrors())
    }
    
    if (success) {
        alert.success('Đăng tải thành công')
        dispatch({ type: NEW_LESSON_RESET })
    }

    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors())
    }

    if (isDeleted) {
        alert.success('Xóa thành công');
        dispatch({ type: DELETE_LESSON_RESET })
    }

}, [dispatch, alert, error,lessonError,success,deleteError, isDeleted, match.params.id])

console.log(topics);
  const deleteLessonHandler = (id) => {
    dispatch(deleteLesson(id))
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
                  <UploadForm topics={topics} courseId={match.params.id} newLesson={newLesson}/>
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
                }}
              >
                {loading ? <Loader /> :
                <div className="card-body">
                  <UploadsList  medias={lessons} deleteLessonHandler={deleteLessonHandler} />
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

export default NewLesson;
