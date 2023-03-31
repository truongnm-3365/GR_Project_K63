import React, { Fragment, useState, useEffect } from 'react'

import MetaData from '../../../components/layout/MetaData'
import Sidebar from '../Sidebar'

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { clearErrors, getBannerDetails, updateBanner } from '../../../actions/bannerAction'
import { UPDATE_BANNER_RESET } from '../../../constants/bannerConstant'

const UpdateBanner = ({ match, history }) => {

    const [images, setImages] = useState([]);

    const [imagesPreview, setImagesPreview] = useState([])

    const alert = useAlert();
    const dispatch = useDispatch();
    const { error, banner } = useSelector(state => state.bannerDetails)
    const { loading, error: updateError, isUpdated } = useSelector(state => state.banner);


    useEffect(() => {

        dispatch(getBannerDetails(match.params.id));
        

        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }

        if (updateError) {
            alert.error(updateError);
            dispatch(clearErrors())
        }


        if (isUpdated) {
            history.push('/admin/banners');
            alert.success('Cập nhật banner thành công');
            dispatch({ type: UPDATE_BANNER_RESET })
        }

    }, [dispatch, alert, error, isUpdated, history, updateError,match])


    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        

        if(images.length > 0){
            for (let key in images) {
                formData.append("images", images[key]);
            }
            
        }

        
        dispatch(updateBanner(banner._id, formData))
    }

    //console.log(new Date(course.details.startDate).toJSON().slice(0,10).split('-').reverse().join('/'));

    const onChange = e => {

        const files = Array.from(e.target.files)
        
        setImagesPreview([]);
        setImages([])
        
        files.forEach(file => {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview([reader.result])
                    setImages(e.target.files)
                }
            }

            reader.readAsDataURL(file)
        })
    }


    return (
        <Fragment>
            <MetaData title={'Cập nhật Banner'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <Fragment>
                        {banner &&
                        <div className="wrapper my-5">
                            <form className="shadow-lg" onSubmit={submitHandler} encType='multipart/form-data'>
                                <h1 className="mb-4">Cập nhật Banner</h1>
                                <div className='form-group'>
                                    <label>Ảnh Banner</label>

                                    <div className='custom-file'>
                                        <input
                                            type='file'
                                            name='images'
                                            className='custom-file-input'
                                            id='customFile'
                                            onChange={onChange}
                                            accept='.png ,.jpg ,.jpeg'
                                        />
                                        <label className='custom-file-label' htmlFor='customFile'>
                                            Chọn ảnh
                                 </label>
                                    </div>

                                    {banner.images && banner.images.map(img => (
                                        <img key={img} src={img.url} alt={img.url} className="mt-3 mr-2" width="600" />
                                    ))}

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

export default UpdateBanner
