import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension'

import { coursesReducer, newCourseReducer, courseReducer, courseDetailsReducer, newReviewReducer, 
        courseReviewsReducer, reviewReducer, newLessonReducer, courseLessonsReducer, lessonReducer, 
        courseLessonReducer, courseTopicReducer, courseTopicsReducer, newTopicReducer, newQuizReducer, 
        topicQuizReducer, topicQuizsReducer, newDocumentReducer, courseDocumentsReducer, documentReducer, 
        regularCoursesReducer, newNoteReducer, noteReducer, notesReducer } 

        from './reducers/courseReducers'
import { notifiesReducer } from './reducers/notifyReducer';
import { authReducer, userReducer, forgotPasswordReducer, allUsersReducer, userDetailsReducer, profileReducer } from './reducers/userReducers'
import { cartReducer } from './reducers/cartReducers'
import { newOrderReducer, myOrdersReducer, orderDetailsReducer, allOrdersReducer, orderReducer } from './reducers/orderReducers'
import { newRegisterCourseReducer, RegisterCourseReducer, registerCoursesReducer } from './reducers/registerCourseReducer';
import { categoriesReducer, categoryDetailsReducer, categoryReducer, newCategoryReducer } from './reducers/categoryReducer';
import { bannerDetailsReducer, bannerReducer, bannersReducer, newBannerReducer } from './reducers/bannerReducer';
import questionsReducer, { questionReducer } from './reducers/questionReducer';
import { accessChatReducer, chatsReducer, messagesReducer, searchChatReducer, selectedChatReducer, sendMessagesReducer } from './reducers/chatReducer';


const reducer = combineReducers({
    courses: coursesReducer,
    regularCourses: regularCoursesReducer,
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
    newDoc: newDocumentReducer,
    docs: courseDocumentsReducer,
    doc:documentReducer,
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
    notifies: notifiesReducer,
    registerCourse: RegisterCourseReducer,
    registerCourses: registerCoursesReducer,
    newRegisterCourse: newRegisterCourseReducer,
    categories: categoriesReducer,
    newCategory: newCategoryReducer,
    category: categoryReducer,
    categoryDetails: categoryDetailsReducer,
    banners: bannersReducer,
    newBanner: newBannerReducer,
    banner: bannerReducer,
    bannerDetails: bannerDetailsReducer,
    profile: profileReducer,
    questionsReducer: questionsReducer,
    question: questionReducer,
    newNote: newNoteReducer,
    note: noteReducer,
    notes:notesReducer,
    chats:chatsReducer,
    messages:messagesReducer,
    newMessage: sendMessagesReducer,
    accessChat: accessChatReducer,
    searchChat: searchChatReducer,
    selectedChat: selectedChatReducer
})


let initialState = {

}

const middlware = [thunk];
const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middlware)))

export default store;