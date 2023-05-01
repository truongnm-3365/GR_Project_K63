import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearErrors, getCourseTopics, getTopicQuizs } from '../../actions/courseActions';
import { Input, Radio, Space, Form, Button, Modal  } from 'antd';
import { useAlert } from 'react-alert';

const FinalTest = ({match}) => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const {  topics } = useSelector(state => state.courseTopics)
  const {  quizs,error } = useSelector(state => state.topicQuizs)
  const { user } = useSelector(state =>  state.auth)

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

  },[dispatch,match.params.examId,error])




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

    if(values.length === corrects.length){
        for(let i = 0 ; i < values.length; i++){
            if(values[i] === corrects[i]){
                newCount = newCount + 1
                setCount(newCount);
            }      
        }
        showModal();
        
    }else{
        alert.error("Hãy hoàn thành hết bài trước khi nộp")
    }
    

  };

  console.log(quizs);


  return (
    <div className='container mt-2'>
        <h2 className='text-center mb-3'>Bài kiểm tra cuối khóa</h2>
        <Form layout="vertical" onFinish={onFinish} >
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

            <Button type="primary" htmlType="submit">
                Nộp bài
            </Button>
        </Form>
        <Modal  cancelText="Tắt" title="Kết quả" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <p>{`Bạn làm được đúng ${count} câu trên tổng số ${corrects.length}`}</p>
            {count >= 0.8*corrects.length ?
            <p>Bạn đã đạt</p>
            :
            <p>Bạn vẫn chưa đạt</p>
            }
        </Modal>

    </div>
  )
}

export default FinalTest