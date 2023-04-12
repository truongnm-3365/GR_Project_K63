import React, { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import Loader from '../../components/layout/Loader'
import MetaData from '../../components/layout/MetaData'
import { clearErrors, publicProfile } from '../../actions/userActions'
import Pagination from 'react-js-pagination'
import Course from '../../components/course/Course'

const Profile = ({ match }) => {

    const { user, loading, error } = useSelector(state => state.auth)

    const { profile } = useSelector(state => state.profile)
    

    const dispatch = useDispatch();

    let userId = match.params.id

    let userPublic

    useEffect(() => {
        if(userId)
            dispatch(publicProfile(match.params.id))
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }            
       
    },[dispatch,userId])

    
    if(userId){
        userPublic = profile
    }else{
        userPublic = user
    }


    return (
        <Fragment>
            {loading ? <Loader /> : (
                <div className='container'>
                    <MetaData title={'Thông tin của tôi'} />
                    {(user?._id === profile?._id || !userId) ?
                    <h2 className="mt-5">Thông tin của tôi</h2> :  <h2 className="mt-5">Thông tin cá nhân</h2>}
                    <div className="row justify-content-around mt-5 user-info">
                        <div className="col-12 col-md-3">
                            <figure className='avatar avatar-profile'>
                                <img className="rounded-circle img-fluid" src={userPublic?.avatar?.url} alt={userPublic?.name} />
                            </figure>
                            {(user?._id === profile?._id || !userId) &&
                            <Link to="/me/update" id="edit_profile" className="btn btn-primary btn-block my-5">
                                Chỉnh sửa thông tin
                            </Link>}
                        </div>

                        <div className="col-12 col-md-5">
                            <h4>Tên</h4>
                            <p>{userPublic?.name}</p>

                            <h4>Email</h4>
                            <p>{userPublic?.email}</p>

                            <h4>Ngày tham gia</h4>
                            <p>{String(userPublic?.createdAt).substring(0, 10)}</p>

                            {/* {userPublic?.role !== 'admin' && (
                                <Link to="/orders/me" className="btn btn-danger btn-block mt-5">
                                    My Orders
                                </Link>
                            )} */}

                            {(user?._id === profile?._id || !userId) &&
                            <Link to="/password/update" className="btn btn-primary btn-block mt-3">
                                Đổi mật khẩu
                            </Link>}
                        </div>
                        
                    </div>
                    <hr></hr>
                    <section id="courses" className="mt-5">
                        {userPublic?.courses ?  <h2 id="courses_heading">Khóa học đang được hiện thị trên web</h2> : "" }
                        <div className="row">

                            {(
                                    userPublic?.courses?.map(course => (
                                        <Course key={course._id} course={course} col={3} />
                                    ))
                            )}

                        </div>
                    </section>
                </div>
            )}
        </Fragment>
    )
}

export default Profile
