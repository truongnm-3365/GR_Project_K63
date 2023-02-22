import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Header from './components/layout/Header'
import Footer from './components/layout/Footer'

import Home from './pages/Home/Home'
import CourseDetails from './pages/Course/CourseDetails'

// Cart Imports
import RegisterCourseList from './pages/RegisterCourse/RegisterCourseList'
import Cart from './components/cart/Cart'
import Shipping from './components/cart/Shipping'
import ConfirmOrder from './components/cart/ConfirmOrder'
import Payment from './components/cart/Payment'
import OrderSuccess from './components/cart/OrderSuccess'

// Order Imports
import ListOrders from './components/order/ListOrders'
import OrderDetails from './components/order/OrderDetails'

// Auth or User imports
import Login from './pages/User/Login'
import Register from './pages/User/Register'
import Profile from './pages/User/Profile'
import UpdateProfile from './pages/User/UpdateProfile'
import UpdatePassword from './pages/User/UpdatePassword'
import ForgotPassword from './pages/User/ForgotPassword'
import NewPassword from './pages/User/NewPassword'

// Admin Imports
import Dashboard from './pages/Dashboard/Dashboard'
import CoursesList from './pages/Dashboard/CoursesList'
import NewCourse from './pages/Dashboard/NewCourse'
import UpdateCourse from './pages/Dashboard/UpdateCourse'
import OrdersList from './pages/Dashboard/OrdersList'
import ProcessOrder from './pages/Dashboard/ProcessOrder'
import UsersList from './pages/Dashboard/UsersList'
import UpdateUser from './pages/Dashboard/UpdateUser'
import CourseReviews from './pages/Dashboard/CourseReviews'
import NewLesson from './pages/Dashboard/NewLesson'
import Lessons from './pages/Course/Lesson'
import ProtectedRoute from './components/route/ProtectedRoute'
import { loadUser } from './actions/userActions'
import { useSelector } from 'react-redux'
import store from './store'
import axios from 'axios'

// Payment
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import NewTopic from './pages/Dashboard/NewTopic'
import NewQuiz from './pages/Dashboard/NewQuiz'
import NewDocument from './pages/Dashboard/NewDocument'

function App() {

  const [stripeApiKey, setStripeApiKey] = useState('');

  useEffect(() => {
    store.dispatch(loadUser())

    async function getStripApiKey() {
      const { data } = await axios.get('/api/v1/stripeapi');

      setStripeApiKey(data.stripeApiKey)
    }

    getStripApiKey();

  }, [])

  const { user, isAuthenticated, loading } = useSelector(state => state.auth)

  

  return (
    <Router>
      <div className="App">
        <Header />
        <div className="container container-fluid">
          <Route path="/" component={Home} exact />
          <Route path="/search/:keyword" component={Home} />
          <Route path="/course/:id" component={CourseDetails} exact />
          <Route path="/course/:id/lessons"  component={Lessons} exact/>
          <Route path="/registerCourse" component={RegisterCourseList} exact />
          <ProtectedRoute path="/shipping" component={Shipping} />
          <ProtectedRoute path="/confirm" component={ConfirmOrder} exact />
          <ProtectedRoute path="/success" component={OrderSuccess} />
          {stripeApiKey &&
            <Elements stripe={loadStripe(stripeApiKey)}>
              <ProtectedRoute path="/payment" component={Payment} />
            </Elements>
          }

          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/password/forgot" component={ForgotPassword} exact />
          <Route path="/password/reset/:token" component={NewPassword} exact />
          <ProtectedRoute path="/me" component={Profile} exact />
          <ProtectedRoute path="/me/update" component={UpdateProfile} exact />
          <ProtectedRoute path="/password/update" component={UpdatePassword} exact />

          <ProtectedRoute path="/orders/me" component={ListOrders} exact />
          <ProtectedRoute path="/order/:id" component={OrderDetails} exact />
        </div>

        <ProtectedRoute path="/admin/courses" isAdmin={true} component={Dashboard} exact />
        <ProtectedRoute path="/me/courses" isAdmin={false} component={CoursesList} exact />
        <ProtectedRoute path="/me/course" isAdmin={false} component={NewCourse} exact />
        <ProtectedRoute path="/me/course/:id" isAdmin={false} component={UpdateCourse} exact />
        <ProtectedRoute path="/me/course/:id/lessons" isAdmin={false} component={NewLesson} exact />
        <ProtectedRoute path="/me/course/:id/documents" isAdmin={false} component={NewDocument} exact />
        <ProtectedRoute path="/me/course/:id/topics" isAdmin={false} component={NewTopic} exact />
        <ProtectedRoute path="/me/topic/:id/quizs" isAdmin={false} component={NewQuiz} exact />
        <ProtectedRoute path="/admin/orders" isAdmin={true} component={OrdersList} exact />
        <ProtectedRoute path="/admin/order/:id" isAdmin={true} component={ProcessOrder} exact />
        <ProtectedRoute path="/admin/users" isAdmin={true} component={UsersList} exact />
        <ProtectedRoute path="/admin/user/:id" isAdmin={true} component={UpdateUser} exact />
        <ProtectedRoute path="/admin/reviews" isAdmin={true} component={CourseReviews} exact />

        {!loading && (!isAuthenticated || user.role !== 'admin') && (
          <Footer />
        )}
      </div>
    </Router>
  );
}

export default App;
