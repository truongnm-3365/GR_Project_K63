import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
const Sidebar = () => {
    const { user } = useSelector(state => state.auth)
    return (
        <div className="sidebar-wrapper">
            <nav id="sidebar">
                <ul className="list-unstyled components">
                    {/* {user && user.role === 'admin' &&
                    <li>
                        <Link to="/dashboard"><i className="fa fa-tachometer"></i> Dashboard</Link>
                    </li>
                    } */}
                     {user && user.role !== 'admin' ?
                    <li>
                        <a href="#courseSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle"><i
                            className="fa fa-graduation-cap"></i> Các khóa học</a>
                        <ul className="collapse list-unstyled" id="courseSubmenu">
                            <li>
                                <Link to="/me/courses"><i className="fa fa-clipboard"></i> Tất cả</Link>
                            </li>

                            <li>
                                <Link to="/me/course"><i className="fa fa-plus"></i> Tạo mới</Link>
                            </li>
                        </ul>
                    </li>
                    :
                    <li>
                        <Link to="/me/courses"><i className="fa fa-users"></i> Tất cả các khóa học</Link>
                    </li>                    
                    }
                    {user && user.role === 'admin' && (<>
                    <li>
                        <Link to="/admin/users"><i className="fa fa-users"></i>  Người dùng</Link>
                    </li>

                    <li>
                        <Link to="/admin/reviews"><i className="fa fa-star"></i>  Đánh giá</Link>
                    </li>

                    <li>
                        <a href="#categorySubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">
                            <i className="fa fa-list"></i> Các thể loại</a>
                        <ul className="collapse list-unstyled" id="categorySubmenu">
                            <li>
                                <Link to="/admin/categories"><i className="fa fa-clipboard"></i> Tất cả</Link>
                            </li>

                            <li>
                                <Link to="/admin/category/new"><i className="fa fa-plus"></i> Tạo mới</Link>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="#bannerSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">
                            <i className="fa fa-picture-o"></i> Banner</a>
                        <ul className="collapse list-unstyled" id="bannerSubmenu">
                            <li>
                                <Link to="/admin/banners"><i className="fa fa-clipboard"></i> Tất cả</Link>
                            </li>

                            <li>
                                <Link to="/admin/banner/new"><i className="fa fa-plus"></i> Tạo mới</Link>
                            </li>
                        </ul>
                    </li>
                    </>)
                    }

                </ul>
            </nav>
        </div>
    )
}

export default Sidebar
