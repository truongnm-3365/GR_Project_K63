import React, { Fragment, useState, useEffect } from 'react'
import Pagination from 'react-js-pagination'
import 'rc-slider/assets/index.css';

import MetaData from '../../components/layout/MetaData'

import Loader from '../../components/layout/Loader'
import { Radio, Space,InputNumber, Button } from 'antd';

import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert';
import { getCourses } from '../../actions/courseActions'
import { getCategories } from '../../actions/categoryAction';
import { useLocation } from 'react-router-dom';



import './Search.css'
import SearchCourse from '../../components/course/SearchCourse';

const useQuery = () => {
    const { search } = useLocation();
  
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

const Search = ({history}) => {

    const [currentPage, setCurrentPage] = useState(1)
    const [price, setPrice] = useState([0, 1000000])
    const [minPrice,setMinPrice] = useState(0);
    const [maxPrice,setMaxPrice] = useState(1000000);
    const [category, setCategory] = useState('')
    const [rating, setRating] = useState(0)



    const { categories } = useSelector(state => state.categories);

    let query = useQuery();
    const alert = useAlert();
    const dispatch = useDispatch();

    const { loading, courses, error, coursesCount, resPerPageSearch, filteredCoursesCount } = useSelector(state => state.courses)

    
    const keyword = query.get("keyword") || ""

    const categoryQuery = query.get("category") || ""
    const ratingQuery = query.get("rating") || 0
    const minPriceQuery = query.get("price[gte]") || ""
    const maxPriceQuery = query.get("price[lte]") || ""
    const priceQuery = [minPriceQuery,maxPriceQuery].includes("") ? [0,1000000] : [minPriceQuery,maxPriceQuery]
    

    useEffect(() =>{
        setCurrentPage(1)
    },[keyword])

    

    useEffect(() => {
        
        dispatch(getCategories());
        
        if (error) {
            return alert.error(error)
        }

      
        dispatch(getCourses(keyword, currentPage, priceQuery, categoryQuery, ratingQuery,true));
        
        if(categoryQuery){
            setCategory(categoryQuery)
        }

        
        //setCurrentPage(1);
        
       


    }, [dispatch, alert, error, keyword, currentPage, price, category, rating,categoryQuery,ratingQuery,minPriceQuery,maxPriceQuery])

    


    function setCurrentPageNo(pageNumber) {
        setCurrentPage(pageNumber)
    }

    const onChangeCategory = (e) => {
        setCategory(e.target.value)
        history.push(`/search?keyword=${keyword}&&category=${e.target.value}&&rating=${rating}&&price[lte]=${price[1]}&&price[gte]=${price[0]}`)
    };
  
    const onChangeStar = (e) =>{
        setRating(e.target.value)
        history.push(`/search?keyword=${keyword}&&category=${category}&&rating=${e.target.value}&&price[lte]=${price[1]}&&price[gte]=${price[0]}`)
    }

    const handlePrice = () =>{
        if(minPrice <= maxPrice){
            setPrice([minPrice,maxPrice])
            history.push(`/search?keyword=${keyword}&&category=${category}&&rating=${rating}&&price[lte]=${maxPrice}&&price[gte]=${minPrice}`)
        }
            
    }




    return (
        <Fragment>
            {loading ? <Loader /> : (
                <Fragment>
                    <MetaData title={'Onraincoosu - Hãy tận hưởng những khóa bổ ích'} />
                    
                    <section id="courses" className="container mt-5">
                        {keyword && <h2 className='mb-2'>Kết quả tìm kiếm cho từ khóa: {keyword}</h2>}
                        {categoryQuery && <h2 className='mb-2'>Kết quả tìm kiếm cho thể loại: {categoryQuery}</h2>}
                        <div className="row">
                            
                                <Fragment>
                                    <div className="col-6 col-md-4 mt-5 mb-5">
                                        <div className="px-5">
                                            <h4 className="mb-3">
                                                Giá tiền
                                            </h4>
                                            <Space>
                                                <InputNumber onChange={val => setMinPrice(val)}  defaultValue={minPrice} />-
                                                <InputNumber onChange={val => setMaxPrice(val)}  defaultValue={maxPrice} />
                                                <button className='btn btn-success' onClick={handlePrice} >Lọc</button>
                                            </Space>
                                            

                                            <hr className="my-5" />

                                            <div className="mt-5">
                                                <h4 className="mb-3">
                                                    Danh mục
                                                </h4>

                                                <div>
                                                <Radio.Group onChange={onChangeCategory} value={category}>
                                                    <Space direction="vertical">
                                                        <Radio value={""}>Tất cả</Radio>
                                                        {categories && categories.map(cate => 
                                                            <Radio key={cate._id} value={cate.name}>{cate.name}</Radio>
                                                        )}
                                                    </Space>

                                                </Radio.Group>
                                                </div>
                                            </div>

                                            <hr className="my-3" />

                                            <div className="mt-5">
                                                <h4 className="mb-3">
                                                    Đánh giá
                                                </h4>

                                                <Radio.Group onChange={onChangeStar} value={rating} >
                                                    <Space direction="vertical">
                                                        {[5, 4, 3, 2, 1,0].map(star => 
                                                            <Radio key={star} value={star}>
                                                                <div className="rating-outer">
                                                                    <div className="rating-inner"
                                                                        style={{
                                                                            width: `${star * 20}%`
                                                                        }}
                                                                    >
                                                                    </div>
                                                                </div>
                                                            {' '}<span style={{fontSize:'14px'}}>từ {star} trở lên</span>
                                                            </Radio>
                                                        )}
                                                    </Space>

                                                </Radio.Group>

                                            </div>

                                        </div>
                                    </div>

                                    <div className="col-6 col-md-8">
                                        <div className="row">
                                            {courses.sort(function(a,b){
                                                return new Date(b.createdAt) - new Date(a.createdAt);
                                            }).
                                            map(course => (
                                                <SearchCourse key={course._id} course={course} col={4} />
                                            ))}
                                        </div>
                                    </div>
                                </Fragment>

                        </div>
                    </section>

                    {resPerPageSearch < filteredCoursesCount && (
                        <div className="d-flex justify-content-center mt-5">
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={resPerPageSearch}
                                totalItemsCount={filteredCoursesCount}
                                onChange={setCurrentPageNo}
                                nextPageText={'Tiếp'}
                                prevPageText={'Trước'}
                                firstPageText={'Đầu tiên'}
                                lastPageText={'Cuối cùng'}
                                itemClass="page-item"
                                linkClass="page-link"
                            />
                        </div>
                    )}
                    

                </Fragment>
            )}

        </Fragment>
    )
}

export default Search
