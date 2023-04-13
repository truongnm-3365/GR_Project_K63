import React, { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Table,Button, Input, Space  } from 'antd';

import MetaData from '../../../components/layout/MetaData'
import Loader from '../../../components/layout/Loader'
import Sidebar from '../Sidebar'

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { allUsers, deleteUser, clearErrors } from '../../../actions/userActions'
import { DELETE_USER_RESET } from '../../../constants/userConstants'

const columns =[
    {
        title: 'ID',
        dataIndex: 'id',
    },
    {
        title: 'Tên',
        dataIndex: 'name',
    },
    {
        title: 'Email',
        dataIndex: 'email',
    },
    {
        title: 'Vai trò',
        dataIndex: 'role',
    },
    {
        title: 'Thao tác',
        dataIndex: 'actions',
    },
]

const { Search } = Input;

const UsersList = ({ history }) => {

    const alert = useAlert();
    const dispatch = useDispatch();

    const { loading, error, users } = useSelector(state => state.allUsers);
    const { isDeleted } = useSelector(state => state.user)

    const [search, setSearch] = useState('');

    useEffect(() => {
        dispatch(allUsers());

        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }

        if (isDeleted) {
            alert.success('Người dùng này đã được xóa thành công');
            history.push('/admin/users');
            dispatch({ type: DELETE_USER_RESET })
        }

    }, [dispatch, alert, error, isDeleted, history])

    const deleteUserHandler = (id) => {
        dispatch(deleteUser(id))
    }

    const data = [];
    
    !!users && users.filter((item) => {
        return search === ''
          ? item
          : (item.name.toLowerCase().includes(search.toLowerCase()) || item.email.toLowerCase().includes(search.toLowerCase()) || item.role.toLowerCase().includes(search.toLowerCase()) );
      }).forEach(user => {
        data.push({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,

            actions: <Fragment>
                <Link to={`/admin/user/${user._id}`} className="btn btn-success py-1 px-2">
                    <i className="fa fa-pencil"></i>
                </Link>
                <button className="btn btn-danger py-1 px-2 ml-2" onClick={() => deleteUserHandler(user._id)}>
                    <i className="fa fa-trash"></i>
                </button>
            </Fragment>
        })
    })

    const onSearch = (value) => setSearch(value);

    return (
        <Fragment>
            <MetaData title={'All Users'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <Fragment>
                        <h1 className="my-5">Tất cả người dùng</h1>
                        <div className='float-right m-2'>
                            <Search
                                placeholder="Nhập vào từ khóa tìm kiếm tên, email, vai trò"
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
                            <Table columns={columns} dataSource={data} 
                                pagination={{ defaultPageSize: 4 }}

                            />
                        )}

                    </Fragment>
                </div>
            </div>

        </Fragment>
    )
}

export default UsersList
