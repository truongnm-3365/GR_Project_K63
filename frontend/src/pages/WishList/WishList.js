import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteWishlist, getMeWishList } from '../../actions/wishListAction';
import Course from '../../components/course/Course';
import { Alert, Button, Pagination, Space } from 'antd';
import MetaData from '../../components/layout/MetaData';
import { DELETE_WISH_LIST_RESET } from '../../constants/wishListContant';
import { useAlert } from 'react-alert';

const WishList = () => {
    const dispatch = useDispatch();
    const { wishList } = useSelector(state => state.wishList)
    const { isDeleted } = useSelector(state => state.deleteWishList)
    const [text,setText] = useState("")
    const [keyword,setKeyword] = useState("")

    const alert = useAlert();

    const onSearch = (e) =>{
            e.preventDefault();
            setKeyword(text)
            setText("")
        }
    
    const [currentPage, setCurrentPage ] = useState(1);

    const pageSize = 4

    const Search = (courses) =>{
        
        return courses?.filter((item) => {
            return keyword === ''
                  ? item
                  : item.course.name.toLowerCase().includes(keyword.toLowerCase()) 
                    || item.course.description.toLowerCase().includes(keyword.toLowerCase()) 
                    || item.course.category.toLowerCase().includes(keyword.toLowerCase()) ;
        })
        

    }

    useEffect(() =>{
        dispatch(getMeWishList());
        if(isDeleted){
            alert.success('Đã xóa khỏi danh sách yêu thích')
            dispatch({ type: DELETE_WISH_LIST_RESET })
               
        }
    },[dispatch,keyword,isDeleted])
    return (
        <div className='container' style={{minHeight:'500px',position:'relative'}}>
             <MetaData title={'Danh sách yêu thích'} />
            <div className='row mt-3' style={{position: 'absolute',right: '0',top: '-50px'}}>
            {Search(wishList)?.length !== 0 &&
                    <form onSubmit={onSearch} className="form-inline float-right" style={{marginBottom:'-6px'}}>
                        <div className="form-group mx-sm-3 mb-2">
                            <label for="inputText" className="sr-only">Tìm kiếm</label>
                            <input onChange={e => setText(e.target.value)} type="text" className="form-control" id="inputText" placeholder="Tìm kiếm"/>
                        </div>
                        <button type="submit" className="btn btn-success mb-2">Tìm kiếm</button>
                    </form>
                    }

            </div>

            <section id="courses" className="mt-5">
                        <div className="row">

                            {wishList.length === 0 && 
                                <Space    
                                    direction="vertical"
                                    align='center'
                                    style={{
                                        width: '100%',
                                    }}>
                                    <Alert message="Không có khóa học yêu thích nào" type="warning" />
                                </Space>
                                
                            }
                            {(
                                Search(wishList?.filter((item,index) => index >= (currentPage - 1)*pageSize & index <= (currentPage*pageSize - 1) ))?.map(item => (
                                    <>
                                        <Course key={item.course._id} course={item.course} col={3} />
                                        <Button onClick={() => dispatch(deleteWishlist(item._id))} type='primary' style={{marginLeft: '-54px'}} danger>X</Button>
                                    </>
                                    
                                ))
                            )}
                            {Search(wishList)?.length !== 0 &&
                            <div className='w-100'>
                                <Pagination
                                    style={{float:'right',marginTop:'10px'}} 
                                    onChange={(page) => setCurrentPage(page)} 
                                    
                                    total={Search(wishList)?.length} 
                                    pageSize={pageSize} 
                                />

                            </div>
                            }


                        </div>
            </section>
        </div>
    )
}

export default WishList