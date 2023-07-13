import React, { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import Loader from '../../components/layout/Loader'
import MetaData from '../../components/layout/MetaData'
import { clearErrors, publicProfile } from '../../actions/userActions'
import { Pagination, Tabs, Avatar, List, Button} from 'antd'

import Course from '../../components/course/Course'
import { addFollow, deleteFollow, getFollowers, getFollowings } from '../../actions/followAction'
import { DELETE_FOLLOW_RESET } from '../../constants/followContant'
import { useAlert } from 'react-alert'

const Profile = ({ match }) => {

    const alert = useAlert();

    const { user, loading, error } = useSelector(state => state.auth)

    const { profile } = useSelector(state => state.profile)

    const { followers } = useSelector(state => state.followers)

    const { followings } = useSelector(state => state.followings)

    const { isDeleted } = useSelector(state => state.deleteFollow)

    const { loading:followLoading } = useSelector(state => state.newFollow);

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
            dispatch(getFollowers(match.params.id));
            dispatch(getFollowings(match.params.id));
        }else{
            dispatch(publicProfile(user._id))
            dispatch(getFollowers(user._id));
            dispatch(getFollowings(user._id));
        }
        
        
        
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }     
        
        if(isDeleted){
            alert.success('Đã hủy bỏ theo dõi')
            dispatch({ type: DELETE_FOLLOW_RESET })
               
        }
       
    },[dispatch,userId,keyword,isDeleted,followLoading])

    


    

    const Search = (courses) =>{
        
        return courses?.filter((item) => {
            return keyword === ''
                  ? item
                  : item.name.toLowerCase().includes(keyword.toLowerCase()) 
                    || item.description.toLowerCase().includes(keyword.toLowerCase()) 
                    || item.category.toLowerCase().includes(keyword.toLowerCase()) ;
        })
        

    }

    const isFollowing = () =>{
        for( let i = 0; i < followers?.length; i++){
            if(followers[i].follower._id === user._id){
                return true
            }
        }
        return false;
    }


    const items = [
        {
          key: '1',
          label: `Đang theo dõi`,
          children: <List
          itemLayout="horizontal"
          locale={{ emptyText: "Không có dữ liệu" }}
          pagination={{pageSize:3}}
          dataSource={followings.map(item => item.user)}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={process.env.REACT_APP_API_URL + item?.avatar?.url} />}
                title={<Link to={`/profile/${item?._id}`}>{item?.name}</Link>}
              />
            </List.Item>
          )}
        />,
        },
        {
          key: '2',
          label: `Người theo dõi`,
          children: <List
          itemLayout="horizontal"
          locale={{ emptyText: "Không có dữ liệu" }}
          pagination={{pageSize:3}}
          dataSource={followers.map(item => item.follower)}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={process.env.REACT_APP_API_URL + item?.avatar?.url} />}
                title={<Link to={`/profile/${item?._id}`}>{item?.name}</Link>}
              />
            </List.Item>
          )}
        />,
        },
      ];


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
                            <Link to="/me/update" id="edit_profile" className="btn btn-success btn-block my-5">
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
                            
                            {!(user?._id === profile?._id || !userId) &&
                            <div className='d-flex'>
                                {isFollowing() ? 
                                <>
                                    <Button className='mr-2' type='primary'>Đang theo dõi</Button>
                                    <Button onClick={() => dispatch(deleteFollow(userId))} danger>Hủy theo dõi</Button>
                                </>
                                 :
                                <Button onClick={() => dispatch(addFollow(userId))} type='primary'>Theo dõi</Button>
                                }
                            </div>
                            }



                            {(user?._id === profile?._id || !userId) &&
                            <Link to="/password/update" className="btn btn-success btn-block mt-3 mb-3">
                                Đổi mật khẩu
                            </Link>}

                            <Tabs defaultActiveKey="1" items={items} />
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
