import React, { useEffect, useState } from "react";
import { useParams, Link, useHistory, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import copy from "copy-to-clipboard";

import upvote from "../../../assets/sort-up.svg";
import downvote from "../../../assets/sort-down.svg";
import "./Questions.css";
import { Avatar, Button, Modal, Space, Table ,Tag } from 'antd';
import DisplayAnswer from "./DisplayAnswer";
import {
  postAnswer,
  deleteQuestion,
  voteQuestion,
  markSolvedQuestion,
} from "../../../actions/questionAction";
import Loader from "../../../components/layout/Loader";
import { useAlert } from "react-alert";
import { fetchAllQuestions } from "../../../actions/questionAction";
import { MARK_SOLVED_RESET } from "../../../constants/questionContant";
import Editor from "../../../components/editor/Editor";

const columns = [
  {
    title: 'Câu trả lời',
    dataIndex: 'answerBody'
  },
  {
    title: 'Người trả lời',
    dataIndex: 'userAnswered',
  }
];




const QuestionsDetails = () => {
  const { id } = useParams();
  const questionsList = useSelector((state) => state.questionsReducer);

  const history = useHistory();

  const { isUpdated, loading } =  useSelector(state => state.question);

  const { user } = useSelector(state => state.auth)

  const alert = useAlert()

  const [answeredUsers,setAnsweredUsers] = useState([])

  const [Answer, setAnswer] = useState("");
  const Navigate = useHistory();
  const dispatch = useDispatch();
  const User = useSelector((state) => state.auth.user);
  const location = useLocation();
  const url = process.env.REACT_APP_URL;

  useEffect(() => {
    dispatch(fetchAllQuestions())
    if (isUpdated) {
      dispatch(fetchAllQuestions())
      alert.success('Câu hỏi đã được giải quyết');
      dispatch({type:MARK_SOLVED_RESET})
    }

  },[dispatch,isUpdated,loading])




  const handlePostAns = (e, answerLength) => {
    e.preventDefault();
    if (User === null) {
      alert.error("Đăng nhập hoặc đăng ký để trả lời câu hỏi");
      Navigate.push("/login");
    } else {
      if (Answer === "") {
        alert.info("Không được để trống phần trả lời");
      } else {
        dispatch(
          postAnswer({
            id,
            noOfAnswers: answerLength + 1,
            answerBody: Answer,
            userAnswered: User.name,
          })
        );
        setAnswer("");
      }
    }
  };

  const handleShare = () => {
    copy(url + location.pathname);
    alert.success("Sao chép thành công. Bạn có thế dán vào bất kỳ chỗ nào khác");
  };

  const handleDelete = () => {
    dispatch(deleteQuestion(id, Navigate));
  };

  const handleUpVote = () => {
    if (User === null) {
      alert.error("Đăng nhập hoặc đăng ký để trả lời câu hỏi");
      Navigate.push("/login");
    } else {
      dispatch(voteQuestion(id, "upVote"));
    }
  };

  const handleDownVote = () => {
    if (User === null) {
      alert.error("Đăng nhập hoặc đăng ký để trả lời câu hỏi");
      Navigate.push("/login");
    } else {
      dispatch(voteQuestion(id, "downVote"));
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = (id) => {
    if(answeredUsers.length !== 0){
      dispatch(markSolvedQuestion(id,answeredUsers))
   
      setIsModalOpen(false);
    }else{
      alert.error("Chưa có câu trả lời nên không thể hoàn thành")
    }

  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

 const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    setAnsweredUsers(selectedRows.map(item => item.userId))
  },
};

console.log(answeredUsers);

  return (
    <div className="container mt-2">
      {questionsList.data === null || loading ? (
        <Loader/>
      ) : (
        <>
          {questionsList.data
            .filter((question) => question._id === id)
            .map((question) => (
              <div key={question._id}>
                <section className="question-details-container">
                  <Space>
                    <h1>{question.questionTitle}</h1>
                    {question.isSolved ? <Tag color="green" >Đã được giải quyết</Tag> :
                      (user?._id === question.user._id &&
                      <Button type="primary" onClick={showModal}>
                        Đánh dấu đã được giải quyết
                      </Button>
                      )
                    }
                    <Modal title="Bạn được giải quyết bởi câu trả lời nào ?" width={1000} open={isModalOpen} onOk={()=>handleOk(question._id)} okText={"Hoàn thành"} onCancel={handleCancel} cancelText={"Hủy bỏ"}>
                      <div>

                        <Table
                          locale={{ emptyText: 'Không có dữ liệu' }}
                          rowSelection={{
                            type: "checkbox",
                            ...rowSelection
                          }}
                          columns={columns}
                          dataSource={question?.answer?.map(item => { item.key = item._id; return item })}
                        />
                      </div>
                    </Modal>
                  </Space>

                  
                  <div className="question-details-container-2">
                    <div className="question-votes">
                      <img
                        src={upvote}
                        alt=""
                        width="18"
                        className="votes-icon"
                        onClick={handleUpVote}
                      />
                      <p>{question.upVote.length - question.downVote.length}</p>
                      <img
                        src={downvote}
                        alt=""
                        width="18"
                        className="votes-icon"
                        onClick={handleDownVote}
                      />
                    </div>
                    <div style={{ width: "100%" }}>
                      <p className="question-body" dangerouslySetInnerHTML={{__html:question.questionBody}} ></p>
                     
                      <div className="question-details-tags">
                        {question.questionTags.map((tag) => (
                          <p key={tag}>{tag}</p>
                        ))}
                      </div>
                      <div className="question-actions-user">
                        <div>
                          <button type="button" onClick={handleShare}>
                            Lấy đường dẫn chia sẻ
                          </button>
                          {User?._id === question?.user?._id && (
                            <button type="button" onClick={handleDelete}>
                              Xóa
                            </button>
                          )}
                        </div>
                        <div>
                          <p>đã đặt ra {moment(question.askedOn).fromNow()} bởi</p>
                          <Link
                            to={`/profile/${question.user?._id}`}
                            className="user-link"
                            style={{ color: "#0086d8" }}
                          >
                            <Avatar
                              src={ process.env.REACT_APP_API_URL + question.user.avatar.url}
                            >
                            
                            </Avatar>
                            <div>{question.userPosted}</div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                {question.noOfAnswers !== 0 && (
                  <section>
                    <h3>{question.noOfAnswers} câu trả lời</h3>
                    <DisplayAnswer
                      key={question._id}
                      question={question}
                      handleShare={handleShare}
                    />
                  </section>
                )}
                {user?._id !== question.user._id &&
                <section className="post-ans-container">
                  <h3>Câu trả lời của bạn</h3>
                  <form
                    onSubmit={(e) => {
                      handlePostAns(e, question.answer.length);
                    }}
                  >

                    <Editor 
                      value={Answer} 
                      onChange={setAnswer}

                    />
                    <br />
                    <input
                      type="submit"
                      className="btn btn-success my-2"
                      value="Đăng câu trả lời của bạn"
                    />
                  </form>
                  <p>
                    Tìm câu hỏi cùng được gắn thẻ
                    {question.questionTags.map((tag) => (
                      <Link to={`/forum?keyword=${tag}`} key={tag} className="ans-tags">
                        {" "}
                        {tag}{" "}
                      </Link>
                    ))}{" "}
                    hoặc
                    <Link
                      to="/forum/ask"
                      style={{ textDecoration: "none", color: "#009dff" }}
                    >
                      {" "}
                      tự mình đặt câu hỏi
                    </Link>
                  </p>
                </section>
                }
              </div>
            ))}
        </>
      )}
    </div>
  );
};

export default QuestionsDetails;
