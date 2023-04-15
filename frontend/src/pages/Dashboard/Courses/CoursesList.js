import React, { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Table,Tag, Input  } from 'antd';

import MetaData from '../../../components/layout/MetaData'
import Loader from '../../../components/layout/Loader'
import Sidebar from '../Sidebar'

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { getMeCourses, getAdminCourses, deleteCourse, clearErrors, acceptCourse } from '../../../actions/courseActions'
import { DELETE_COURSE_RESET,  UPDATE_COURSE_RESET } from '../../../constants/courseConstants'

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
    },
    {
        title: 'Tên',
        dataIndex: 'name',
    },
    {
        title: 'Giá thành',
        dataIndex: 'price',
    },
    {
        title: 'Các chủ đề',
        dataIndex: 'topics',
    },
    {
        title: 'Các bài học',
        dataIndex: 'lessons',
    },
    {
        title: 'Tài liệu',
        dataIndex: 'documents',
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
    },
    {
        title: 'Thao tác',
        dataIndex: 'actions',
    },
];

const { Search } = Input;

const CoursesList = ({ history }) => {

    const alert = useAlert();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth)
    const { loading, error, courses } = useSelector(state => state.courses);
    const { error: deleteError, isDeleted, isUpdated } = useSelector(state => state.course)

    const [search, setSearch] = useState('');
    const [status,setStatus] = useState('');
    const onSearch = (value) => setSearch(value);

    const data = [];
    

    !!courses && courses.filter((item) => {
        return search === ''
          ? item
          : (item.name.toLowerCase().includes(search.toLowerCase()) || item._id.toLowerCase().includes(search.toLowerCase()));
      }).filter((item) => {
        return status === ''
          ? item
          : (item.accepted === status);
      }).forEach(course => {
        data.push({
            id: course._id,
            name: course.name,
            price: `${course.price} Đồng`,
            lessons: <Fragment>
                <Link to={`/me/course/${course._id}/lessons`} className="btn btn-success py-1 px-2">
                    <i className="fa fa-eye"></i>
                </Link>
            </Fragment>,
            documents: <Fragment>
                <Link to={`/me/course/${course._id}/documents`} className="btn btn-success py-1 px-2">
                    <i className="fa fa-eye"></i>
                </Link>
            </Fragment>,
            topics: <Fragment>
                <Link to={`/me/course/${course._id}/topics`} className="btn btn-success py-1 px-2">
                    <i className="fa fa-eye"></i>
                </Link>
            </Fragment>,
            status: <Fragment>
                {course.accepted ?  <Tag color={'green'} >Đã phê duyệt </Tag> : <Tag color={'red'} >Chưa phê duyệt </Tag> }
            </Fragment>,
            actions: <Fragment>
                <Link to={`/me/course/${course._id}`} className="btn btn-success py-1 px-2">
                    <i className="fa fa-pencil"></i>
                </Link>
                <button className="btn btn-danger py-1 px-2 ml-2" onClick={() => deleteCourseHandler(course._id)}>
                    <i className="fa fa-trash"></i>
                </button>
                {user.role === 'admin' && course.accepted === false &&
                    <button className="btn btn-danger py-1 px-2 ml-2" onClick={() => acceptCourseHandler(course._id)}>
                        Phê duyệt
                    </button>
                }
            </Fragment>
        })
    })
    

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




    return (
        <Fragment>
            <MetaData title={'Tất cả các khóa học'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <Fragment>
                        <h1 className="my-5">Tất cả các khóa học</h1>
                        <div className='float-right m-2'>
                            <Search
                                placeholder="Nhập vào từ khóa tìm kiếm tên"
                                allowClear
                                enterButton="Tìm kiếm"
                                size="large"
                                onSearch={onSearch}
                                style={{
                                    width: 500,
                                }}
                            />
                        </div>

                        {loading ? <Loader /> : (
                            <div>
                            <div
                              style={{
                                marginBottom: 16,
                              }}
                            >
                             <span
                                style={{
                                  marginLeft: 8,
                                }}
                              >
                              </span>
                              <Button type="primary" style={{ background: "#006241"}} onClick={() => setStatus('')}>
                                Tất cả
                              </Button>
                              <span
                                style={{
                                  marginLeft: 8,
                                }}
                              >
                              </span>
                              <Button type="primary" style={{ background: "#006241"}} onClick={() => {setStatus(true)}} >
                                Đã phê duyệt
                              </Button>
                              <span
                                style={{
                                  marginLeft: 8,
                                }}
                              >
                              </span>
                              <Button type="primary" style={{ background: "#006241"}} onClick={() => {setStatus(false)}} >
                                Đang chờ phê duyệt
                              </Button>
                              <span
                                style={{
                                  marginLeft: 8,
                                }}
                              >
                              </span>
                            </div>
                            <Table columns={columns} dataSource={data} 
                                   pagination={{ defaultPageSize: 4 }}

                            />
                          </div>
                        )}

                    </Fragment>
                </div>
            </div>

        </Fragment>
    )
}

export default CoursesList
