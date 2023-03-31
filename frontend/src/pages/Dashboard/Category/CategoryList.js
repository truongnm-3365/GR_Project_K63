import React, { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MDBDataTable } from 'mdbreact'

import MetaData from '../../../components/layout/MetaData'
import Loader from '../../../components/layout/Loader'
import Sidebar from '../Sidebar'

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'

import { clearErrors, deleteCategory, getCategories } from '../../../actions/categoryAction'
import { DELETE_CATEGORY_RESET, UPDATE_CATEGORY_RESET } from '../../../constants/categoryConstant'


const CategoryList = ({ history }) => {

    const alert = useAlert();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth)
    const { loading, error, categories } = useSelector(state => state.categories);
    const { error: deleteError, isDeleted, isUpdated } = useSelector(state => state.category)

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

    const setCategories = () => {
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
                    label: 'Thao tác',
                    field: 'actions',
                },
            ],
            rows: []
        }

        !!categories && categories.forEach(category => {
            data.rows.push({
                id: category._id,
                name: category.name,
                actions: <Fragment>
                    <Link to={`/admin/banner/update/${category._id}`} className="btn btn-primary py-1 px-2">
                        <i className="fa fa-pencil"></i>
                    </Link>
                    <button className="btn btn-danger py-1 px-2 ml-2" onClick={() => deleteCategoryHandler(category._id)}>
                        <i className="fa fa-trash"></i>
                    </button>
                </Fragment>
            })
        })

        return data;
    }



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

                        {loading ? <Loader /> : (
                            <MDBDataTable
                                data={setCategories()}
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

export default CategoryList
