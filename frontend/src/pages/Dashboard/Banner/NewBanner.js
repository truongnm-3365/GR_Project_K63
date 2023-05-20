import React, { Fragment, useState, useEffect } from 'react'

import MetaData from '../../../components/layout/MetaData'
import Sidebar from '../Sidebar'

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'

import { clearErrors, getBanners, newBanner } from '../../../actions/bannerAction'
import { NEW_BANNER_RESET } from '../../../constants/bannerConstant'


const NewBanner = ({ history }) => {

   
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([])


    const alert = useAlert();
    const dispatch = useDispatch();

    const { loading, error, success } = useSelector(state => state.newBanner);

    useEffect(() => {
        dispatch(getBanners());

        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }

        if (success) {
            history.push('/admin/banners');
            alert.success('Tạo banner thành công');
            dispatch({ type: NEW_BANNER_RESET })
        }

    }, [dispatch, alert, error, success, history])

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();

        for (let key in images) {
            formData.append("images", images[key]);
        }

        const data = {images}
        

        dispatch(newBanner(formData))
    }

    const onChange = e => {

        const files = Array.from(e.target.files)

        setImagesPreview([]);
        setImages([])

        files.forEach(file => {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview(oldArray => [...oldArray, reader.result])  
                    setImages(e.target.files)
                }
            }

            reader.readAsDataURL(file)
        })
    }


    return (
        <Fragment>
            <MetaData title={'Banner mới'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <Fragment>
                        <div className="wrapper my-5">
                            <form className="shadow-lg" onSubmit={submitHandler} encType='multipart/form-data'>
                                <h1 className="mb-4">Banner mới</h1>

                                <div className='form-group'>
                                    <label>Ảnh Banner</label>

                                    <div className='custom-file'>
                                        <input
                                            type='file'
                                            name='images'
                                            className='custom-file-input'
                                            id='customFile'
                                            onChange={onChange}
                                            //multiple
                                            accept=".png, .jpeg, .jpg"
                                        />
                                        <label className='custom-file-label' htmlFor='customFile'>
                                            Chọn ảnh
                                     </label>
                                    </div>

                                    {imagesPreview.map(img => (
                                        <img src={img} key={img} alt="Images Preview" className="mt-3 mr-2" width="600" />
                                    ))}

                                </div>



                                <button
                                    id="login_button"
                                    type="submit"
                                    className="btn btn-block py-3"
                                    disabled={loading ? true : false}
                                >
                                    TẠO MỚI
                                </button>

                            </form>
                        </div>
                    </Fragment>
                </div>
            </div>

        </Fragment>
    )
}

export default NewBanner
