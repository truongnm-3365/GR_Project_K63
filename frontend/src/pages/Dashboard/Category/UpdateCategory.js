import React, { Fragment, useState, useEffect } from 'react'

import MetaData from '../../../components/layout/MetaData'
import Sidebar from '../Sidebar'

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'

import { clearErrors, getCategoryDetails, updateCategory } from '../../../actions/categoryAction'
import { UPDATE_CATEGORY_RESET } from '../../../constants/categoryConstant'
const UpdateCategory = ({ match, history }) => {

    const [name, setName] = useState('');

    const alert = useAlert();
    const dispatch = useDispatch();

    const { error, category } = useSelector(state => state.categoryDetails)
    const { loading, error: updateError, isUpdated } = useSelector(state => state.category);
    


    useEffect(() => {
        dispatch(getCategoryDetails(match.params.id));
        

        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }

        if (updateError) {
            alert.error(updateError);
            dispatch(clearErrors())
        }


        if (isUpdated) {
            history.push('/admin/categories');
            alert.success('Cập nhật thể loại thành công');
            dispatch({ type: UPDATE_CATEGORY_RESET })
        }

    }, [dispatch, alert, error, isUpdated, history, updateError,match])



    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name? name: category.name);
    
        let data = {
            name: name ? name : category.name
        }
        
        dispatch(updateCategory(category._id, data))
    }


    return (
        <Fragment>
            <MetaData title={'Cập nhật thể loại'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <Fragment>
                        {!!category &&
                        <div className="wrapper my-5">
                            <form className="shadow-lg" onSubmit={submitHandler} encType='multipart/form-data'>
                                <h1 className="mb-4">Cập nhật thể loại</h1>

                                <div className="form-group">
                                    <label htmlFor="name_field">Tên</label>
                                    <input
                                        type="text"
                                        id="name_field"
                                        className="form-control"
                                        defaultValue={category.name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>


                                <button
                                    id="login_button"
                                    type="submit"
                                    className="btn btn-block py-3"
                                    disabled={loading ? true : false}
                                >
                                    CẬP NHẬT
                            </button>

                            </form>
                        </div>
                        }
                    </Fragment>
                </div>
            </div>

        </Fragment>
    )
}

export default UpdateCategory
