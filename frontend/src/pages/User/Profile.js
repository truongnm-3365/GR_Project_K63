import React, { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import Loader from '../../components/layout/Loader'
import MetaData from '../../components/layout/MetaData'
import { clearErrors, publicProfile } from '../../actions/userActions'
import { Pagination, Space } from 'antd'

import Course from '../../components/course/Course'

const Profile = ({ match }) => {

    const { user, loading, error } = useSelector(state => state.auth)

    const { profile } = useSelector(state => state.profile)

    const [text,setText] = useState("")
    const [keyword,setKeyword] = useState("")

    const onSearch = (e) =>{
        e.preventDefault();
        setKeyword(text)
        setText("")
    }
    
    const [currentPage, setCurrentPage ] = useState(1);

    const pageSize = 4

    const dispatch = useDispatch();

    let userId = match.params.id

    useEffect(() => {

        if(userId){
            dispatch(publicProfile(match.params.id))
        }else{
            dispatch(publicProfile(user._id))
        }
        
        
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }            
       
    },[dispatch,userId,keyword])

    


    

    const Search = (courses) =>{
        
        return courses?.filter((item) => {
            return keyword === ''
                  ? item
                  : item.name.toLowerCase().includes(keyword.toLowerCase()) 
                    || item.description.toLowerCase().includes(keyword.toLowerCase()) 
                    || item.category.toLowerCase().includes(keyword.toLowerCase()) ;
        })
        

    }


    return (
        <Fragment>
            {loading ? <Loader /> : (
                <div className='container'>
                    <MetaData title={'Thông tin của tôi'} />
                    {(user?._id === profile?._id || !userId) ?
                    <h2 className="mt-5">Thông tin của tôi</h2> :  <h2 className="mt-5">Thông tin cá nhân</h2>}
                    <div className="row justify-content-around mt-5 ">
                        <div className="col-12 col-md-3">
                            <figure className='avatar avatar-profile'>
                                <img className="rounded-circle img-fluid" src={process.env.REACT_APP_API_URL + profile?.avatar?.url} alt={profile?.name} />
                            </figure>
                            {(user?._id === profile?._id || !userId) &&
                            <Link to="/me/update" id="edit_profile" className="btn btn-primary btn-block my-5">
                                Chỉnh sửa thông tin
                            </Link>}
                        </div>

                        <div className="col-12 col-md-5">
                            <div className='d-flex'>
                                <h4 className='mr-3 mb-3'>Tên: </h4>
                                <h4 style={{color: '#006241'}}>{profile?.name}</h4>
                            </div>

                            <div className='d-flex'>
                                <h4 className='mr-3 mb-3'>Email: </h4>
                                <h4 style={{color: '#006241'}}>{profile?.email}</h4>
                            </div>    

                            <div className='d-flex'>
                                <h4 className='mr-3 mb-3'>Ngày tham gia: </h4>
                                <h4 style={{color: '#006241'}}>{String(profile?.createdAt).substring(0, 10)}</h4>
                            </div>

                            <div className='d-flex'>
                                <h4 className='mr-3 mb-3'>Vài trò: </h4>
                                <h4 style={{color: '#006241'}}>{profile?.role?.toUpperCase()}</h4>
                            </div>

                            <div className='d-flex'>
                                <h4 className='mr-3 mb-3'>Điểm tiêu dùng: </h4>
                                <h4 style={{color: '#006241'}}>{profile?.consumPoint}</h4>
                            </div>



                            {(user?._id === profile?._id || !userId) &&
                            <Link to="/password/update" className="btn btn-primary btn-block mt-3">
                                Đổi mật khẩu
                            </Link>}
                        </div>
                        
                    </div>
                    <hr></hr>
                   
                    {Search(profile?.courses)?.length !== 0 &&  <h2 id="courses_heading" >Khóa học đang được hiện thị trên web</h2>  }

                    {Search(profile?.courses)?.length !== 0 &&
                    <form onSubmit={onSearch} className="form-inline float-right" style={{marginBottom:'-6px'}}>
                        <div className="form-group mx-sm-3 mb-2">
                            <label for="inputText" className="sr-only">Tìm kiếm</label>
                            <input onChange={e => setText(e.target.value)} type="text" className="form-control" id="inputText" placeholder="Tìm kiếm"/>
                        </div>
                        <button type="submit" className="btn btn-success mb-2">Tìm kiếm</button>
                    </form>
                    }

                    <section id="courses" className="mt-5">
                        <div className="row">


                            {(
                                    Search(profile?.courses?.filter((item,index) => index >= (currentPage - 1)*pageSize & index <= (currentPage*pageSize - 1) ))?.map(course => (
                                        <Course key={course._id} course={course} col={3} />
                                    ))
                            )}
                            {Search(profile?.courses)?.length !== 0 &&
                            <div className='w-100'>
                                <Pagination
                                    style={{float:'right',marginTop:'10px'}} 
                                    onChange={(page) => setCurrentPage(page)} 
                                    
                                    total={Search(profile?.courses)?.length} 
                                    pageSize={pageSize} 
                                />

                            </div>
                            }


                        </div>
                    </section>
                </div>
            )}
        </Fragment>
    )
}

export default Profile
