import React, { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Table,Button } from 'antd';

import MetaData from '../../../components/layout/MetaData'
import Loader from '../../../components/layout/Loader'
import Sidebar from '../Sidebar'

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'

import { DELETE_BANNER_RESET, UPDATE_BANNER_RESET } from '../../../constants/bannerConstant'
import { clearErrors, deletebanner, getBanners } from '../../../actions/bannerAction'


const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
    },
    {
        title: 'Ảnh',
        dataIndex: 'image',
       
    },
    {
        title: 'Thao tác',
        dataIndex: 'actions',
    },
]

const BannerList = ({ history }) => {

    const alert = useAlert();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth)
    const { loading, error, banners } = useSelector(state => state.banners);
    const { error: deleteError, isDeleted, isUpdated } = useSelector(state => state.banner)

    const deleteBannerHandler = (id) => {
        dispatch(deletebanner(id))
    }

    useEffect(() => {
        if(user.role === 'admin')
            dispatch(getBanners());
        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }

        if (deleteError) {
            alert.error(deleteError);
            dispatch(clearErrors())
        }

        if (isDeleted) {
            alert.success('Xóa banner thành công');
            history.push('/admin/banners');
            dispatch({ type: DELETE_BANNER_RESET })
        }

        if (isUpdated) {
            alert.success('Phê duyệt thành công');
            dispatch({ type: UPDATE_BANNER_RESET })
        }

    }, [dispatch, alert, error, deleteError, isDeleted, isUpdated, history])

    const data = [];

    !!banners && banners.forEach(banner => {
        data.push({
            id: banner._id,
            image: <img className="mt-3 mr-2" width="400" src={banner.images[0].url}/>,
            actions: <Fragment>
                <Link to={`/admin/banner/update/${banner._id}`} className="btn btn-success py-1 px-2">
                    <i className="fa fa-pencil"></i>
                </Link>
                <button className="btn btn-danger py-1 px-2 ml-2" onClick={() => deleteBannerHandler(banner._id)}>
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

export default BannerList
