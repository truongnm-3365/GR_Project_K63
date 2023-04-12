import React, { Fragment, useState, useEffect } from 'react'

import MetaData from '../../components/layout/MetaData'

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { register, clearErrors } from '../../actions/userActions'
import { Link } from 'react-router-dom'

const Register = ({ history }) => {

    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
    })

    const { name, email, password } = user;
    

    const [avatar, setAvatar] = useState([])
    const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.jpg')

    const alert = useAlert();
    const dispatch = useDispatch();

    const { isAuthenticated, error, loading } = useSelector(state => state.auth);

    useEffect(() => {

        if (isAuthenticated) {
            history.push('/')
        }

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

    }, [dispatch, alert, isAuthenticated, error, history])

    const submitHandler = (e) => {
        e.preventDefault();
        let formData = new FormData();
        for (let key in avatar) {
            //formdata.append("videos", videos[key]);
            formData.append('avatar', avatar[key]);
        }
        
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        
        dispatch(register(formData))
    }

    const onChange = e => {

        if (e.target.name === 'avatar') {
            //setAvatarFile(e.target.files)
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result)
                    setAvatar(e.target.files)
                }
            }
            

            reader.readAsDataURL(e.target.files[0])

        } else {
            setUser({ ...user, [e.target.name]: e.target.value })
        }
    }

    return (
        <Fragment>

            <MetaData title={'Đăng ký tài khoản'} />

            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={submitHandler}>
                        <h1 className="mb-3">Đăng ký</h1>

                        <div className="form-group">
                            <label htmlFor="email_field">Tên</label>
                            <input
                                type="text"
                                id="name_field"
                                className="form-control"
                                name='name'
                                value={name}
                                onChange={onChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email_field">Email</label>
                            <input
                                type="email"
                                id="email_field"
                                className="form-control"
                                name='email'
                                value={email}
                                onChange={onChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password_field">Mật khẩu</label>
                            <input
                                type="password"
                                id="password_field"
                                className="form-control"
                                name='password'
                                value={password}
                                onChange={onChange}
                            />
                        </div>

                        <div className='form-group'>
                            <label htmlFor='avatar_upload'>Ảnh đại diện</label>
                            <div className='d-flex align-items-center'>
                                <div>
                                    <figure className='avatar mr-3 item-rtl'>
                                        <img
                                            src={avatarPreview}
                                            className='rounded-circle'
                                            alt='Avatar Preview'
                                        />
                                    </figure>
                                </div>
                                <div className='custom-file'>
                                    <input
                                        type='file'
                                        name='avatar'
                                        className='custom-file-input'
                                        id='avatar'
                                        accept=".png, .jpeg, .jpg"
                                        onChange={onChange}
                                        
                                    />
                                    <label className='custom-file-label' htmlFor='avatar'>
                                        Chọn ảnh đại diện
                                    </label>
                                </div>
                            </div>
                        </div>

                        <button
                            id="register_button"
                            type="submit"
                            className="btn btn-block py-3"
                            disabled={loading ? true : false}
                        >
                            ĐĂNG KÝ
                        </button>
                        <Link to="/login" className="float-right mt-3">Đã có tài khoản?</Link>
                    </form>
                </div>
            </div>

        </Fragment>
    )
}

export default Register
