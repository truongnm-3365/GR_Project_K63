import { useEffect, useState } from "react";
import Loader from '../../components/layout/Loader'
import { clearErrors, getCourseLessons, getCourseLesson, getCourseTopics, getTopicQuizs, getCourseDetails, getCourseDocuments, newReview } from '../../actions/courseActions'
import { useDispatch, useSelector } from 'react-redux'
import { NEW_LESSON_RESET,NEW_REVIEW_RESET } from '../../constants/courseConstants'
import { Collapse } from 'antd';
import { useAlert } from 'react-alert'
import './index.css'
import Quiz from "../../components/quiz/Quiz";
import ListReviews from "../../components/review/ListReviews";
import { NEW_REGISTER_COURSE_RESET } from "../../constants/registerCourseContants";
import { comleteVideo, completedVideo, getMeRegisterCourses } from "../../actions/registerCourseAction";


const Lessons = ({match}) => {
  const { Panel } = Collapse;
  const dispatch = useDispatch();
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
  const {user} = useSelector(state => state.auth)
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const onChangeChecked = (index) =>{
    
    const newCheck = []
    for( let i; i < lessons.length + 1; i++){
      newCheck[i] = false;
    }
    newCheck[index] = true;
    console.log(newCheck)
    setChecked(newCheck)
    setCheckedExercise([false])
    setIndex(index);
    
  }

  const onChangeCheckedExercise = (index) =>{
    const newCheck = []
    for( let i; i < topics.length; i++){
      newCheck[i] = false;
    } 

    newCheck[index] = true;
    setCheckedExercise(newCheck)
    setChecked([false])
    console.log(newCheck,index)
  }


  const openInNewTab = (url) => {
    window.open(url, '_blank', 'noreferrer');
  };

  const { completeVideos } = useSelector(state => state.registerCourses)
  const { success: complete } = useSelector(state => state.newRegisterCourse)
  const { isUpdated } = useSelector(state => state.registerCourse)
  


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
  
  if (complete || isUpdated) {
    dispatch({type: NEW_REGISTER_COURSE_RESET})
  }
   
}, [dispatch, alert, error,lessonError,success,match.params.id,checked,checkedExercise,reviewSuccess,complete,isUpdated])
  

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


return (
    <>
        {loading  ? <Loader/> :
        <div className="container">        
        <div className="row mt-5">
        {exercise === false && lessons.length !== 0 &&
              <div className="col-md-8">
                <video
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
                    <source src={ lessons[index] ? lessons[index].videos : ""} />
                </video>
            
              </div>
            } 

            {exercise ? <Quiz quizs={quizs}/> : ''}
      <div className="col-md-4">
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
                              <input  onChange={() => {onChangeChecked(index);setIndexTopic(indexTopic);setExercise(false)}} type="radio" id={`tab-${index+1}`} name={`tab-group-1`} checked={checked[0]}/> 
                              :<input onChange={() => {onChangeChecked(index);setIndexTopic(indexTopic);setExercise(false)}} type="radio" id={`tab-${index+1}`} name={`tab-group-1`} checked={checked[index]}/>
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
                  checkCompletedTopic(topic._id) ?  
                  <div className="season_tab">
                      <input  onChange={() => {setExercise(true) ; dispatch(getTopicQuizs(topic._id)); onChangeCheckedExercise(indexTopic);setIndexTopic(indexTopic)}} type="radio" id={`tabb-${indexTopic}`} name={`tab-group-1`} checked={checkedExercise[indexTopic]}/> 
                    <label className="d-flex justify-content-between" htmlFor={`tabb-${indexTopic}`}>
                        <span>Bài tập</span>
                        
                    </label>
                    
                      
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

        <div>
          <div className="col-md-8 mt-3">
            {documents &&
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
                documents.map((document) => {
                  return (
                    <>
                        {document.docs.map((doc) => {
                          return (
                            <>
                              <button
                                style={{width:'100px',height:'100px',marginRight:'10px',background:'white'}}
                                role="link"
                                onClick={() => openInNewTab(`http://localhost:4000${doc}`)}
                              >
                                <i style={{fontSize:'40px',color:'red'}} className="fa fa-file-pdf-o " aria-hidden="true"></i>
                                <div>{document.name}</div>
                              </button>
  
                            </>

                          );
                        })}

                    </>
                  );
                })}
                </td>
                </tr>
            </tbody>
          </table>
          }
          </div>
          <div className="mt-5">
            {user ? <button id="review_btn" type="button" className="btn btn-primary mb-2" data-toggle="modal" data-target="#ratingModal" onClick={setUserRatings}>
            Gửi đánh giá
            </button>
                                :
            <div className="alert alert-danger mt-5" type='alert'>Đăng nhập để viết đánh giá</div>
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
              <ListReviews reviews={course.details.reviews} />
            )}
          </div>
        </div>


    
      </div>

         }
    </>

  );
};

export default Lessons;
