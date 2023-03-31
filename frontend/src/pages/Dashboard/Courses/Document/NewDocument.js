import React, { useState, useEffect } from "react";
import Loader from '../../../../components/layout/Loader'
import MetaData from "../../../../components/layout/MetaData";
import Sidebar from '../../Sidebar'
import { useAlert } from 'react-alert'
import {  newDocument, clearErrors, getCourseDocuments, deleteDocument, getCourseTopics } from '../../../../actions/courseActions'
import { useDispatch, useSelector } from 'react-redux'
import { NEW_DOCUMENT_RESET,DELETE_DOCUMENT_RESET } from '../../../../constants/courseConstants'
import DocumentForm from "./DocumentForm";
import DocumentList from "./DocumentList";

const NewDocument = ({match}) => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, documents,error } = useSelector(state => state.docs)
  const { error: docError, success } = useSelector(state => state.newDoc)
  const { error: deleteError, isDeleted } = useSelector(state => state.doc)
  const {  topics } = useSelector(state => state.courseTopics)
  useEffect(() => {
    dispatch(getCourseDocuments(match.params.id))

    dispatch(getCourseTopics(match.params.id))
    
        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }

    if (docError) {
        alert.error(docError);
        dispatch(clearErrors())
    }
    
    if (success) {
        alert.success('Đăng tải thành công')
        dispatch({ type: NEW_DOCUMENT_RESET })
    }

    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors())
    }

    if (isDeleted) {
        alert.success('Xóa thành công');
        dispatch({ type: DELETE_DOCUMENT_RESET })
    }

}, [dispatch, alert, error,docError,success,deleteError, isDeleted, match.params.id])


  const deleteDocumentHandler = (id) => {
    dispatch(deleteDocument(id))
  }
  return (
    <>
      <MetaData title={'Những tài liệu mới'} />
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
                  <DocumentForm topics={topics} courseId={match.params.id} newDocument={newDocument}/>
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
                  <DocumentList  documents={documents} deleteDocumentHandler={deleteDocumentHandler} />
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

export default NewDocument;
