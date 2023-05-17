import React, { Fragment, useState, useEffect } from 'react'
import Pagination from 'react-js-pagination'

import MetaData from '../../components/layout/MetaData'

import Loader from '../../components/layout/Loader'

import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert';
import { getCourses } from '../../actions/courseActions'
import { getCategories } from '../../actions/categoryAction';

import { getBanners } from '../../actions/bannerAction';
import Banner from '../../components/banner/Banner';
import Course from '../../components/course/Course';
import RegularCourses from '../../components/regularCourses/regularCourses';


const Home = () => {

    const [currentPage, setCurrentPage] = useState(1)
    const [price, setPrice] = useState([0, 1000000])
    const [category, setCategory] = useState('')
    const [rating, setRating] = useState(0)

    const alert = useAlert();
    const dispatch = useDispatch();

    const { loading, courses, error, coursesCount, resPerPage, filteredCoursesCount } = useSelector(state => state.courses)

    
    const keyword =  ""

    
    useEffect(() => {
        
        dispatch(getCategories());
        dispatch(getBanners());
        
        if (error) {
            return alert.error(error)
        }


        dispatch(getCourses(keyword, currentPage, price, category, rating));
        


    }, [dispatch, alert, error, keyword, currentPage, price, category, rating])

    function setCurrentPageNo(pageNumber) {
        setCurrentPage(pageNumber)
    }


    let count = coursesCount;

    return (
        <Fragment>
            {loading ? <Loader /> : (
                <Fragment>
                    <MetaData title={'Onraincoosu - Hãy tận hưởng những khóa bổ ích'} />
                    <Banner/>
                    

                    <section id="courses" className="container mt-5">
                        <RegularCourses courses={courses ? courses : []}/>
                       <h1 id="courses_heading">Khóa học mới nhất</h1>
                        <div className="row">

                            {
                                courses?.map(course => (
                                        <Course key={course._id} course={course} col={3} />
                                ))
                            }

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
