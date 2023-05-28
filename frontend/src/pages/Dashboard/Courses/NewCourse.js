import React, { Fragment, useState, useEffect } from 'react'

import MetaData from '../../../components/layout/MetaData'
import Sidebar from '../Sidebar'

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { newCourse, clearErrors } from '../../../actions/courseActions'
import { NEW_COURSE_RESET } from '../../../constants/courseConstants'

import { getCategories } from '../../../actions/categoryAction'
import { Select } from 'antd'
import Editor from '../../../components/editor/Editor'


const NewCourse = ({ history }) => {

    const { categories } = useSelector(state => state.categories);
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Công nghệ thông tin');
    const [images, setImages] = useState([]);
    const [startDate,setStartDate] = useState('');
    const [endDate,setEndDate] = useState('');
    const [timeLimitFinalExam,setTimeLimitFinalExam] = useState(0);
    const [timeLimit,setTimeLimit] = useState(0);
   
    const [imagesPreview, setImagesPreview] = useState([])

    // const categories = [
    //     'Công nghệ thông tin',
    //     'Ngoại ngữ'
    // ]

    const alert = useAlert();
    const dispatch = useDispatch();

    const { loading, error, success } = useSelector(state => state.newCourse);

    useEffect(() => {
        dispatch(getCategories());

        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }

        if (success) {
            history.push('/me/courses');
            alert.success('Tạo khóa học thành công');
            dispatch({ type: NEW_COURSE_RESET })
        }

    }, [dispatch, alert, error, success, history])

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('description', description);
        formData.append('category', category);
        // formData.append('startDate',startDate);
        // formData.append('endDate',endDate);
        formData.append('timeLimitFinalExam',timeLimitFinalExam)
        formData.append('timeLimit',timeLimit)
        for (let key in images) {
            formData.append("images", images[key]);
        }

        console.log(images)
        const data = {name,price,description,category,images,endDate,startDate}

        //console.log(images)
        

        if(name && price && description && category && images &&  timeLimit){
            
            dispatch(newCourse(formData))
        }else{
            alert.error('Thông tin khóa học bị thiếu');
        }
            
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
            <MetaData title={'Khóa học mới'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <Fragment>
                        <div className="wrapper my-5">
                            <form className="shadow-lg" onSubmit={submitHandler} encType='multipart/form-data'>
                                <h1 className="mb-4">Khóa học mới</h1>

                                <div className="form-group">
                                    <label htmlFor="name_field">Tên</label>
                                    <input
                                        type="text"
                                        id="name_field"
                                        className="form-control form-control-sm"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="price_field">Giá</label>
                                    <input
                                        type="number"
                                        id="price_field"
                                        className="form-control form-control-sm"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="description_field">Mô tả</label>
                                    <Editor value={description} onChange={setDescription} />
                                    {/* <textarea className="form-control form-control-sm" id="description_field" rows="8" value={description} onChange={(e) => setDescription(e.target.value)}></textarea> */}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="category_field">Danh mục</label>
                                    <Select
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
                                        value={timeLimitFinalExam}
                                        onChange={(e) => setTimeLimitFinalExam(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="time_field">Thời hạn khóa học (tháng)</label>
                                    <input
                                        type="number"
                                        id="time_field"
                                        className="form-control form-control-sm"
                                        value={timeLimit}
                                        onChange={(e) => setTimeLimit(e.target.value)}
                                    />
                                </div>



                                <div className='form-group'>
                                    <label htmlFor='customFile'>Ảnh đại diện</label>

                                    
                                        <input
                                            type='file'
                                            name='images'
                                            className='form-control-file'
                                            id='customFile'
                                            onChange={onChange}
                                            accept=".png, .jpeg, .jpg"
                                        />

                                    

                                    {console.log(imagesPreview)}    

                                    {imagesPreview.map(img => (
                                        <img src={img} key={img} alt="Images Preview" className="mt-3 mr-2" width="55" height="52" />
                                    ))}

                                </div>



                                <button
                                   
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

export default NewCourse
