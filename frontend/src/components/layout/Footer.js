import React, { Fragment, useEffect } from 'react'
import './index.css'
import { getCategories } from '../../actions/categoryAction'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
const Footer = () => {
    const dispatch = useDispatch();

    const { categories } = useSelector(state => state.categories);
    const { user, loading } = useSelector(state => state.auth)

    useEffect(() => {
        dispatch(getCategories())
    },[dispatch])

    return (
        <Fragment>

            <div className="footer-bottom-area bg-dark-light section-padding-sm" style={{position:'relative', marginTop:'40px'}}>
                <div className="container py-3">
                    <div className="row widgets footer-widgets">

                        <div className="col-lg-3 col-md-6 col-12 my-1">
                            <div className="single-widget widget-about">
                                <h5 className="widget-title">Onraincoosu</h5>
                                <img style={{width: '60px', marginBottom:'20px'}} src="/images/logo.png" alt="Logo trang web"/>
                                <p>Bạn sẽ có một trải nghiệm học tập vô cùng tuyệt vời và <Link to="/about">Đọc thêm...</Link></p>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6 col-12 my-1">
                            <div className="single-widget widget-quick-links">
                                <h5 className="widget-title">Tài khoản của tôi</h5>
                                <ul>
                                {user && user.role === 'admin' && (
                                    <li><Link to="/me/courses">Dashboard</Link></li>
                                )}
                                {user && user.role === 'user' && (
                                    <li><Link to="/me/courses">Khóa học của tôi</Link></li>
                                )}
                                <li><Link to="/registerCourse" >Khóa học đã đăng ký</Link></li>
                                <li><Link to="/me">Thông tin cá nhân</Link></li>
                                </ul>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6 col-12 my-1">
                            <div className="single-widget widget-quick-links">
                                <h5 className="widget-title">Danh mục các khóa học</h5>
                                <ul>
                                    {categories && categories.map((category) => (
                                        <li><Link key={category._id}  to={`/search?keyword=&&category=${category.name}`} >{category.name}</Link></li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6 col-12 my-1">
                            <div className="single-widget widget-contact">
                                <h5 className="widget-title">Liên hệ với chúng tôi</h5>
                                <ul>
                                    <li className="address">
                                        <span className="icon"><i className="fa fa-map-marker"></i></span>
                                        <p>Địa chỉ : 232 phố Kẻ Vẽ, phường Thụy Phương, quận Bắc Từ Liêm, Hà Nội.</p>
                                    </li>
                                    <li className="phone">
                                        <span className="icon"><i className="fa fa-phone"></i></span>
                                        <p><a href="#">+840123456789</a></p>
                                    </li>
                                    <li className="fax">
                                        <span className="icon"><i className="fa fa-fax"></i></span>
                                        <p><a href="#">+840123456789</a></p>
                                    </li>
                                    <li className="email">
                                        <span className="icon"><i className="fa fa-envelope-o"></i></span>
                                        <p><a href="#">onraincoosu@gmail.com</a></p>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </Fragment>
    )

}
export default Footer
