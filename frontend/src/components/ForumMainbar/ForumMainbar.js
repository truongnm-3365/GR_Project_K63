import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./ForumMainbar.css";
import QuestionList from "./QuestionList";
import { fetchAllQuestions } from "../../actions/questionAction";
import Loader from "../layout/Loader";

const useQuery = () => {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const ForumMainbar = () => {
  const location = useLocation();
  const history = useHistory();
  const query = useQuery();

  

  const keyword = query.get("keyword") || ""

  const [text,setText] = useState(keyword)
  
  const questionsList = useSelector((state) => state.questionsReducer);
  const { user } = useSelector(state => state.auth)

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllQuestions());
  }, [dispatch,keyword]);


  const checkAuth = () => {
    if (user === null) {
      alert("login or signup to ask a question");
      history.push("/login");
    } else {
      history.push("/forum/ask");
    }
  };

  const onSearch = (e) =>{
    e.preventDefault();
    history.push(`/forum?keyword=${text}`);
  }

  return (
    <div className="container mt-2">
      <div className="main-bar-header">
        {keyword ? <h2>Danh sách các câu hỏi liên quan đến "{keyword}"</h2> : <h2>Danh sách các câu hỏi</h2>}
        <button onClick={checkAuth} className="btn btn-success">
          Đặt câu hỏi
        </button>
      </div>
      <div>
        {questionsList.data === null ? (
          <Loader/>
        ) : (
          <>
            <p>{questionsList.data.length} câu hỏi</p>
            <form onSubmit={onSearch} className="form-inline float-right">
              <div className="form-group mx-sm-3 mb-2">
                <label for="inputText" className="sr-only">Tìm kiếm</label>
                <input onChange={e => setText(e.target.value)} type="text" className="form-control" id="inputText" placeholder="Tìm kiếm"/>
              </div>
              <button type="submit" className="btn btn-success mb-2">Tìm kiếm</button>
            </form>
            <QuestionList questionsList={questionsList.data.filter((item) => {
                return keyword === ''
                  ? item
                  : item.questionTitle.toLowerCase().includes(keyword.toLowerCase()) 
                    || item.questionBody.toLowerCase().includes(keyword.toLowerCase()) 
                    || item.questionTags.includes(keyword.toLowerCase()) ;
              })} />
          </>
        )}
      </div>
    </div>
  );
};

export default ForumMainbar;
