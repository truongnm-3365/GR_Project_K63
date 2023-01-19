import React from 'react'
import { Link } from 'react-router-dom'

const Course = ({ course, col }) => {
    return (
        <div className={`col-sm-12 col-md-6 col-lg-${col} my-3`}>
            <div className="card p-3 rounded">
                <img
                    className="card-img-top mx-auto"
                    src={course.images[0].url}
                />
                <div className="card-body d-flex flex-column">
                    <h5 className="card-title">
                        <Link to={`/course/${course._id}`}>{course.name}</Link>
                    </h5>
                    <div className="ratings mt-auto">
                        <div className="rating-outer">
                            <div className="rating-inner" style={{ width: `${(course.ratings / 5) * 100}%` }}></div>
                        </div>
                        <span id="no_of_reviews">({course.numOfReviews} Đánh giá)</span>
                    </div>
                    <p className="card-text">{course.price === 0 ? "Miễn phí" : '$' + course.price}</p>
                    <Link to={`/course/${course._id}`} id="view_btn" className="btn btn-block">Xem chi tiết</Link>
                </div>
            </div>
        </div>
    )
}

export default Course
