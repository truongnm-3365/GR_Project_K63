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





const Header = () => {
    const alert = useAlert();
    const dispatch = useDispatch();

    const { user, loading } = useSelector(state => state.auth)
    const { notifies, error, isDeleted } = useSelector(state => state.notifies)
    const { cartItems } = useSelector(state => state.cart)

    const logoutHandler = () => {
        dispatch(logout());
        alert.success('Đăng xuất thành công.')
    }

    const deleteNotifiesHandler = () =>{
        dispatch(deleteAllNotifies(user._id))
    }

    useEffect(() => {
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
                </div>

                {/* <div className="col-12 col-md-6 mt-2 mt-md-0">
                    <Route render={({ history }) => <Search history={history} />} />
                </div> */}

                <div className="col-12 col-md-3 mt-4 mt-md-0 text-center d-flex">
                    {/* <Link to="/cart" style={{ textDecoration: 'none' }} >
                        <span id="cart" className="ml-3">Cart</span>
                        <span className="ml-1" id="cart_count">{cartItems.length}</span>
                    </Link> */}
                    


                    {user ? (
                        <>
                            <span className='ml-3'>
                                <NotifyMe
                                    data={notifies.reverse()}
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
                                    <Link className="dropdown-item" to="/dashboard">Dashboard</Link>
                                )}
                                {user && user.role === 'user' && (
                                    <Link className="dropdown-item" to="/me/courses">Khóa học của tôi</Link>
                                )}
                                {/* <Link className="dropdown-item" to="/orders/me">Orders</Link> */}
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
