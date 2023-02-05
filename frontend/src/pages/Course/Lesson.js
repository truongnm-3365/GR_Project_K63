import {useEffect, useState, useRef} from "react";
import Loader from '../../components/layout/Loader'
import { clearErrors, getCourseLessons, getCourseLesson, getCourseTopics, getTopicQuizs } from '../../actions/courseActions'
import { useDispatch, useSelector } from 'react-redux'
import { NEW_LESSON_RESET } from '../../constants/courseConstants'
import { Collapse } from 'antd';



import './index.css'
import Quiz from "../../components/quiz/Quiz";

const Lessons = ({match}) => {
  const { Panel } = Collapse;
  const dispatch = useDispatch();
  const { loading, lessons,error } = useSelector(state => state.courseLessons)
  const { error: lessonError, success } = useSelector(state => state.newLesson)
  const {  topics } = useSelector(state => state.courseTopics)
  const {  quizs } = useSelector(state => state.topicQuizs)
  const [index, setIndex] = useState(0)
  const [indexTopic,setIndexTopic] = useState(0)
  const [checked, setChecked] = useState([true])
  const [checkedExercise, setCheckedExercise] = useState([false])
  const [exercise,setExercise] = useState(false)
  const [topicId,setTopicId] = useState("")
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


  const topicNum = (items,topicId) =>{
    let num = 0
    for( let i; i < items.length + 1; i++){
      if(items.topicId === topicId){
        num ++
      }
    } 

    return num;
  }
  
 


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
   
}, [dispatch, alert, error,lessonError,success,match.params.id,checked,checkedExercise])
  return (
    <>
        {loading  ? <Loader/> :
        <div className="row mt-5">
            {exercise === false && lessons.length !== 0 &&
                  <div className="col-md-8">
                    <video
                        
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
                          if(lesson.topicId === topic._id)
                          return (
                            <div key={lesson._id} className="season_tab">
                              {index === 0 ? 
                                <input  onChange={() => {onChangeChecked(index);setIndexTopic(indexTopic);setExercise(false)}} type="radio" id={`tab-${index+1}`} name={`tab-group-1`} checked={checked[0]}/> 
                                :<input onChange={() => {onChangeChecked(index);setIndexTopic(indexTopic);setExercise(false)}} type="radio" id={`tab-${index+1}`} name={`tab-group-1`} checked={checked[index]}/>
                                }
                            
                              <label htmlFor={`tab-${index+1}`}>{lesson.name}</label>
                              

                                
                            </div> 
                          );
                          
                        })}  
                     <div className="season_tab">
                          <input  onChange={() => {setExercise(true) ; dispatch(getTopicQuizs(topic._id)); onChangeCheckedExercise(indexTopic);setIndexTopic(indexTopic)}} type="radio" id={`tabb-${indexTopic}`} name={`tab-group-1`} checked={checkedExercise[indexTopic]}/> 
                        <label htmlFor={`tabb-${indexTopic}`}>Bài tập</label>
                        

                          
                      </div>
                    
                    </Panel>
                  )
                })}
                </Collapse>
                }
              </div>
          </div>

        </div>
         }
    </>

  );
};

export default Lessons;
