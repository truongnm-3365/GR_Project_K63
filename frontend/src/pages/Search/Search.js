import React, { Fragment, useState, useEffect } from 'react'
import Pagination from 'react-js-pagination'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css';

import MetaData from '../../components/layout/MetaData'

import Loader from '../../components/layout/Loader'
import { Radio, Space } from 'antd';

import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert';
import { getCourses } from '../../actions/courseActions'
import { getCategories } from '../../actions/categoryAction';
import { useLocation } from 'react-router-dom';
import Course from '../../components/course/Course';
import './Search.css'
import SearchCourse from '../../components/course/SearchCourse';

const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range)

const useQuery = () => {
    const { search } = useLocation();
  
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

const Search = ({history}) => {

    const [currentPage, setCurrentPage] = useState(1)
    const [price, setPrice] = useState([0, 1000000])
    const [category, setCategory] = useState('')
    const [rating, setRating] = useState(0)


    const { categories } = useSelector(state => state.categories);

    let query = useQuery();
    const alert = useAlert();
    const dispatch = useDispatch();

    const { loading, courses, error, coursesCount, resPerPage, filteredCoursesCount } = useSelector(state => state.courses)

    
    const keyword = query.get("keyword") || ""
    const categoryQuery = query.get("category") || ""
    const ratingQuery = query.get("rating") || 0
    
    useEffect(() => {
        
        dispatch(getCategories());
        
        if (error) {
            return alert.error(error)
        }

      
        dispatch(getCourses(keyword, currentPage, price, categoryQuery, ratingQuery));
        if(categoryQuery){
            setCategory(categoryQuery)
        }
        
        


    }, [dispatch, alert, error, keyword, currentPage, price, category, rating,categoryQuery,ratingQuery])

    function setCurrentPageNo(pageNumber) {
        setCurrentPage(pageNumber)
    }

    const onChangeCategory = (e) => {
        setCategory(e.target.value)
        history.push(`/search?keyword=${keyword}&&category=${e.target.value}&&rating=${rating}`)
    };
  
    const onChangeStar = (e) =>{
        setRating(e.target.value)
        history.push(`/search?keyword=${keyword}&&category=${category}&&rating=${e.target.value}`)
    }

    let count = coursesCount;
    if (keyword || categoryQuery || ratingQuery) {
        count = filteredCoursesCount
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
                                            <Range
                                                marks={{
                                                    0: `0`,
                                                    1000000: `1,000,000 Đồng`
                                                }}
                                                min={0}
                                                max={1000000}
                                                defaultValue={[0, 1000000]}
                                                tipFormatter={value => `${value}`}
                                                tipProps={{
                                                    placement: "top",
                                                    visible: true
                                                }}
                                                value={price}
                                                onChange={price => setPrice(price)}
                                            />

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

                    {resPerPage <= count && (
                        <div className="d-flex justify-content-center mt-5">
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={resPerPage}
                                totalItemsCount={coursesCount}
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
