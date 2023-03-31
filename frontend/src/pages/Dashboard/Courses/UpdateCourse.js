import React, { Fragment, useState, useEffect } from 'react'

import MetaData from '../../../components/layout/MetaData'
import Sidebar from '../Sidebar'

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { updateCourse, getCourseDetails, clearErrors } from '../../../actions/courseActions'
import { UPDATE_COURSE_RESET } from '../../../constants/courseConstants'
import moment from 'moment'
import { getCategories } from '../../../actions/categoryAction'
const UpdateCourse = ({ match, history }) => {

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [images, setImages] = useState([]);
    const [startDate,setStartDate] = useState('');
    const [endDate,setEndDate] = useState('');

    const [oldImages, setOldImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([])

    const alert = useAlert();
    const dispatch = useDispatch();

    const { categories } = useSelector(state => state.categories);
    const { error, course } = useSelector(state => state.courseDetails)
    const { loading, error: updateError, isUpdated } = useSelector(state => state.course);

    const courseId = match.params.id;

    console.log(course);
    useEffect(() => {
        dispatch(getCategories());
        dispatch(getCourseDetails(match.params.id));
        

        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }

        if (updateError) {
            alert.error(updateError);
            dispatch(clearErrors())
        }


        if (isUpdated) {
            history.push('/me/courses');
            alert.success('Cập nhật khóa học thành công');
            dispatch({ type: UPDATE_COURSE_RESET })
        }

    }, [dispatch, alert, error, isUpdated, history, updateError,match])


    const onChangeStartDate = e => {
        const newDate = moment(new Date(e.target.value)).format('YYYY-MM-DD');
        setStartDate(newDate);
        
      };

      
    const onChangeEndDate = e => {
        const newDate = moment(new Date(e.target.value)).format('YYYY-MM-DD');
        setEndDate(newDate);
        
      };

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name? name: course.details.name);
        formData.append('price',  price ? price: course.details.price);
        formData.append('description', description ? description : course.details.description);
        formData.append('category', category ? category : course.details.category);

        formData.append('startDate',startDate ? startDate : course.details.startDate);
        formData.append('endDate',endDate ? endDate : course.details.endDate);

        

        if(images.length > 0){
            for (let key in images) {
                formData.append("images", images[key]);
            }
            
        }

        // const data = {
        //     name: name? name: course.details.name,
        //     price: price ? price: course.details.price,
        //     description:  description ? description : course.details.description,
        //     category: category ? category : course.details.category,
        //     images:images.length > 0 ? images : course.details.images,
        //     startDate: startDate ? startDate : course.details.startDate,
        //     endDate: endDate ? endDate : course.details.endDate
        // }
        
        dispatch(updateCourse(course.details._id, formData))
    }

    //console.log(new Date(course.details.startDate).toJSON().slice(0,10).split('-').reverse().join('/'));

    const onChange = e => {

        const files = Array.from(e.target.files)
        
        setImagesPreview([]);
        setImages([])
        setOldImages([])
        
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
            <MetaData title={'Update Course'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <Fragment>
                        {course && course.details &&
                        <div className="wrapper my-5">
                            <form className="shadow-lg" onSubmit={submitHandler} encType='multipart/form-data'>
                                <h1 className="mb-4">Cập nhật khóa học</h1>

                                <div className="form-group">
                                    <label htmlFor="name_field">Tên</label>
                                    <input
                                        type="text"
                                        id="name_field"
                                        className="form-control"
                                        value={course.details.name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="price_field">Giá</label>
                                    <input
                                        type="text"
                                        id="price_field"
                                        className="form-control"
                                        value={course.details.price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="description_field">Mô tả</label>
                                    <textarea className="form-control" id="description_field" rows="8" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="category_field">Danh mục</label>
                                    <select className="form-control" id="category_field" defaultValue={course.details.category} onChange={(e) => setCategory(e.target.value)}>
                                        {categories && categories.map(category => (
                                            <option key={category._id} value={category.name} >{category.name}</option>
                                        ))}

                                    </select>
                                </div>

                                <div className='form-group'>
                                    <label htmlFor='startDate_field'>Ngày bắt đầu</label>
                                    <input
                                        type='date'
                                        id='startDate_field'
                                        className='form-control'
                                        defaultValue={course.details.startDate ? new Date(course.details.startDate).toISOString().substr(0, 10) :""}
                                        onChange={onChangeStartDate}
                                    />
                                </div>
                                <div className='form-group'>
                                    <label htmlFor='startDate_field'>Ngày kết thúc</label>
                                    <input
                                        type='date'
                                        id='endDate_field'
                                        className='form-control'
                                        defaultValue={course.details.endDate ? new Date(course.details.endDate).toISOString().substr(0, 10) : ""}
                                        onChange={onChangeEndDate}
                                    />
                                </div>

                                <div className='form-group'>
                                    <label>Ảnh</label>

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

                                    {course.details.images && course.details.images.map(img => (
                                        <img key={img} src={img.url} alt={img.url} className="mt-3 mr-2" width="55" height="52" />
                                    ))}

                                    {imagesPreview.map(img => (
                                        <img src={img} key={img} alt="Images Preview" className="mt-3 mr-2" width="55" height="52" />
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

export default UpdateCourse
