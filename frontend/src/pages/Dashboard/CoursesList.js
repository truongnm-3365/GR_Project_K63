import React, { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MDBDataTable } from 'mdbreact'

import MetaData from '../../components/layout/MetaData'
import Loader from '../../components/layout/Loader'
import Sidebar from './Sidebar'

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { getMeCourses, getAdminCourses, deleteCourse, clearErrors, acceptCourse } from '../../actions/courseActions'
import { DELETE_COURSE_RESET,  UPDATE_COURSE_RESET } from '../../constants/courseConstants'


const CoursesList = ({ history }) => {

    const alert = useAlert();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth)
    const { loading, error, courses } = useSelector(state => state.courses);
    const { error: deleteError, isDeleted, isUpdated } = useSelector(state => state.course)

    const deleteCourseHandler = (id) => {
        dispatch(deleteCourse(id))
    }

    const acceptCourseHandler = (id) =>{
        dispatch(acceptCourse(id,courses))
    }
    useEffect(() => {
        if(user.role === 'user')
            dispatch(getMeCourses(user._id));
        else
            dispatch(getAdminCourses());
        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }

        if (deleteError) {
            alert.error(deleteError);
            dispatch(clearErrors())
        }

        if (isDeleted) {
            alert.success('Xóa khóa học thành công');
            history.push('/me/courses');
            dispatch({ type: DELETE_COURSE_RESET })
        }

        if (isUpdated) {
            alert.success('Phê duyệt thành công');
            dispatch({ type: UPDATE_COURSE_RESET })
        }

    }, [dispatch, alert, error, deleteError, isDeleted, isUpdated, history])

    const setCourses = () => {
        const data = {
            columns: [
                {
                    label: 'ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Tên',
                    field: 'name',
                    sort: 'asc'
                },
                {
                    label: 'Giá thành',
                    field: 'price',
                    sort: 'asc'
                },
                {
                    label: 'Các chủ đề',
                    field: 'topics',
                },
                {
                    label: 'Các bài học',
                    field: 'lessons',
                },
                {
                    label: 'Thao tác',
                    field: 'actions',
                },
            ],
            rows: []
        }

        !!courses && courses.forEach(course => {
            data.rows.push({
                id: course._id,
                name: course.name,
                price: `$${course.price}`,
                lessons: <Fragment>
                    <Link to={`/me/course/${course._id}/lessons`} className="btn btn-primary py-1 px-2">
                        <i className="fa fa-eye"></i>
                    </Link>
                </Fragment>,
                topics: <Fragment>
                    <Link to={`/me/course/${course._id}/topics`} className="btn btn-primary py-1 px-2">
                        <i className="fa fa-eye"></i>
                    </Link>
                </Fragment>,
                actions: <Fragment>
                    <Link to={`/me/course/${course._id}`} className="btn btn-primary py-1 px-2">
                        <i className="fa fa-pencil"></i>
                    </Link>
                    <button className="btn btn-danger py-1 px-2 ml-2" onClick={() => deleteCourseHandler(course._id)}>
                        <i className="fa fa-trash"></i>
                    </button>
                    {user.role === 'admin' && course.accepted ===true &&
                        <button className="btn btn-success py-1 px-2 ml-2">
                            Đã phê duyệt
                        </button>
                    }
                    {user.role === 'admin' && course.accepted === false &&
                        <button className="btn btn-danger py-1 px-2 ml-2" onClick={() => acceptCourseHandler(course._id)}>
                            Phê duyệt
                        </button>
                    }
                </Fragment>
            })
        })

        return data;
    }



    return (
        <Fragment>
            <MetaData title={'Tất cả các khóa học'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <Fragment>
                        <h1 className="my-5">Tất cả các khóa học của tôi</h1>

                        {loading ? <Loader /> : (
                            <MDBDataTable
                                data={setCourses()}
                                className="px-3"
                                bordered
                                striped
                                hover
                            />
                        )}

                    </Fragment>
                </div>
            </div>

        </Fragment>
    )
}

export default CoursesList
