import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

import MetaData from '../../components/layout/MetaData'

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { addItemToCart, removeItemFromCart } from '../../actions/cartActions'
import { getMeRegisterCourses,newRegisterCourse,deleteRegisterCourse } from '../../actions/registerCourseAction'
import { useEffect } from 'react'
import { DELETE_REGISTER_COURSE_RESET } from '../../constants/registerCourseContants'

import {  Tag } from 'antd';

const CompletedCourse = ({ history }) => {

    const dispatch = useDispatch();

    const { registerCourses } = useSelector(state => state.registerCourses)

    const alert = useAlert();

    const { isDeleted } = useSelector(state => state.registerCourse)

    const removeCourseHandler = (id) => {
        dispatch(deleteRegisterCourse(id))
    }

    useEffect(()=>{
        dispatch(getMeRegisterCourses())
        if(isDeleted){
            alert.success('Khóa học đã được xóa khỏi danh sách đăng ký')
            dispatch({ type: DELETE_REGISTER_COURSE_RESET })
        }
    },[dispatch,isDeleted])

    console.log(registerCourses);


    return (
        <div className='container'>
            <MetaData title={'Khóa học đã hoàn thành'} />
            {registerCourses && registerCourses.length !== 0 ?  (
                <Fragment>
                    <h2 className="mt-5">Số lượng đã hoàn thành: <b>{registerCourses?  registerCourses.filter(item => item.isPassed === true).length: 0} khóa học</b></h2>

                    <div className="row d-flex justify-content-between">
                        <div className="col-12 col-lg-12">

                            {registerCourses && registerCourses.filter(item => item.isPassed === true).map(item => (
                                <Fragment>
                                    <hr />

                                    <div className="cart-item" key={item.course}>
                                        <div className="row">
                                            <div className="col-4 col-lg-3">
                                                <img src={item.images[0].url} alt="Laptop" height="90" width="115" />
                                            </div>

                                            <div className="col-6 col-lg-3" style={{fontSize:'30px'}}>
                                                <Link to={`/course/${item.course}`}>{item.name}</Link>
                                            </div>


                                            {/* <div className="mt-4 mt-lg-0">
                                                <i id="delete_cart_item" className="fa fa-trash btn btn-danger" onClick={() => removeCourseHandler(item._id)} >
                                                    {' '}Xóa khỏi danh sách đăng ký
                                                </i>
                                            </div> */}

                                            <div className='mt-4 mt-lg-0'>
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

                                        </div>
                                    </div>
                                    <hr />
                                </Fragment>
                            ))}

                        </div>

                    </div>
                </Fragment>
            ): <h2 className="mt-5">Bạn chưa hoàn thành khóa học nào</h2> }
        </div>
    )
}

export default CompletedCourse
