import {useEffect, useState, useRef} from "react";
import Loader from '../layout/Loader'
import { clearErrors, getCourseLessons, getCourseLesson } from '../../actions/courseActions'
import { useDispatch, useSelector } from 'react-redux'
import { NEW_LESSON_RESET } from '../../constants/courseConstants'
import './index.css'
const Lessons = ({match}) => {
  const dispatch = useDispatch();
  const { loading, lessons,error } = useSelector(state => state.courseLessons)
  const { error: lessonError, success } = useSelector(state => state.newLesson)
  const [index, setIndex] = useState(0)
  const [checked, setChecked] = useState([true])
  const onChangeChecked = (index) =>{
    
    const newCheck = []
    for( let i; i < lessons.length; i++){
      newCheck[i] = false;
    }
    newCheck[index] = true;
    console.log(newCheck)
    setChecked(newCheck)
    setIndex(index);
    
  }

 


  useEffect(() => {
    dispatch(getCourseLessons(match.params.id))
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
   
}, [dispatch, alert, error,lessonError,success,match.params.id,checked])
  return (
    <>
        {loading ? <Loader/> :
        <div className="row">
          <div className="col-md-12">
            

              <div className="season_tabs">
              {lessons &&
                  lessons.map((lesson,index) => {
                    return (
                      <div className="season_tab">
                        {index === 0 ? 
                          <input  onChange={() => onChangeChecked(index)} type="radio" id={`tab-${index+1}`} name={`tab-group-1`} checked={checked[0]}/> 
                          :<input onChange={() => onChangeChecked(index)} type="radio" id={`tab-${index+1}`} name={`tab-group-1`} checked={checked[index]}/>
                          }
                       
                        <label for={`tab-${index+1}`}>{lesson.name}</label>
                        

                          
                      </div> 
                    );
                    
                  })}
                  {lessons.length !== 0 &&
                  <div className="season_content">
                    <video
                        
                        controls
                      >
                        <source src={lessons[index].videos} />
                    </video>
                
                  </div>
                }
                
              </div>
          </div>
        </div>
         }
    </>

  );
};

export default Lessons;
