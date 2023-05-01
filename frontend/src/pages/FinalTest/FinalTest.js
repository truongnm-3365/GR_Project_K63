import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearErrors, getCourseDetails, getCourseTopics, getTopicQuizs, updateTopic } from '../../actions/courseActions';
import { Input, Radio, Space, Form, Button, Modal  } from 'antd';
import { useAlert } from 'react-alert';
import { useHistory } from 'react-router-dom'
import Countdown from "react-countdown";

const FinalTest = ({match}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const alert = useAlert();
  const {  topics } = useSelector(state => state.courseTopics)
  const { topic, isUpdated } = useSelector(state => state.topic)
  const {  quizs,error } = useSelector(state => state.topicQuizs)
  const { user } = useSelector(state =>  state.auth)
  const { course } = useSelector(state => state.courseDetails)

  const [values, setValues] = useState([]);
  const [count, setCount] = useState(0);

  const onChange = (e,index) => {
    let newValues = values;
    newValues[index] = e.target.value 
    setValues(newValues);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
    setCount(0);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setCount(0);
  };


  useEffect(() => {
    if (error) {
        alert.error(error);
        dispatch(clearErrors())
    }
    
  
    dispatch(getTopicQuizs(match.params.examId));
    dispatch(getCourseDetails(match.params.id))
    dispatch(getCourseTopics(match.params.id));

  },[dispatch,match.params.examId,error,isUpdated])


  const checkCompletedCourse = () =>{
    for(let i = 0; i < topics?.length; i++){
        if(topics[i].isPassed === true && topics[i].user === user._id){
            return  true
        }
    }
    return false
  }


  const corrects = quizs && quizs.map(item => {
    for(let i = 0 ; i < item.choice.length; i++){
        if(item.choice[i].isCorrect === true){
            return item.choice[i]._id
        }
    }
  })
  

  const onFinish = () => {
    console.log(values)
    
    console.log(corrects);
   
    let newCount = count

   
    for(let i = 0 ; i < corrects.length; i++){
      if(values[i] === corrects[i]){
          newCount = newCount + 1
          setCount(newCount);
        }      
    }
    if(newCount >= 0.8*corrects.length){
      dispatch(updateTopic(match.params.examId,{isPassed:true,user:user._id}))
    }
    if(!checkCompletedCourse())
      history.push(`/course/${match.params.id}/finalexam/${match.params.examId}/result?correct=${newCount}&&sum=${corrects.length}`) 
    else{
      showModal();
    }
  };
  

  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      onFinish();
      return <></>

    } else {
      // Render a countdown
      return (
        <span>
          {hours} giờ {minutes} phút {seconds} giây
        </span>
      );
    }
  };

  console.log(quizs);


  


  return (
    <div className='container mt-2'>
        <h2 className='text-center mb-3'>Bài kiểm tra cuối khóa</h2>

        
        <Form layout="vertical" onFinish={onFinish} >
            <div className='float-right'>
              Thời gian: <Countdown date={Date.now() + course?.details?.timeLimitFinalExam*60*1000} renderer={renderer} />
            </div>
           
            {quizs && quizs.map((item,index) => 
            <div key={item._id} className='mb-5'>
                <div className='mb-2'>{item.question}</div>
               
                <Radio.Group  onChange={(e) => {onChange(e,index);console.log(index)}} defaultValue={values[index]}>
                    <Space direction="vertical">
                        {item.choice && item.choice.map(item => 
                            <Radio   value={item._id} >{item.body}</Radio>
                        )}
                    
                    </Space>
                </Radio.Group>
                

      
            </div>
            )}

            <Button type="primary" htmlType='submit' >
                Nộp bài
            </Button>
        </Form>
        <Modal  cancelText="Tắt" title="Kết quả" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <p>{`Bạn làm được đúng ${count} câu trên tổng số ${corrects.length}`}</p>
        </Modal>

    </div>
  )
}

export default FinalTest