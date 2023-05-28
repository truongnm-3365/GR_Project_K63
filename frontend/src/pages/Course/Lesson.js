import { useEffect, useState } from "react";
import Loader from '../../components/layout/Loader'
import { clearErrors, getCourseLessons, getCourseLesson, getCourseTopics, getTopicQuizs, getCourseDetails, getCourseDocuments, newReview, getNotes, newNote, deleteNote } from '../../actions/courseActions'
import { useDispatch, useSelector } from 'react-redux'
import { NEW_LESSON_RESET,NEW_NOTE_RESET,NEW_REVIEW_RESET } from '../../constants/courseConstants'
import { Alert, Button, Collapse, Form, Layout, Modal, Progress, Space, Tabs, Typography } from 'antd';
import { useAlert } from 'react-alert'
import './index.css'
import Quiz from "../../components/quiz/Quiz";
import ListReviews from "../../components/review/ListReviews";
import { NEW_REGISTER_COURSE_RESET } from "../../constants/registerCourseContants";
import { comleteVideo, completedVideo, getMeRegisterCourses } from "../../actions/registerCourseAction";

import { useHistory } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";


const { Text } = Typography;


const Lessons = ({match}) => {
  const vid = document.getElementById("video");
  const { Panel } = Collapse;
  const dispatch = useDispatch();
  const history = useHistory();
  const alert = useAlert()
  const { loading, lessons,error } = useSelector(state => state.courseLessons)
  const { error: lessonError, success } = useSelector(state => state.newLesson)
  const {  topics } = useSelector(state => state.courseTopics)
  const {  quizs } = useSelector(state => state.topicQuizs)
  const { documents } = useSelector(state => state.docs)
  const { error: reviewError, success:reviewSuccess } = useSelector(state => state.newReview)
  const [index, setIndex] = useState(0)
  const [indexTopic,setIndexTopic] = useState(0)
  const [checked, setChecked] = useState([true])
  const [checkedExercise, setCheckedExercise] = useState([false])
  const [exercise,setExercise] = useState(false)
  const { course } = useSelector(state => state.courseDetails)
  const {user, isAuthenticated} = useSelector(state => state.auth)
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [videoTime, setVideoTime] = useState();
  const [isModalNoteOpen, setIsModalNoteOpen] = useState(false);
  const [isNoteListOpen, setIsNoteListOpen] = useState(false);
  const [note, setNote] = useState("");
  const { notes, loading:notesLoading } = useSelector(state => state.notes);
  const { registerCourses } = useSelector(state => state.registerCourses)
  const [register, setRegister] = useState(false)
  const [collapsed, setCollapsed] = useState(false);

  function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
  
    var hDisplay = h > 0 ? (h > 9 ? h : "0"+ h ) + ":"  : "";
    var mDisplay = m > 0 ? (m > 9 ? m : "0"+ m ) + ":" : "00:";
    var sDisplay = (s > 9 ? s : "0"+ s ) ;
    return hDisplay + mDisplay + sDisplay; 
  }
  

  

  const showModalNote = () => {
    setIsModalNoteOpen(true);
    vid.pause();
  };
  const handleOk = () => {


    if(!note){
      alert.error("Không được để trống ghi chú")
    }else{
      setIsModalNoteOpen(false);
      let data ={
        body: note,
        time: vid.currentTime,
        course: match.params.id,
        media: lessons[index]._id
      }
      dispatch(newNote(data))
      setNote("");
    }

    
  };

  const handleCancel = () => {
    setIsModalNoteOpen(false);
  };

  const showNoteList = () => {
    dispatch(getNotes(match.params.id))
    setIsNoteListOpen(true);
  };
  const handleListOk = () => {
    setIsNoteListOpen(false);

  };
  const handleListCancel = () => {
    setIsNoteListOpen(false);
  };
  
  const handleVideoTiem = (note) => { 
    
    setExercise(false);
    
    for( let i = 0; i < topics.length; i++){
      if(topics[i]._id === note.media.topicId){
        setIndexTopic(i);
        break;
      }
    }


    for( let i = 0; i < lessons.length; i++){
      
      if(lessons[i]._id === note.media._id){
        
        setVideoTime(note.time);
        setIndex(i);
        onChangeChecked(i)
        setIsNoteListOpen(false)
        
        break;
      }
    }
    
  } 




  const onChangeChecked = (index) =>{
    
    const newCheck = []
    for( let i=0; i < lessons.length + 1; i++){
      newCheck[i] = false;
    }
    newCheck[index] = true;
    setChecked(newCheck)
    setCheckedExercise([false])
    setIndex(index);
    
  }

  const onChangeCheckedExercise = (index) =>{
    const newCheck = []
    for( let i=0; i < topics.length; i++){
      newCheck[i] = false;
    } 

    newCheck[index] = true;
    setCheckedExercise(newCheck)
    setChecked([false])
  
  }


  const openInNewTab = (url) => {
    window.open(url, '_blank', 'noreferrer');
  };

  const { completeVideos } = useSelector(state => state.registerCourses)
  const { success: complete } = useSelector(state => state.newRegisterCourse)
  const { loading:videoLoading, isUpdated } = useSelector(state => state.registerCourse)
  
  const isRegister = () =>{
    if(isAuthenticated){
        for(let i =0; i < registerCourses?.length; i++){
            if(registerCourses[i].course === match.params.id){
              return true;
              
            }
        }
        return false
        
    }
    return false
  
  }


  useEffect(() => {
    dispatch(getCourseLessons(match.params.id))
    dispatch(getCourseTopics(match.params.id))
    dispatch(getCourseDetails(match.params.id))
    dispatch(getCourseDocuments(match.params.id))
    
    dispatch(getMeRegisterCourses())
    
    

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


    if (reviewError) {
      alert.error(reviewError);
      dispatch(clearErrors())
  }

  if (reviewSuccess) {
      alert.success('Đánh giá được đăng tải thành công')
      dispatch({ type: NEW_REVIEW_RESET })
  } 
  
  if (complete || isUpdated ) {
    dispatch({type: NEW_REGISTER_COURSE_RESET})
  }
    

}, [dispatch, alert, error,lessonError,success,match.params.id,checked,checkedExercise,reviewSuccess,complete,isUpdated,videoLoading,register,isAuthenticated])
  



function setUserRatings() {
  const stars = document.querySelectorAll('.star');

  stars.forEach((star, index) => {
      star.starValue = index + 1;

      ['click', 'mouseover', 'mouseout'].forEach(function (e) {
          star.addEventListener(e, showRatings);
      })
  })

  function showRatings(e) {
      stars.forEach((star, index) => {
          if (e.type === 'click') {
              if (index < this.starValue) {
                  star.classList.add('orange');

                  setRating(this.starValue)
              } else {
                  star.classList.remove('orange')
              }
          }

          if (e.type === 'mouseover') {
              if (index < this.starValue) {
                  star.classList.add('yellow');
              } else {
                  star.classList.remove('yellow')
              }
          }

          if (e.type === 'mouseout') {
              star.classList.remove('yellow')
          }
      })
  }
}

const reviewHandler = (e) => {
  e.preventDefault();
  let formData = new FormData();
  let formdata ={
      rating,
      comment,
      courseId: match.params.id
  }
  formData.append('rating', rating);
  formData.append('comment', comment);
  formData.append('courseId', match.params.id);

  dispatch(newReview(formdata));
}

const checkCompleteVideo = (mediaId) =>{
  if(user && completeVideos){
    for(let i = 0; i < completeVideos.length; i++){
      if(completeVideos[i].user === user._id && completeVideos[i].media === mediaId){
        return true
      }
    }
    return false
  }

}

const checkCompletedVideo = (mediaId) =>{
  if(completeVideos && user){
    for(let i = 0; i < completeVideos.length; i++){
      if(completeVideos[i].user === user._id && completeVideos[i].completed && completeVideos[i].media === mediaId){
        return true
      }
    }
    return false
  }

}



const checkCompletedTopic = (topicId) =>{

  if(completeVideos && user){
    const completedVideos = completeVideos.filter(item => item.topic === topicId && item.user === user._id)
    if(completedVideos.length === 0){
      return false;
    }
    
    for(let i = 0; i < completedVideos.length;  i++){
      if(!completedVideos[i].completed){
        return false
      }
    }
    return true
  }

}

const checkCompletedAllVideo = () =>{

  if(completeVideos && isAuthenticated){
    const completedVideos = completeVideos.filter(item => item.user === user._id && item.course === match.params.id)
    if(completedVideos.length === 0){
      return true;
    }

    for(let i = 0; i < completedVideos.length;  i++){
      if(!completedVideos[i].completed){
        console.log(completedVideos[i]);
        return false
      }
    }
    return true
  }

}

const checkCompletedCourse = () =>{
  if(isAuthenticated){
      for(let i = 0; i < registerCourses?.length; i++){
          if(registerCourses[i].course === match.params.id && registerCourses[i].isPassed === true ){
              return true
          }
      }
      return false
  }
  return false
}

const completedPercent = () =>{
  let completed = 0;
  const lessonIds = lessons?.map(item => item._id)
  if(completeVideos && isAuthenticated){
    console.log(completeVideos);
    for(let i = 0; i < completeVideos.length; i++){
      if(completeVideos[i].user === user._id && completeVideos[i].completed && completeVideos[i].course === match.params.id &&  lessonIds.includes(completeVideos[i].media)){
        completed = completed + 1;
      }
    }

    return ((completed/lessons.length)*0.9*100).toFixed(2)
  }
}

const items = [
  {
    key: '1',
    label: `Bài giảng`,
    children:            
      <table className="table table-bordered">
        <thead>
          <tr>
          
            <th>Bài giảng</th>
          </tr>
        </thead>
        <tbody>
        <tr>
          <td>
          {
            documents?.map((document) => {
              return (
                <>
                    {document.docs.map((doc) => {
                      return (
                        <span key={doc._id}>
                          <button
                            style={{width:'100px',height:'100px',marginRight:'10px',background:'white'}}
                            role="link"
                            onClick={() => openInNewTab(`http://localhost:4000${doc}`)}
                          >
                            <i style={{fontSize:'40px',color:'red'}} className="fa fa-file-pdf-o " aria-hidden="true"></i>
                            <div>{document.name}</div>
                          </button>

                        </span>

                      );
                    })}

                </>
              );
            })}
            </td>
            </tr>
        </tbody>
      </table>
      },
  ,
  {
    key: '2',
    label: `Đánh giá`,
    children:  <div className="">
    {user && checkCompletedCourse() ? <button  type="button" className="btn btn-success mb-2" data-toggle="modal" data-target="#ratingModal" onClick={setUserRatings}>
    Gửi đánh giá
    </button>
                        :
    <div className="alert alert-info mt-5" type='alert'>Hoàn thành khóa học để viết đánh giá</div>
    }
    <div className="row mt-2" style={{height:'0px'}}>
      <div className="rating w-50">

          <div className="modal fade" id="ratingModal" tabIndex="-1" role="dialog" aria-labelledby="ratingModalLabel" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="ratingModalLabel">Đánh giá</h5>
                                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div className="modal-body">

                                            <ul className="stars" >
                                                <li className="star"><i className="fa fa-star"></i></li>
                                                <li className="star"><i className="fa fa-star"></i></li>
                                                <li className="star"><i className="fa fa-star"></i></li>
                                                <li className="star"><i className="fa fa-star"></i></li>
                                                <li className="star"><i className="fa fa-star"></i></li>
                                            </ul>

                                            <textarea
                                                name="review"
                                                id="review" className="form-control mt-3"
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                            >

                                            </textarea>

                                            <button className="btn my-3 float-right review-btn px-4 text-white" onClick={(e) => reviewHandler(e)} data-dismiss="modal" aria-label="Close">Gửi</button>
                                        </div>
                                    </div>
                                </div>
                  </div>

              </div>
    </div>
    
    {course.details && course.details.reviews && course.details.reviews.length > 0 && (
      <ListReviews ratings={course.details.ratings} reviews={course.details.reviews} />
    )}
  </div>,
  },
];





return (
    <>
        {isRegister() ?
        (loading  ? <Loader/> :
        <div className="" style={{marginRight:'8%',marginLeft:'8%'}}>

        <div className="mt-3">
          <Button onClick={showModalNote}>Thêm ghi chú </Button>
          <Modal title={"Thêm ghi chú tại: " + secondsToHms(vid?.currentTime)} open={isModalNoteOpen} width={1000} onOk={handleOk} onCancel={handleCancel} okText={"Hoàn thành"} cancelText={"Hủy bỏ"}>
            
            <TextArea onChange={(e) => setNote(e.target.value)} rows={4} />
  
          </Modal>

          {vid &&<Button onClick={showNoteList}>Danh sách ghi chú </Button>}
          <Modal title={"Danh sách ghi chú"} open={isNoteListOpen} onOk={handleListOk} onCancel={handleListCancel} cancelText={"Hủy bỏ"}  width={1000}>
              {!notesLoading ? notes.map(item => {
                return <div key={item._id} className="mb-3">
                    <Button danger onClick={() => handleVideoTiem(item) }>{secondsToHms(item.time)}</Button>
                    <Button onClick={() => handleVideoTiem(item)} type="link"> <Text type="danger">{item.media.name} </Text> <Text strong>.{item.media.topic}</Text></Button>
                    <Button className="float-right" onClick={() => {dispatch(deleteNote(item._id));handleListCancel();showNoteList()}} >Xóa</Button>
                    <div> <Text>{item.body}</Text></div>
                </div>
              })
              : 
              <Loader/>
              }

             
          </Modal>
        </div>
                  
        <div className="row mt-2" style={{position:'relative'}}>
        {exercise === false  && lessons.length !== 0 &&
              <div className="col-md-9">
                <span style={{display:'none'}}>
                { 
                  typeof videoTime === 'number' && isFinite(videoTime) && vid && (vid.currentTime = videoTime )
                }
                </span>

                <video
                    id="video"
                    onEnded={() => {
                      if(lessons[index +1]){
                        let data={
                          course: match.params.id,
                          topic: lessons[index + 1].topicId,
                          media: lessons[index + 1]._id
                        }
                        dispatch(comleteVideo(data))
                      }


                      let tmp={
                        course: match.params.id,
                        topic: lessons[index].topicId,
                        media: lessons[index]._id
                      }
                     
                      dispatch(completedVideo(tmp))
                    }}
                    controls
                    
                  >
                    <source type="video/mp4" src={ lessons[index] ? process.env.REACT_APP_API_URL + lessons[index].videos : ""} />
                </video>
                <h3 className="mt-2">{lessons[index].name}</h3>
            
              </div>
            } 

            {exercise ? <Quiz quizs={quizs}/> : ''}

      <div className="col-md-3" style={{position:'absolute',right:'0'}}>
          <Space size={30}>
            <h5>Mức độ hoàn thành</h5>
            <Progress type="circle" percent={ checkCompletedCourse() ? 100 : completedPercent()} size={"small"}  strokeColor={{'0%': '#006241','100%': '#87d068',}} format={() => checkCompletedCourse() ? '100%' : completedPercent()+'%'}/>
          </Space>
      
          <div className="season_tabs">
            {topics[indexTopic] &&
            <Collapse defaultActiveKey={[topics[indexTopic]._id]}>
            {topics && topics.map((topic,indexTopic) => {
              return (
                <Panel  header={topic.name} key={topic._id}>
                   {lessons &&
                    lessons.map((lesson,index) => {
                      if(lesson.topicId === topic._id){
                        return (
                          <>
                            {checkCompleteVideo(lesson._id) ? 
                            <div key={lesson._id} className="season_tab">
                            {index === 0 ? 
                              <input  onChange={() => {onChangeChecked(index);setIndexTopic(indexTopic);setExercise(false);setVideoTime(0)}} type="radio" id={`tab-${index+1}`} name={`tab-group-1`} checked={checked[0]}/> 
                              :<input onChange={() => {onChangeChecked(index);setIndexTopic(indexTopic);setExercise(false);setVideoTime(0)}} type="radio" id={`tab-${index+1}`} name={`tab-group-1`} checked={checked[index]}/>
                              }
                          
                            <label className="d-flex justify-content-between" htmlFor={`tab-${index+1}`}>
                              <span>{lesson.name}</span>
                              {checkCompletedVideo(lesson._id) ?
                              <i class="fa fa-check-circle-o" aria-hidden="true"></i> : ""
                              }
                            </label>
                            
  
                              
                            </div>
                            :
  
                            <div key={lesson._id} className="season_tab video-lock">
                          
                            <label className="d-flex justify-content-between" htmlFor={`tab-${index+1}`}>
                              <span>{lesson.name}</span>
                              <i class="fa fa-lock" aria-hidden="true"></i>
                            </label>
                            </div>
                          }
  
                          </>
  
                        );
                        
                      }

                    })}
                  {
                  checkCompletedTopic(topic._id) || checkCompletedAllVideo()  ?  
                  <div className="season_tab">
                    {topic.isFinalTest  ?
                    <> 
                      <label className="d-flex justify-content-between" htmlFor={`tabb-${indexTopic}`}>
                        <span onClick={() => history.push(`/course/${match.params.id}/finalexam/${topic._id}`)}>Bài kiểm tra cuối khóa</span>
                        
                      </label>
                    </>
                    :
                    <>
                    <input  onChange={() => {setExercise(true) ; dispatch(getTopicQuizs(topic._id)); onChangeCheckedExercise(indexTopic);setIndexTopic(indexTopic)}} type="radio" id={`tabb-${indexTopic}`} name={`tab-group-1`} checked={checkedExercise[indexTopic]}/>
                    <label className="d-flex justify-content-between" htmlFor={`tabb-${indexTopic}`}>
                        <span>Bài tập</span>
                        
                    </label>
                    </>
                    }

                    
                      
                  </div>
                  :
                  <div className="season_tab video-lock"> 
                    <label className="d-flex justify-content-between" htmlFor={`tabb-${indexTopic}`}>
                        <span>Bài tập</span>
                        <i class="fa fa-lock" aria-hidden="true"></i>
                        
                    </label>
                    
                      
                  </div>
                  }
                </Panel>
              )
            })}
            </Collapse>
            }
          </div>
       
      </div>

      </div>

        <div className="row mt-2">
          <div className="col-md-9">
          <Tabs type="card" defaultActiveKey="1" items={items}  />
          </div>
    
        </div>


    
      </div>
         ):<div className="container text-center " style={{minHeight:'500px',paddingTop:'200px'}}>
             <Alert message="Bạn không có thể truy cập khóa học này" type="error" />
             <Button className="mt-2" onClick={() => history.push(`/course/${match.params.id}`)} type="primary" >Quay lại khóa học</Button>
          </div>}
    </>

  );
};

export default Lessons;
