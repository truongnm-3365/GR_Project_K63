import React, { Fragment, useEffect, useState } from 'react'
import { Route, Link, useHistory, useLocation } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import { logout } from '../../actions/userActions'
import { getMeNotifies, deleteAllNotifies, deleteAllNotifiesMessage } from '../../actions/notifyAction'
import Search from './Search'
import NotifyMe from './NotifyMe/NotifyMe'
import { DELETE_ALL_NOTIFIES_RESET } from '../../constants/notifyContants'
import '../../App.css'
import { getCategories } from '../../actions/categoryAction'
import './index.css'
import { MessageFilled  } from '@ant-design/icons';
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import { Button } from 'antd'

const Header = () => {
    const alert = useAlert();
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();

    console.log(location);

    const { user, loading } = useSelector(state => state.auth)
    


    const { categories } = useSelector(state => state.categories);
    const { notifies, error, isDeleted } = useSelector(state => state.notifies)


    
    const isObjectEmpty = (objectName) => {
        if(objectName)
            return Object.keys(objectName).length === 0
        else{
            return true
        }
    }

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
        if(!isObjectEmpty(user)){
            dispatch(getMeNotifies(user?._id))
        }
            
            
        if (isDeleted) {
                
            dispatch({ type: DELETE_ALL_NOTIFIES_RESET })
        }

    }, [dispatch, alert, error,user,isDeleted])

    const onGoBack = () =>{
        if(location.pathname.includes("/lessons") && !location.pathname.includes("me") ){
            history.push(location.pathname.replace("/lessons",""))
        }else if(location.pathname.split("/").length === 4 && location.pathname.includes("/course") && !location.pathname.includes("me")){
            history.push(location.pathname.replace("/"+location.pathname.split("/")[3],""))
        }
        else{
            history.goBack()
        }
        
    }

    console.log(location.pathname.split("/"));


    return (
        
        <Fragment>
        {!isObjectEmpty(user) &&
            <div className="icon-bar">
            <Link className="" to='/chatbot'>
                <div style={{fontSize:'14px'}}>Chat Bot</div>
                <i class="fa fa-android" aria-hidden="true"></i>
            </Link> 
            <Link className="" to='/forum'>
                <div style={{fontSize:'14px'}}>Diễn đàn hỏi đáp</div>
                <i class="fa fa-question" aria-hidden="true"></i>
            </Link> 
            </div>
        }
            <nav className="navbar row">
                <div className="col-12 col-md-3">
                    <div className="navbar-brand" style={{color: 'white'}}>
                        <Link to="/">
                            <img style={{width: '60px'}} src="/images/logo.png" />
                            {location.pathname === '/' && 'Onraincoosu'}
                            
                            
                        </Link>
                        {location.pathname !== '/'   && <Button onClick={() => onGoBack()} style={{color:'white'}} type="text"><i class="fa fa-arrow-left" aria-hidden="true"></i><span className='ml-1'>QUAY LẠI</span></Button>}
                    </div>
                    <div className="ml-1 dropdown d-inline dropdown-hover">
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
                    
                    {!isObjectEmpty(user) ? (
                        <>
                            <span className='ml-3'>
                                <NotifyMe
                                    data={notifies.filter(item => item.type !== 1).sort(function(a,b){
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
                            <Link to='/chats' onClick={() => dispatch(deleteAllNotifiesMessage(user._id))} className='ml-3 d-flex align-items-center' style={{fontSize:'40px'}}>

                                <MessageFilled style={{color:'rgb(148, 224, 162)'}} />
                                <NotificationBadge
                                    count={notifies.filter(item => item.type === 1).length}
                                    effect={Effect.SCALE}
                                />
                            </Link>
                        <div className="ml-4 dropdown d-inline">
                            <Link to="#!" className="btn dropdown-toggle text-white mr-4" type="button" id="dropDownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">

                                <figure className="avatar avatar-nav">
                                    <img
                                        src={user?.avatar && process.env.REACT_APP_API_URL + user.avatar.url}
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
                                {user && user.role === 'creator' && (
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
