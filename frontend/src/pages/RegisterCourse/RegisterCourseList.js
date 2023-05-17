import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'

import MetaData from '../../components/layout/MetaData'

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { addItemToCart, removeItemFromCart } from '../../actions/cartActions'
import { getMeRegisterCourses,newRegisterCourse,deleteRegisterCourse } from '../../actions/registerCourseAction'
import { useEffect } from 'react'
import { DELETE_REGISTER_COURSE_RESET } from '../../constants/registerCourseContants'
import { Pagination, Tag } from 'antd'
const CourseList = ({ history }) => {

    const [currentPage, setCurrentPage ] = useState(1);

    const pageSize = 10

    const dispatch = useDispatch();

    const [text,setText] = useState("")
    const [keyword,setKeyword] = useState("")
    const [status,setStatus] = useState(2)
    const [isCompleted,setIsCompleted] = useState(2);

    const onSearch = (e) =>{
        e.preventDefault();
        setKeyword(text)
        setIsCompleted(status)
    }



    const { registerCourses } = useSelector(state => state.registerCourses)

    const alert = useAlert();

    const { isDeleted } = useSelector(state => state.registerCourse)

    const removeCourseHandler = (id) => {
        dispatch(deleteRegisterCourse(id))
    }

    useEffect(()=>{
        dispatch(getMeRegisterCourses())
        if(isDeleted){
            alert.success('Khóa học đã được bỏ đăng ký')
            dispatch({ type: DELETE_REGISTER_COURSE_RESET })
        }
    },[dispatch,isDeleted,keyword,isCompleted])

    const convertDate = (date,limit) =>{
        if(!!date){
            const day = new Date(date)
            day.setDate(day.getDate() + limit*31)
            const yyyy = day.getFullYear();
            let mm = day.getMonth() + 1; // Months start at 0!
            let dd = day.getDate();
    
            if (dd < 10) dd = '0' + dd;
            if (mm < 10) mm = '0' + mm;
            const formattedDate = dd + '/' + mm + '/' + yyyy;
    
            return formattedDate
        }

    }


    const Search = (courses) =>{
        console.log(courses);
        return courses.filter((item) => {
            return isCompleted == 2
              ? item
              : item.isPassed == isCompleted
                
          }).filter((item) => {
            return keyword === ""
              ? item
              : item.name.toLowerCase().includes(keyword.toLowerCase()) 
                
          })
    }


    return (
        <div className='container' style={{minHeight:'500px'}}>
            <MetaData title={'Khóa học đã đăng ký'} />
            {registerCourses && registerCourses.length !== 0 ?  (
                <Fragment>

                    <h2 className="mt-5">Số lượng đã đăng ký: <b>{registerCourses? registerCourses.length: 0} khóa học</b></h2>
                    
                    <form onSubmit={onSearch} className="form-inline float-right" style={{marginBottom:'-6px'}}>
                        <div className="form-group mx-sm-3 mb-2">
                            <select
                                id="role_field"
                                        className="form-control"
                                        name='role'
                                        defaultValue={isCompleted}
                                        onChange={(e) => setStatus(e.target.value)}
                                >
                                        <option value={2}>Tất cả</option>
                                        <option value={1}>Đã hoàn thành</option>
                                        <option value={0}>Đang hoàn thành</option>
                                        
                            </select>
                        </div>
                        <div className="form-group mx-sm-3 mb-2">
                            <label for="inputText" className="sr-only">Tìm kiếm</label>
                            <input defaultValue={text} onChange={e => setText(e.target.value)} type="text" className="form-control" id="inputText" placeholder="Tìm kiếm"/>
                        </div>
                        <button type="submit" className="btn btn-success mb-2">Tìm kiếm</button>
                    </form>

                    <div className="row d-flex justify-content-between mt-5">
                        <div className="col-12 col-lg-12">

                            {registerCourses && Search(registerCourses).map((item,index) => (
                                <Fragment>
                                    <hr />

                                    <div className="cart-item" key={item.course}>
                                        <div className="row">
                                            <div className="col-4 col-lg-2">
                                                <img src={process.env.REACT_APP_API_URL + item.images[0].url} alt="Image" height="90" width="115" />
                                            </div>

                                            <div className="col-6 col-lg-2" style={{fontSize:'30px'}}>
                                                <Link to={`/course/${item.course}`}>{item.name}</Link>
                                            </div>

                                            <div className='col-lg-2 mt-4 mt-lg-0'>
                                            {item.isPassed ?
                                                <Tag style={{fontSize:'20px',padding:'10px'}} color="success">
                                                    Đã hoàn thành
                                                </Tag>
                                                :
                                                <Tag style={{fontSize:'20px',padding:'10px'}} color="processing">
                                                    Đang hoàn thành
                                                </Tag>
                                            }
                                            </div>

                                            <div className="col-6 col-lg-3" style={{fontSize:'20px'}}>
                                                Ngày hết hạn: {convertDate(item.createdAt,item.timeLimit)}
                                            </div>


                                            <div className="col-lg-2 mt-4 mt-lg-0">
                                                <i id="delete_cart_item" className="fa fa-trash btn btn-danger" onClick={() => removeCourseHandler(item._id)} >
                                                    {' '}Hủy Đăng ký
                                                </i>
                                            </div>

                                        </div>
                                    </div>
                                    <hr />
                                </Fragment>
                            ))}
                            <Pagination
                                style={{float:'right',marginTop:'10px'}} 
                                onChange={(page) => setCurrentPage(page)} 
                                defaultCurrent={1} 
                                total={Search(registerCourses).length} 
                                pageSize={pageSize} 
                            />
                        </div>

                    </div>
                </Fragment>
            ): <h2 className="mt-5">Bạn chưa đăng ký khóa học nào</h2> }
        </div>
    )
}

export default CourseList
