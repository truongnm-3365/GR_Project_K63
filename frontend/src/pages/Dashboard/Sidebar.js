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
                    {/* {user && user.role === 'admin' && (<>
                    <li>
                        <Link to="/admin/orders"><i className="fa fa-shopping-basket"></i> Orders</Link>
                    </li>
                    
                    <li>
                        <Link to="/admin/users"><i className="fa fa-users"></i> Users</Link>
                    </li>

                    <li>
                        <Link to="/admin/reviews"><i className="fa fa-star"></i> Reviews</Link>
                    </li>
                    </>)
                    } */}

                </ul>
            </nav>
        </div>
    )
}

export default Sidebar
