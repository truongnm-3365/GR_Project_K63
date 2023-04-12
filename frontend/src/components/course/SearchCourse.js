import React from 'react'
import { Link } from 'react-router-dom'
import './index.css'

const SearchCourse = ({ course, col }) => {
    return (
        <Link className='w-100' to={`/course/${course._id}`} >
            <div className={`mx-5 mb-1 w-100`}>
            <div className="card p-3 rounded d-flex flex-row d-flex justify-content-between">
                <div className='d-flex'>
                    <img
                        className="card-img-top mx-3 "
                        src={course.images[0].url}
                    />
                    <div className="d-flex flex-column">
                        <h5 className="card-title font-weight-bold">
                            <Link to={`/course/${course._id}`}>{course.name}</Link>
                        </h5>
                        <p>{course.description}</p>
                        <div className="ratings mt-auto">
                            <div className="rating-outer" style={{fontSize:'14px'}}>
                                <div className="rating-inner" style={{ fontSize:'14px', width: `${(course.ratings / 5) * 100}%` }}></div>
                            </div>
                            <span id="no_of_reviews">({course.numOfReviews} Đánh giá)</span>
                        </div>
                        <span className="mt-3">Số lượt đăng ký: {course.users?.length}</span>
                        <p className="">{course.price === 0 ? "Giá trị: Miễn phí" : 'Giá trị: ' + course.price}</p>
                    
                    </div>
                </div>

                {/* <div className='d-flex d-flex align-items-center'>
                <Link to={`/course/${course._id}`} id="view_btn" className="btn btn-block ">Xem chi tiết</Link>
                </div> */}
               
            </div>
        </div>
        </Link>

    )
}

export default SearchCourse