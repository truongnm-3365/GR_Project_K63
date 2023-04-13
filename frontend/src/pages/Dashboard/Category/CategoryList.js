import React, { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Table, Input } from 'antd';

import MetaData from '../../../components/layout/MetaData'
import Loader from '../../../components/layout/Loader'
import Sidebar from '../Sidebar'

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'

import { clearErrors, deleteCategory, getCategories } from '../../../actions/categoryAction'
import { DELETE_CATEGORY_RESET, UPDATE_CATEGORY_RESET } from '../../../constants/categoryConstant'


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
        title: 'Thao tác',
        dataIndex: 'actions',
    },
]

const { Search } = Input;

const CategoryList = ({ history }) => {

    const alert = useAlert();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth)
    const { loading, error, categories } = useSelector(state => state.categories);
    const { error: deleteError, isDeleted, isUpdated } = useSelector(state => state.category)

    const [search, setSearch] = useState('');
    const onSearch = (value) => setSearch(value);

    const deleteCategoryHandler = (id) => {
        dispatch(deleteCategory(id))
    }

    useEffect(() => {
        if(user.role === 'admin')
            dispatch(getCategories());
        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }

        if (deleteError) {
            alert.error(deleteError);
            dispatch(clearErrors())
        }

        if (isDeleted) {
            alert.success('Xóa thể loại thành công');
            history.push('/admin/categories');
            dispatch({ type: DELETE_CATEGORY_RESET })
        }

        if (isUpdated) {
            alert.success('Phê duyệt thành công');
            dispatch({ type: UPDATE_CATEGORY_RESET })
        }

    }, [dispatch, alert, error, deleteError, isDeleted, isUpdated, history])

    const data = [];

    !!categories && categories.filter((item) => {
        return search === ''
          ? item
          : (item.name.toLowerCase().includes(search.toLowerCase()));
      }).forEach(category => {
        data.push({
            id: category._id,
            name: category.name,
            actions: <Fragment>
                <Link to={`/admin/banner/update/${category._id}`} className="btn btn-success py-1 px-2">
                    <i className="fa fa-pencil"></i>
                </Link>
                <button className="btn btn-danger py-1 px-2 ml-2" onClick={() => deleteCategoryHandler(category._id)}>
                    <i className="fa fa-trash"></i>
                </button>
            </Fragment>
        })
    })
 

    return (
        <Fragment>
            <MetaData title={'Tất cả các thể loại'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <Fragment>
                        <h1 className="my-5">Tất cả các thể loại</h1>
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

export default CategoryList
