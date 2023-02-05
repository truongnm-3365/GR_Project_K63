import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension'

import { coursesReducer, newCourseReducer, courseReducer, courseDetailsReducer, newReviewReducer, courseReviewsReducer, reviewReducer, newLessonReducer, courseLessonsReducer, lessonReducer, courseLessonReducer, courseTopicReducer, courseTopicsReducer, newTopicReducer, newQuizReducer, topicQuizReducer, topicQuizsReducer, quizReducer } from './reducers/courseReducers'
import { notifiesReducer } from './reducers/notifyReducer';
import { authReducer, userReducer, forgotPasswordReducer, allUsersReducer, userDetailsReducer } from './reducers/userReducers'
import { cartReducer } from './reducers/cartReducers'
import { newOrderReducer, myOrdersReducer, orderDetailsReducer, allOrdersReducer, orderReducer } from './reducers/orderReducers'

const reducer = combineReducers({
    courses: coursesReducer,
    courseDetails: courseDetailsReducer,
    newCourse: newCourseReducer,
    course: courseReducer,
    courseReviews: courseReviewsReducer,
    review: reviewReducer,
    courseLessons: courseLessonsReducer,
    courseTopics: courseTopicsReducer,
    newTopic: newTopicReducer,
    topic: courseTopicReducer,
    newQuiz: newQuizReducer,
    quiz: topicQuizReducer,
    topicQuizs:topicQuizsReducer,
    lesson: lessonReducer,
    media: courseLessonReducer,
    auth: authReducer,
    user: userReducer,
    allUsers: allUsersReducer,
    userDetails: userDetailsReducer,
    forgotPassword: forgotPasswordReducer,
    cart: cartReducer,
    newOrder: newOrderReducer,
    myOrders: myOrdersReducer,
    allOrders: allOrdersReducer,
    orderDetails: orderDetailsReducer,
    order: orderReducer,
    newReview: newReviewReducer,
    newLesson: newLessonReducer,
    notifies: notifiesReducer
})


let initialState = {
    cart: {
        cartItems: localStorage.getItem('cartItems')
            ? JSON.parse(localStorage.getItem('cartItems'))
            : [],
        shippingInfo: localStorage.getItem('shippingInfo')
            ? JSON.parse(localStorage.getItem('shippingInfo'))
            : {}
    }
}

const middlware = [thunk];
const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middlware)))

export default store;