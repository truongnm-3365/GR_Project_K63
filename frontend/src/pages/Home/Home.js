import React, { Fragment, useState, useEffect } from 'react'
import Pagination from 'react-js-pagination'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css';

import MetaData from '../../components/layout/MetaData'
import Course from '../Course/Course'
import Loader from '../../components/layout/Loader'

import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert';
import { getCourses } from '../../actions/courseActions'
import { getCategories } from '../../actions/categoryAction';
import { useLocation } from 'react-router-dom';
import { getBanners } from '../../actions/bannerAction';
import Banner from '../../components/banner/Banner';

const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range)

const useQuery = () => {
    const { search } = useLocation();
  
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

const Home = ({history}) => {

    const [currentPage, setCurrentPage] = useState(1)
    const [price, setPrice] = useState([0, 1000])
    const [category, setCategory] = useState('')
    const [rating, setRating] = useState(0)

    const { categories } = useSelector(state => state.categories);
    const { banners } = useSelector(state => state.banners)

    let query = useQuery();
    const alert = useAlert();
    const dispatch = useDispatch();

    const { loading, courses, error, coursesCount, resPerPage, filteredCoursesCount } = useSelector(state => state.courses)

    
    const keyword = query.get("keyword") || ""
    const categoryQuery = query.get("category") || ""

    
    useEffect(() => {
        
        dispatch(getCategories());
        dispatch(getBanners());
        
        if (error) {
            return alert.error(error)
        }

        if(categoryQuery){
            dispatch(getCourses(keyword, currentPage, price, categoryQuery, rating));
        }else{
            dispatch(getCourses(keyword, currentPage, price, category, rating));
        }
        
        


    }, [dispatch, alert, error, keyword, currentPage, price, category, rating,categoryQuery])

    function setCurrentPageNo(pageNumber) {
        setCurrentPage(pageNumber)
    }


    const handleCategory = (categoryName) =>{
        setCategory(categoryName)
        history.push(`/search?keyword=${keyword}&&category=${categoryName}`)

    }

    let count = coursesCount;
    if (keyword) {
        count = filteredCoursesCount
    }

    return (
        <Fragment>
            {loading ? <Loader /> : (
                <Fragment>
                    <MetaData title={'Onraincoosu - Hãy tận hưởng những khóa bổ ích'} />
                    <Banner/>
                    

                    <section id="courses" className="container mt-5">
                        <h1 id="courses_heading">Khóa học mới nhất</h1>
                        <div className="row">

                            {(keyword || categoryQuery) ? (
                                <Fragment>
                                    <div className="col-6 col-md-3 mt-5 mb-5">
                                        <div className="px-5">
                                            <Range
                                                marks={{
                                                    0: `$0`,
                                                    1000: `$1000`
                                                }}
                                                min={0}
                                                max={1000}
                                                defaultValue={[0, 1000]}
                                                tipFormatter={value => `$${value}`}
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

                                                <ul className="pl-0">
                                                    {categories && 
                                                        <li
                                                            style={{
                                                                cursor: 'pointer',
                                                                listStyleType: 'none'
                                                            }}
                                                            onClick={() => handleCategory("")}
                                                        >
                                                            Tất cả
                                                        </li>
                                                    }
                                                    {categories && categories.map(category => (
                                                        <li
                                                            style={{
                                                                cursor: 'pointer',
                                                                listStyleType: 'none'
                                                            }}
                                                            key={category._id}
                                                            onClick={() => handleCategory(category.name)}
                                                        >
                                                            {category.name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <hr className="my-3" />

                                            <div className="mt-5">
                                                <h4 className="mb-3">
                                                    Ratings
                                                </h4>

                                                <ul className="pl-0">
                                                    {[5, 4, 3, 2, 1].map(star => (
                                                        <li
                                                            style={{
                                                                cursor: 'pointer',
                                                                listStyleType: 'none'
                                                            }}
                                                            key={star}
                                                            onClick={() => setRating(star)}
                                                        >
                                                            <div className="rating-outer">
                                                                <div className="rating-inner"
                                                                    style={{
                                                                        width: `${star * 20}%`
                                                                    }}
                                                                >
                                                                </div>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                        </div>
                                    </div>

                                    <div className="col-6 col-md-9">
                                        <div className="row">
                                            {courses.map(course => (
                                                <Course key={course._id} course={course} col={4} />
                                            ))}
                                        </div>
                                    </div>
                                </Fragment>
                            ) : (
                                    courses.map(course => (
                                        <Course key={course._id} course={course} col={3} />
                                    ))
                                )}

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

export default Home
