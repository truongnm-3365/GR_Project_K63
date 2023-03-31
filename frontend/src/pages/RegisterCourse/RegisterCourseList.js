import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

import MetaData from '../../components/layout/MetaData'

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { addItemToCart, removeItemFromCart } from '../../actions/cartActions'
import { getMeRegisterCourses,newRegisterCourse,deleteRegisterCourse } from '../../actions/registerCourseAction'
import { useEffect } from 'react'
import { DELETE_REGISTER_COURSE_RESET } from '../../constants/registerCourseContants'
const CourseList = ({ history }) => {

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
            alert.success('Khóa học đã được bỏ đăng ký')
            dispatch({ type: DELETE_REGISTER_COURSE_RESET })
        }
    },[dispatch,isDeleted])


    // const checkoutHandler = () => {
    //     history.push('/login?redirect=shipping')
    // }

    return (
        <div className='container'>
            <MetaData title={'Your Cart'} />
            {registerCourses && registerCourses.length !== 0 ?  (
                <Fragment>
                    <h2 className="mt-5">Số lượng đã đăng ký: <b>{registerCourses? registerCourses.length: 0} khóa học</b></h2>

                    <div className="row d-flex justify-content-between">
                        <div className="col-12 col-lg-12">

                            {registerCourses && registerCourses.map(item => (
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


                                            <div className="mt-4 mt-lg-0">
                                                <i id="delete_cart_item" className="fa fa-trash btn btn-danger" onClick={() => removeCourseHandler(item._id)} >
                                                    {' '}Hủy Đăng ký
                                                </i>
                                            </div>

                                        </div>
                                    </div>
                                    <hr />
                                </Fragment>
                            ))}

                        </div>
{/* 
                        <div className="col-12 col-lg-3 my-4">
                            <div id="order_summary">
                                <h4>Order Summary</h4>
                                <hr />
                                <p>Subtotal:  <span className="order-summary-values">{registerCourses.reduce((acc, item) => (acc + Number(item.quantity)), 0)} (Units)</span></p>
                                <p>Est. total: <span className="order-summary-values">${registerCourses.reduce((acc, item) => acc + item.quantity * item.price, 0).toFixed(2)}</span></p>

                                <hr />
                                <button id="checkout_btn" className="btn btn-primary btn-block" onClick={checkoutHandler}>Check out</button>
                            </div>
                        </div> */}
                    </div>
                </Fragment>
            ): <h2 className="mt-5">Bạn chưa đăng ký khóa học nào</h2> }
        </div>
    )
}

export default CourseList
