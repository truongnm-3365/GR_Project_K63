import React, { Fragment, useState, useEffect } from 'react'
import { MDBDataTable } from 'mdbreact'

import MetaData from '../../../components/layout/MetaData'
import Loader from '../../../components/layout/Loader'
import Sidebar from '../Sidebar'

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { getCourseReviews, deleteReview, clearErrors } from '../../../actions/courseActions'
import { DELETE_REVIEW_RESET } from '../../../constants/courseConstants'

const CourseReviews = () => {

    const [courseId, setCourseId] = useState('')

    const alert = useAlert();
    const dispatch = useDispatch();

    const { error, reviews } = useSelector(state => state.courseReviews);
    const { isDeleted, error: deleteError } = useSelector(state => state.review)

    useEffect(() => {

        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }

        if (deleteError) {
            alert.error(deleteError);
            dispatch(clearErrors())
        }

        if (courseId !== '') {
            dispatch(getCourseReviews(courseId))
        }

        if (isDeleted) {
            alert.success('Xóa bình luận thành công');
            dispatch({ type: DELETE_REVIEW_RESET })
        }



    }, [dispatch, alert, error, courseId, isDeleted, deleteError])

    const deleteReviewHandler = (id) => {
        dispatch(deleteReview(id, courseId))
    }

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(getCourseReviews(courseId))
    }

    const setReviews = () => {
        const data = {
            columns: [
                {
                    label: 'ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Đánh giá',
                    field: 'rating',
                    sort: 'asc'
                },
                {
                    label: 'Bình luận',
                    field: 'comment',
                    sort: 'asc'
                },
                {
                    label: 'Người dùng',
                    field: 'user',
                    sort: 'asc'
                },
                {
                    label: 'Thao tác',
                    field: 'actions',
                },
            ],
            rows: []
        }

        reviews.forEach(review => {
            data.rows.push({
                id: review._id,
                rating: review.rating,
                comment: review.comment,
                user: review.name,

                actions:
                    <button className="btn btn-danger py-1 px-2 ml-2" onClick={() => deleteReviewHandler(review._id)}>
                        <i className="fa fa-trash"></i>
                    </button>
            })
        })

        return data;
    }

    return (
        <Fragment>
            <MetaData title={'Course Reviews'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <Fragment>
                        <div className="row justify-content-center mt-5">
                            <div className="col-5">
                                <form onSubmit={submitHandler}>
                                    <div className="form-group">
                                        <label htmlFor="courseId_field">Nhập mã khóa học</label>
                                        <input
                                            type="text"
                                            id="courseId_field"
                                            className="form-control"
                                            value={courseId}
                                            onChange={(e) => setCourseId(e.target.value)}
                                        />
                                    </div>

                                    <button
                                        id="search_button"
                                        type="submit"
                                        className="btn btn-primary btn-block py-2"
                                    >
                                        TÌM KIẾM
								    </button>
                                </ form>
                            </div>

                        </div>

                        {reviews && reviews.length > 0 ? (
                            <MDBDataTable
                                data={setReviews()}
                                className="px-3"
                                bordered
                                striped
                                hover
                            />
                        ) : (
                                <p className="mt-5 text-center">Không có bình luận nào</p>
                            )}


                    </Fragment>
                </div>
            </div>

        </Fragment>
    )
}

export default CourseReviews
