import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Header from './components/layout/Header'
import Footer from './components/layout/Footer'

import Home from './pages/Home/Home'
import CourseDetails from './pages/Course/CourseDetails'


import RegisterCourseList from './pages/RegisterCourse/RegisterCourseList'
import Payment from './pages/Payment/Payment'
import OrderSuccess from './components/payment/OrderSuccess'


import Login from './pages/User/Login'
import Register from './pages/User/Register'
import Profile from './pages/User/Profile'
import UpdateProfile from './pages/User/UpdateProfile'
import UpdatePassword from './pages/User/UpdatePassword'
import ForgotPassword from './pages/User/ForgotPassword'
import NewPassword from './pages/User/NewPassword'

import Dashboard from './pages/Dashboard/Dashboard'
import CoursesList from './pages/Dashboard/Courses/CoursesList'
import NewCourse from './pages/Dashboard/Courses/NewCourse'
import UpdateCourse from './pages/Dashboard/Courses/UpdateCourse'
import OrdersList from './pages/Dashboard/OrdersList'
import ProcessOrder from './pages/Dashboard/ProcessOrder'
import UsersList from './pages/Dashboard/Users/UsersList'
import UpdateUser from './pages/Dashboard/Users/UpdateUser'
import CourseReviews from './pages/Dashboard/CourseReview/CourseReviews'
import NewLesson from './pages/Dashboard/Courses/Lesson/NewLesson'
import Lessons from './pages/Course/Lesson'
import ProtectedRoute from './components/route/ProtectedRoute'
import { loadUser } from './actions/userActions'
import store from './store'
import axios from 'axios'

import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import NewTopic from './pages/Dashboard/Courses/Topic/NewTopic'
import NewQuiz from './pages/Dashboard/Courses/Quiz/NewQuiz'
import NewDocument from './pages/Dashboard/Courses/Document/NewDocument'
import CategoryList from './pages/Dashboard/Category/CategoryList'
import NewCategory from './pages/Dashboard/Category/NewCategory'
import UpdateCategory from './pages/Dashboard/Category/UpdateCategory'
import BannerList from './pages/Dashboard/Banner/BannerList'
import NewBanner from './pages/Dashboard/Banner/NewBanner'
import UpdateBanner from './pages/Dashboard/Banner/UpdateBanner'
import Search from './pages/Search/Search'
import Chatpage from "./pages/Chat/Chatpage";
import ChatBot from './pages/ChatBot/ChatBot'
import About from './pages/About/About'


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

  

  return (
    <Router>
      <div className="App">
        <Header />
        <div className="">
          <Route path="/" component={Home} exact />
          <Route path="/chats" component={Chatpage} />
          <Route path="/about" component={About}/>
          <Route path="/chatbot" component={ChatBot} />
          <Route path="/search" component={Search} exact />
          <Route path="/course/:id" component={CourseDetails} exact />
          <Route path="/course/:id/lessons"  component={Lessons} exact/>
          <Route path="/registerCourse" component={RegisterCourseList} exact />
        
          <ProtectedRoute path="/success/:courseId" component={OrderSuccess} />
          {stripeApiKey &&
            <Elements stripe={loadStripe(stripeApiKey)}>
              <ProtectedRoute path="/payment/:courseId/:amount" component={Payment} />
            </Elements>
          } 

          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/password/forgot" component={ForgotPassword} exact />
          <Route path="/password/reset/:token" component={NewPassword} exact />
          <ProtectedRoute path="/me" component={Profile} exact />
          <ProtectedRoute path="/profile/:id" component={Profile} exact />
          <ProtectedRoute path="/me/update" component={UpdateProfile} exact />
          <ProtectedRoute path="/password/update" component={UpdatePassword} exact />
          
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
        <ProtectedRoute path="/admin/categories" isAdmin={false} component={CategoryList} exact />
        <ProtectedRoute path="/admin/category/new" isAdmin={false} component={NewCategory} exact />
        <ProtectedRoute path="/admin/category/update/:id" isAdmin={false} component={UpdateCategory} exact />
        <ProtectedRoute path="/admin/banners" isAdmin={false} component={BannerList} exact />
        <ProtectedRoute path="/admin/banner/new" isAdmin={false} component={NewBanner} exact />
        <ProtectedRoute path="/admin/banner/update/:id" isAdmin={false} component={UpdateBanner} exact />

       
        <Footer />
        
      </div>
    </Router>
  );
}

export default App;
