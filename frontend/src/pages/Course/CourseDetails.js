import React, { Fragment, useState, useEffect } from 'react'
import Loader from '../../components/layout/Loader'
import MetaData from '../../components/layout/MetaData'
import ListReviews from '../../components/review/ListReviews'
import { Link,useHistory } from 'react-router-dom'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { getCourseDetails, newReview, clearErrors, getCourseLessons, getCourseTopics} from '../../actions/courseActions'
import { NEW_REVIEW_RESET } from '../../constants/courseConstants'
import { extendCourse, getMeRegisterCourses, newRegisterCourse } from '../../actions/registerCourseAction'
import { NEW_REGISTER_COURSE_RESET } from '../../constants/registerCourseContants'
import { Button, Collapse, Modal, Table } from 'antd'
import './index.css'
import { getAccessChat } from '../../actions/chatAction'
const CourseDetails = ({ match }) => {

    const { Panel } = Collapse;
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const [indexTopic,setIndexTopic] = useState(0)
    const dispatch = useDispatch();
    const history = useHistory();
    const alert = useAlert();

    const { loading, error, course } = useSelector(state => state.courseDetails)
    const { user, isAuthenticated } = useSelector(state => state.auth)
    
    const { error: reviewError, success } = useSelector(state => state.newReview)
    const { registerCourses } = useSelector(state => state.registerCourses)
    const { success: newSuccess} = useSelector(state => state.newRegisterCourse)
    const { lessons  } = useSelector(state => state.courseLessons)
    const {  topics } = useSelector(state => state.courseTopics)


    useEffect(() => {
        
        dispatch(getCourseDetails(match.params.id))
        
       
        if(isAuthenticated){
            dispatch(getMeRegisterCourses())
        }
        dispatch(getCourseLessons(match.params.id))
        dispatch(getCourseTopics(match.params.id))
        
        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }

        if (reviewError) {
            alert.error(reviewError);
            dispatch(clearErrors())
        }

        if (success) {
            alert.success('Đánh giá được đăng tải thành công')
            dispatch({ type: NEW_REVIEW_RESET })
        }

        if (newSuccess) {
            alert.success('Đăng ký thành công')
            dispatch({ type: NEW_REGISTER_COURSE_RESET })
        }


    }, [dispatch, alert, match.params.id,success,newSuccess])


    const checkCompletedCourse = () =>{
        for(let i = 0; i < topics?.length; i++){
            if(topics[i].isPassed === true && topics[i].user === user?._id){
                return  true
            }
        }
        return false
    }

    const userCreatedAt = () =>{
        if(user){
            for(let i =0; i < registerCourses?.length; i++){
                if(registerCourses[i].course === match.params.id){
                    return registerCourses[i].createdAt
                }
            }
            return ""
        }
        return ""
    }

    const addCourse = () =>{
        history.push(`/payment/${match.params.id}/${course.details.price}`)
        //dispatch(newRegisterCourse(match.params.id))
    }

    const extentionCourse = (item) =>{
        history.push(`/payment/${match.params.id}/${course.details.price}?createdAt=${userCreatedAt()}`)
        
    }




    const isRegister = () =>{
        if(user){
            for(let i =0; i < registerCourses?.length; i++){
                if(registerCourses[i].course === match.params.id){
                    return true
                }
            }
            return false
        }
        return false

    }



    const expriedDate = () =>{
        for(let i =0; i < registerCourses?.length; i++){
            if(registerCourses[i].course === match.params.id){
                const day = new Date(registerCourses[i].createdAt)
                day.setDate(day.getDate() + course.details.timeLimit*31)
                const yyyy = day.getFullYear();
                let mm = day.getMonth() + 1; // Months start at 0!
                let dd = day.getDate();
        
                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;
                const formattedDate = dd + '/' + mm + '/' + yyyy;
        
                return formattedDate
            }
        }
    }

    const expriedDay = () =>{
        for(let i =0; i < registerCourses?.length; i++){
            if(registerCourses[i].course === match.params.id){
                const day = new Date(registerCourses[i].createdAt)
                day.setDate(day.getDate() + course.details.timeLimit*31)
                console.log(day);
                console.log(new Date(registerCourses[i].createdAt))
                return day;
            }
        }
    }

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



    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
      setIsModalOpen(true);
    };
    const handleOk = () => {
      setIsModalOpen(false);
    };
    const handleCancel = () => {
      setIsModalOpen(false);
    };

    const columns = [
        {
            title:"Tên",
            dataIndex:"name",
            key:"name"
        },
        {
            title:"Email",
            dataIndex:"email",
            key:"email"
        },
        {
            title:"Thao tác",
            key:"action",
            render: (_, record) => (
                <Button onClick={() => {dispatch(getAccessChat(record._id)); history.push('/chats')}}>
                    Tin nhắn
                </Button>
              ),
        }
    ]

    return (
        <Fragment>
            {loading ? <Loader /> : course.details && (
                <div className='container'>
                    <MetaData title={course.details.name} />
                    <div className="row d-flex justify-content-around">
                        <div className="col-12 col-lg-5 img-fluid" id="course_image">
                            
                            {course.details.images && course.details.images.map(image => (
                                <img key={image._id} className="d-block w-100" src={process.env.REACT_APP_API_URL + image.url} alt={course.title} />
                            ))}
                            {lessons?.length !== 0 && <div><h2 className='mt-5'>Danh sách bài học</h2></div> }
                            <div>
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
                                                    <div key={lesson._id} className="season_tab">
                                                
                                                    <label className="d-flex justify-content-between" htmlFor={`tab-${index+1}`}>
                                                        <span>{lesson.name}</span>
                                                    </label>
                                                    
                                                    </div>
                        
                                                </>
                        
                                                );
                                                
                                            }

                                            })}
                                        
                                            <div className="season_tab"> 
                                            <label className="d-flex justify-content-between" htmlFor={`tabb-${indexTopic}`}>
                                                <span>Bài tập</span>
                                                
                                            </label>
                                            
                                            
                                        </div>
                                        </Panel>
                                    )
                                    })}
                                    </Collapse>
                                    }
                                </div>
                            </div>

                            
                           
                    </div>

                        <div className="col-12 col-lg-5 mt-5">
                            {checkCompletedCourse() && <div className="alert alert-success mt-5" type='alert'>Khóa học này đã được hoàn thành</div> }
                            <h3>{course.details.name}</h3>
                            <p id="course_id">Khóa học # {course.details._id}</p>

                            <hr />

                            <div className="rating-outer">
                                <div className="rating-inner" style={{ width: `${(course.details.ratings / 5) * 100}%` }}></div>
                            </div>
                            <span id="no_of_reviews">({course.details.numOfReviews} Đánh giá)</span>

                            <hr />

                            <p id="course_price">{course.details.price} ĐƠN VỊ TIỀN</p>

                            {
                                isRegister() ? 
                                <>
                                    {new Date() < expriedDay() ? 
            
                                    <>
                                        <button type="button" id="cart_btn" className="btn btn-primary d-inline ml-4" >Đã đăng ký</button>
                                        <Link to={`/course/${course.details._id}/lessons`}>
                                            <button type="button" id="cart_btn" className="btn btn-danger d-inline ml-4" >Truy cập khóa học</button>
                                        
                                        </Link>
                                    </> 
                                    :<div>
                                        <div className="alert alert-danger mt-5" type='alert'>Khóa học đã hết hạn</div>
                                        <button onClick={() => extentionCourse()} type="button" id="cart_btn" className="btn btn-primary d-inline ml-4" >Gia hạn khóa học</button>
                                    </div>

                                    }
                                </>
                                :<>
                                {isAuthenticated ?
                                    <button onClick={() => addCourse()} type="button" id="cart_btn" className="btn btn-primary d-inline ml-4" >Đăng ký học</button>
                                :  <div className="alert alert-danger mt-5" type='alert'>Đăng nhập để đăng ký khóa học</div> }
                                </>                                
                            }

                        

                            <hr />

                            <h4 className="mt-2">Mô tả:</h4>
                            <p dangerouslySetInnerHTML={{__html:course.details.description}} ></p>
                            <hr />

                            <h4 className="mt-2">Thông tin tác giả:</h4>
                            <p>Tên: {course.user.name}</p>
                            <p>Email: {course.user.email}</p>
                            <Link to={`/profile/${course.user?._id}`} >Xem thêm thông tin chi tiết</Link>
                            <div>
                            {isRegister() && course.user?._id !== user?._id && <Button onClick={() => {dispatch(getAccessChat(course.user._id));history.push('/chats')}} >Nhắn tin</Button>} 
                            </div>
                            
                            <hr />
                            
                            {course.user?._id === user?._id &&
                            <>
                                <Button type="primary" onClick={showModal}>
                                    Danh sách học viên
                                </Button>
                                <Modal title="Danh sách học viên" open={isModalOpen}  onOk={handleOk} onCancel={handleCancel} okText="Đóng" cancelText="Hủy bỏ">
                                    <Table columns={columns} dataSource={course.registerUsers.map(item => {return {...item,key:item._id}})}></Table>
                                </Modal>                            
                            </>

                            }

                            {isRegister() && <h4 className='mt-2'>Thời gian</h4>}
                             {/* <p>Ngày bắt đầu: {formatDate(course.details.startDate)}</p> 
                             <p>Ngày kết thúc: {formatDate(course.details.endDate)}</p>        */}
                             { isRegister() && <p>Ngày hết hạn: {expriedDate()}</p>}
                            {isAuthenticated ? 
                            ( 
                                checkCompletedCourse() ? 
                                <button id="review_btn" type="button" className="btn btn-primary mt-4" data-toggle="modal" data-target="#ratingModal" onClick={setUserRatings}>
                                    Gửi đánh giá
                                </button> 
                                : 
                                <div className="alert alert-info mt-5" type='alert'>Hoàn thành xong khóa học để đánh giá</div>
                            )
                            
                            :
                                <div className="alert alert-danger mt-5" type='alert'>Đăng nhập để viết đánh giá</div>
                            }


                            <div className="row mt-2 ">
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
                        </div>
                    </div>

                    {course.details.reviews && course.details.reviews.length > 0 && (
                        <ListReviews reviews={course.details.reviews} />
                    )}

                </div>
            )}
        </Fragment>
    )
}

export default CourseDetails
