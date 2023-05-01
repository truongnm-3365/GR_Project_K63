import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import { clearErrors, getCourseDetails, getCourseTopics } from '../../actions/courseActions';
import { Button, Result } from 'antd';

const useQuery = () => {
    const { search } = useLocation();
  
    return React.useMemo(() => new URLSearchParams(search), [search]);
}


const FinalResult = ({match}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const query = useQuery();
  const { loading, error, course } = useSelector(state => state.courseDetails)
  const {  topics } = useSelector(state => state.courseTopics)
  const { user } = useSelector(state => state.auth)
  useEffect(() => {
    dispatch(getCourseDetails(match.params.id))
    dispatch(getCourseTopics(match.params.id));
    
    if (error) {
        alert.error(error);
        dispatch(clearErrors())
    }



    }, [dispatch, error, match.params.id])

  const correct = query.get("correct") || 0
  const sum = query.get("sum") || 0



  const checkCompletedCourse = () =>{
    for(let i = 0; i < topics?.length; i++){
        if(topics[i].isPassed === true && topics[i].user === user._id){
            return  true
        }
    }
    return false
  }

  return (
    <div className='container mt-2'>
        
        {correct >= 0.8*sum ?
            <Result
            status="success"
            title={`Chúc mừng bạn đã hoàn thành khóah học ${course?.details?.name}`}
            subTitle={`Bạn đã đúng được ${correct} trên tổng số ${sum}`}
            extra={[
              <Button onClick={() => history.push(`/course/${match.params.id}/lessons`)} type="primary" key="console">
                Quay lại khóa học
              </Button>,
            ]}
          />
          :
          <Result
          status="error"
          title={`Rất tiếc, bạn vẫn chưa thể hoàn thành khóa học ${course?.details?.name}`}
          subTitle={`Bạn đã đúng được ${correct} trên tổng số ${sum}. Không đạt trên 80%`}
          extra={[
            <Button onClick={() => history.push(`/course/${match.params.id}/lessons`)} type="primary" key="console">
              Quay lại khóa học
            </Button>,
          ]}
        />
            
        }

    </div>
  )
}

export default FinalResult