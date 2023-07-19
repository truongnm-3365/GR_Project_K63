import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'


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

import CoursesList from './pages/Dashboard/Courses/CoursesList'
import NewCourse from './pages/Dashboard/Courses/NewCourse'
import UpdateCourse from './pages/Dashboard/Courses/UpdateCourse'
import UsersList from './pages/Dashboard/Users/UsersList'
import UpdateUser from './pages/Dashboard/Users/UpdateUser'
import CourseReviews from './pages/Dashboard/CourseReview/CourseReviews'
import NewLesson from './pages/Dashboard/Courses/Lesson/NewLesson'
import Lessons from './pages/Course/Lesson'
import ProtectedRoute from './components/route/ProtectedRoute'
import { loadUser } from './actions/userActions'
import axios from '../src/axios/axios'

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
import FinalTest from './pages/FinalTest/FinalTest'
import FinalResult from './pages/FinalTest/FinalResult'
import { useDispatch, useSelector } from 'react-redux'
import Forum from './pages/Forum/Mainbar/ForumMainbar'

import DisplayQuestion from './pages/Forum/Question/DisplayQuestion'
import AskQuestion from './pages/Forum/AskQuestion/AskQuestion'
import PageNotFound from './pages/PageNotFound/PageNotFound'
import setAuthToken from './axios/setAuthToken'
import WishList from './pages/WishList/WishList'


function App() {

  const dispatch = useDispatch()
  const [stripeApiKey, setStripeApiKey] = useState('');



  useEffect(() => {

    if(localStorage.getItem("token")){
      setAuthToken(localStorage.getItem("token"));
      dispatch(loadUser())
      async function getStripApiKey() {
        const { data } = await axios.get('/api/v1/stripeapi');
  
        setStripeApiKey(data.stripeApiKey)
      }
  
      getStripApiKey();  

    }
  


  }, [])

  

  return (
    <Router>
     
      <div className="App">
        <Header />
 
        <Route path="/" component={Home} exact />
          <Route path="/chats" component={Chatpage} />
          <Route path="/about" component={About}/>
          <Route path="/chatbot" component={ChatBot} />
          <Route path="/search" component={Search} exact />
          <Route path="/course/:id" component={CourseDetails} exact />
          <ProtectedRoute path="/course/:id/lessons"  component={Lessons} exact/>
          
          <ProtectedRoute path="/course/:id/finalexam/:examId"  component={FinalTest} exact/>
          <ProtectedRoute path="/course/:id/finalexam/:examId/result"  component={FinalResult} exact/>
          <ProtectedRoute path="/registerCourse" component={RegisterCourseList} exact />
          <ProtectedRoute path="/wishList" component={WishList} exact />
          
          
          <ProtectedRoute path="/success/:courseId" component={OrderSuccess} exact/>
          {stripeApiKey &&
            <Elements stripe={loadStripe(stripeApiKey)}>
              <ProtectedRoute path="/payment/:courseId/:amount" component={Payment} exact/>
            </Elements>
          }
           

          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/password/forgot" component={ForgotPassword} exact />
          <Route path="/password/reset/:token" component={NewPassword} exact />
          <ProtectedRoute path="/me" component={Profile} exact />
          <Route path="/profile/:id" component={Profile} exact />
          <ProtectedRoute path="/me/update" component={UpdateProfile} exact />
          <ProtectedRoute path="/password/update" component={UpdatePassword} exact />
          
          <ProtectedRoute path="/me/courses" isAdmin={false} component={CoursesList} exact />
          <ProtectedRoute path="/me/course" isAdmin={false} component={NewCourse} exact />
          <ProtectedRoute path="/me/course/:id" isAdmin={false} component={UpdateCourse} exact />
          <ProtectedRoute path="/me/course/:id/lessons" isAdmin={false} component={NewLesson} exact />
          <ProtectedRoute path="/me/course/:id/documents" isAdmin={false} component={NewDocument} exact />
          <ProtectedRoute path="/me/course/:id/topics" isAdmin={false} component={NewTopic} exact />
          <ProtectedRoute path="/me/topic/:id/quizs" isAdmin={false} component={NewQuiz} exact />
          <ProtectedRoute path="/admin/users" isAdmin={true} component={UsersList} exact />
          <ProtectedRoute path="/admin/user/:id" isAdmin={true} component={UpdateUser} exact />
          <ProtectedRoute path="/admin/reviews" isAdmin={true} component={CourseReviews} exact />
          <ProtectedRoute path="/admin/categories" isAdmin={false} component={CategoryList} exact />
          <ProtectedRoute path="/admin/category/new" isAdmin={false} component={NewCategory} exact />
          <ProtectedRoute path="/admin/category/update/:id" isAdmin={false} component={UpdateCategory} exact />
          <ProtectedRoute path="/admin/banners" isAdmin={false} component={BannerList} exact />
          <ProtectedRoute path="/admin/banner/new" isAdmin={false} component={NewBanner} exact />
          <ProtectedRoute path="/admin/banner/update/:id" isAdmin={false} component={UpdateBanner} exact />

          <ProtectedRoute path="/forum" component={Forum} exact/>
          <ProtectedRoute path="/forum/ask" component={AskQuestion} exact />
          <ProtectedRoute path="/forum/questions/:id" component={DisplayQuestion} exact/>

      
       
        <Footer />
        
      </div>
      
    </Router>
  );
}

export default App;
