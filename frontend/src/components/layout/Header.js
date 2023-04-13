import React, { Fragment, useEffect, useState } from 'react'
import { Route, Link } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import { logout } from '../../actions/userActions'
import { getMeNotifies, deleteAllNotifies } from '../../actions/notifyAction'
import Search from './Search'
import NotifyMe from './NotifyMe/NotifyMe'
import { DELETE_ALL_NOTIFIES_RESET } from '../../constants/notifyContants'
import '../../App.css'
import { getCategories } from '../../actions/categoryAction'
import './index.css'




const Header = () => {
    const alert = useAlert();
    const dispatch = useDispatch();

    const { user, loading } = useSelector(state => state.auth)
    const { categories } = useSelector(state => state.categories);
    const { notifies, error, isDeleted } = useSelector(state => state.notifies)

    const logoutHandler = () => {
        dispatch(logout());
        alert.success('Đăng xuất thành công.')
    }

    const deleteNotifiesHandler = () =>{
        dispatch(deleteAllNotifies(user._id))
    }

    useEffect(() => {
        dispatch(getCategories());

        if (error) {
            return alert.error(error)
        }
        if(user)
            dispatch(getMeNotifies(user._id))
            
        if (isDeleted) {
                
            dispatch({ type: DELETE_ALL_NOTIFIES_RESET })
        }

    }, [dispatch, alert, error,user,isDeleted])

    return (
        
        <Fragment>
            <nav className="navbar row">
                <div className="col-12 col-md-3">
                    <div className="navbar-brand" style={{color: 'white'}}>
                        <Link to="/">
                            <img style={{width: '60px'}} src="/images/logo.png" />
                            Onraincoosu
                        </Link>
                    </div>
                    <div className="ml-4 dropdown d-inline dropdown-hover">
                        <Link to="#!" className="btn dropdown-toggle text-white mr-4" type="button" id="dropDownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <span>Thể loại</span>
                        </Link>

                        <div className="dropdown-menu dropdown-hover" aria-labelledby="dropDownMenuButton">
                            {categories && categories.map((category) => (
                                <Link key={category._id} className="dropdown-item" to={`/search?keyword=&&category=${category.name}`} >{category.name}</Link>
                            ))}
                                    

                        </div>


                    </div>
                </div>

                <div className="col-12 col-md-6 mt-2 mt-md-0">
                    <Route render={({ history }) => <Search history={history} />} />
                </div>

                <div className="col-12 col-md-3 mt-4 mt-md-0 text-center d-flex">
                    {/* <Link to="/cart" style={{ textDecoration: 'none' }} >
                        <span id="cart" className="ml-3">Cart</span>
                        <span className="ml-1" id="cart_count">{cartItems.length}</span>
                    </Link> */}
                    

                    {user ? (
                        <>
                            <span className='ml-3'>
                                <NotifyMe
                                    data={notifies.sort(function(a,b){
                                        return new Date(b.createdAt) - new Date(a.createdAt);
                                    })}
                                    storageKey="notific_key"
                                    notific_key="createdAt"
                                    notific_value="content"
                                    heading="Thông báo"
                                    sortedByKey={false}
                                    showDate={true}
                                    size={24}
                                    color="white"
                                    deleteNotifiesHandler={deleteNotifiesHandler}
                                />
                            </span>
                        <div className="ml-4 dropdown d-inline">
                            <Link to="#!" className="btn dropdown-toggle text-white mr-4" type="button" id="dropDownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">

                                <figure className="avatar avatar-nav">
                                    <img
                                        src={user.avatar && user.avatar.url}
                                        alt={user && user.name}
                                        className="rounded-circle"
                                    />
                                </figure>
                                <span>{user && user.name}</span>
                            </Link>

                            <div className="dropdown-menu" aria-labelledby="dropDownMenuButton">

                                {user && user.role === 'admin' && (
                                    <Link className="dropdown-item" to="/me/courses">Dashboard</Link>
                                )}
                                {user && user.role === 'user' && (
                                    <Link className="dropdown-item" to="/me/courses">Khóa học của tôi</Link>
                                )}
                                {/* <Link className="dropdown-item" to="/orders/me">Orders</Link> */}
                                <Link className="dropdown-item" to="/registerCourse" >Khóa học đã đăng ký</Link>
                                <Link className="dropdown-item" to="/me">Thông tin cá nhân</Link>
                                <Link className="dropdown-item text-danger" to="/" onClick={logoutHandler}>
                                    Đăng xuất
                                </Link>

                            </div>


                        </div>

                        </>
                        
                        

                    ) : !loading && <Link to="/login" className="btn ml-4" id="login_btn">Đăng nhập</Link>}


                </div>
            </nav>
        </Fragment>
    )
}

export default Header
