import React, { Fragment, useState, useEffect } from 'react'

import MetaData from '../../../components/layout/MetaData'
import Sidebar from '../Sidebar'

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { updateCourse, getCourseDetails, clearErrors } from '../../../actions/courseActions'
import { COURSE_DETAILS_RESET, UPDATE_COURSE_RESET } from '../../../constants/courseConstants'
import moment from 'moment'
import { getCategories } from '../../../actions/categoryAction'
import { Select } from 'antd'
import Editor from '../../../components/editor/Editor'
const UpdateCourse = ({ match, history }) => {

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [images, setImages] = useState([]);
    const [timeLimitFinalExam,setTimeLimitFinalExam] = useState(0);
    const [timeLimit,setTimeLimit] = useState(0);

    const [oldImages, setOldImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([])

    const alert = useAlert();
    const dispatch = useDispatch();

    const { categories } = useSelector(state => state.categories);
    const { error, course } = useSelector(state => state.courseDetails)
    const { loading, error: updateError, isUpdated } = useSelector(state => state.course);


    useEffect(() => {
        dispatch({type: COURSE_DETAILS_RESET})
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

    }, [dispatch, alert, error, isUpdated, history, updateError, match.params.id])



    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name? name: course.details.name);
        formData.append('price',  price ? price: course.details.price);
        formData.append('description', description ? description : course.details.description);
        formData.append('category', category ? category : course.details.category);

        // formData.append('startDate',startDate ? startDate : course.details.startDate);
        // formData.append('endDate',endDate ? endDate : course.details.endDate);
        formData.append('timeLimitFinalExam',timeLimitFinalExam ? timeLimitFinalExam : course.details.timeLimitFinalExam);
        formData.append('timeLimit',timeLimit ? timeLimit : course.details.timeLimit);

        

        if(images.length > 0){
            for (let key in images) {
                formData.append("images", images[key]);
            }
            
        }
        
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
                                        className="form-control form-control-sm"
                                        defaultValue={course.details.name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="price_field">Giá</label>
                                    <input
                                        type="number"
                                        id="price_field"
                                        className="form-control form-control-sm"
                                        defaultValue={course.details.price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </div>

                           
                                <div className="form-group">
                                    <label htmlFor="description_field">Mô tả</label>
                                    <Editor value={course.details.description} onChange={setDescription} />
                                    {/* <textarea className="form-control form-control-sm" id="description_field" rows="8" value={description} onChange={(e) => setDescription(e.target.value)}></textarea> */}
                                </div>

                                <div className="form-group">
                                    <label >Danh mục</label>
                                    <Select
                                        defaultValue={course.details.category}
                                        style={{width:'100%'}} 
                                        showSearch 
                                        placeholder='Chọn danh mục'
                                        onChange={(value) => setCategory(value)}
                                        filterOption={(input, option) =>
                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                        }
                                        options= {categories && categories.map(category => {
                                            return { value:category.name, label: category.name }
                                        })}
                                    >      
                                    </Select>

                                </div>

                                <div className="form-group">
                                    <label htmlFor="exam_field">Thời gian bài kiểm tra cuối khóa (phút)</label>
                                    <input
                                        type="number"
                                        id="exam_field"
                                        className="form-control form-control-sm"
                                        defaultValue={course.details.timeLimitFinalExam}
                                        onChange={(e) => setTimeLimitFinalExam(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="time_field">Thời hạn khóa học (tháng)</label>
                                    <input
                                        step="any"
                                        type="number"
                                        id="time_field"
                                        className="form-control form-control-sm"
                                        defaultValue={course.details.timeLimit}
                                        onChange={(e) => setTimeLimit(e.target.value)}
                                    />
                                </div>

                                {/* <div className='form-group'>
                                    <label htmlFor='startDate_field'>Ngày bắt đầu</label>
                                    <input
                                        type='date'
                                        id='startDate_field'
                                        className='form-control form-control-sm'
                                        defaultValue={course.details.startDate ? new Date(course.details.startDate).toISOString().substr(0, 10) :""}
                                        onChange={onChangeStartDate}
                                    />
                                </div>
                                <div className='form-group'>
                                    <label htmlFor='startDate_field'>Ngày kết thúc</label>
                                    <input
                                        type='date'
                                        id='endDate_field'
                                        className='form-control form-control-sm'
                                        defaultValue={course.details.endDate ? new Date(course.details.endDate).toISOString().substr(0, 10) : ""}
                                        onChange={onChangeEndDate}
                                    />
                                </div> */}

                                <div className='form-group'>
                                    <label htmlFor="customFile">Ảnh</label>

                                    
                                    <input
                                        type='file'
                                        name='images'
                                        className='form-control-file'
                                        id='customFile'
                                        onChange={onChange}
                                        accept='.png ,.jpg ,.jpeg'
                                    />

                                   

                                    {course.details.images && course.details.images.map(img => (
                                        <img key={img} src={process.env.REACT_APP_API_URL + img.url} alt={img.url} className="mt-3 mr-2" width="55" height="52" />
                                    ))}

                                    {imagesPreview.map(img => (
                                        <img src={img} key={process.env.REACT_APP_API_URL + img} alt="Images Preview" className="mt-3 mr-2" width="55" height="52" />
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
