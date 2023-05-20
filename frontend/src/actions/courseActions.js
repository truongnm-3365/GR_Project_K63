import axios from '../../src/axios/axios'

import {
    ALL_COURSES_REQUEST,
    ALL_COURSES_SUCCESS,
    ALL_COURSES_FAIL,
    ADMIN_COURSES_REQUEST,
    ADMIN_COURSES_SUCCESS,
    ADMIN_COURSES_FAIL,
    NEW_COURSE_REQUEST,
    NEW_COURSE_SUCCESS,
    NEW_COURSE_FAIL,
    DELETE_COURSE_REQUEST,
    DELETE_COURSE_SUCCESS,
    DELETE_COURSE_FAIL,
    UPDATE_COURSE_REQUEST,
    UPDATE_COURSE_SUCCESS,
    UPDATE_COURSE_FAIL,
    COURSE_DETAILS_REQUEST,
    COURSE_DETAILS_SUCCESS,
    COURSE_DETAILS_FAIL,
    NEW_LESSON_REQUEST,
    NEW_LESSON_SUCCESS,
    NEW_LESSON_FAIL,
    GET_LESSONS_REQUEST,
    GET_LESSONS_SUCCESS,
    GET_LESSONS_FAIL,
    GET_LESSON_REQUEST,
    GET_LESSON_SUCCESS,
    GET_LESSON_FAIL,
    DELETE_LESSON_REQUEST,
    DELETE_LESSON_SUCCESS,
    DELETE_LESSON_RESET,
    DELETE_LESSON_FAIL,
    NEW_REVIEW_REQUEST,
    NEW_REVIEW_SUCCESS,
    NEW_REVIEW_FAIL,
    GET_REVIEWS_REQUEST,
    GET_REVIEWS_SUCCESS,
    GET_REVIEWS_FAIL,
    DELETE_REVIEW_REQUEST,
    DELETE_REVIEW_SUCCESS,
    DELETE_REVIEW_RESET,
    DELETE_REVIEW_FAIL,
    NEW_TOPIC_REQUEST,
    NEW_TOPIC_SUCCESS,
    NEW_TOPIC_RESET,
    NEW_TOPIC_FAIL,
    GET_TOPICS_REQUEST,
    GET_TOPICS_SUCCESS,
    GET_TOPICS_FAIL,

    DELETE_TOPIC_REQUEST,
    DELETE_TOPIC_SUCCESS,
    DELETE_TOPIC_RESET,
    DELETE_TOPIC_FAIL,
    UPDATE_TOPIC_REQUEST,
    UPDATE_TOPIC_SUCCESS,
    UPDATE_TOPIC_RESET,
    UPDATE_TOPIC_FAIL,

    NEW_QUIZ_REQUEST,
    NEW_QUIZ_SUCCESS,
    NEW_QUIZ_RESET,
    NEW_QUIZ_FAIL,
    GET_QUIZS_REQUEST,
    GET_QUIZS_SUCCESS,
    GET_QUIZS_FAIL,
    DELETE_QUIZ_REQUEST,
    DELETE_QUIZ_SUCCESS,
    DELETE_QUIZ_RESET,
    DELETE_QUIZ_FAIL,
    UPDATE_QUIZ_REQUEST,
    UPDATE_QUIZ_SUCCESS,
    UPDATE_QUIZ_RESET,
    UPDATE_QUIZ_FAIL,

    NEW_DOCUMENT_REQUEST,
    NEW_DOCUMENT_SUCCESS,
    NEW_DOCUMENT_FAIL,
    GET_DOCUMENTS_REQUEST,
    GET_DOCUMENTS_SUCCESS,
    GET_DOCUMENTS_FAIL,
    GET_DOCUMENT_REQUEST,
    GET_DOCUMENT_SUCCESS,
    GET_DOCUMENT_FAIL,
    DELETE_DOCUMENT_REQUEST,
    DELETE_DOCUMENT_SUCCESS,
    DELETE_DOCUMENT_RESET,
    DELETE_DOCUMENT_FAIL,
    CLEAR_ERRORS,
    REGULAR_COURSES_REQUEST,
    REGULAR_COURSES_SUCCESS,
    REGULAR_COURSES_FAIL,
    NEW_NOTE_REQUEST,
    NEW_NOTE_SUCCESS,
    NEW_NOTE_FAIL,
    GET_NOTES_REQUEST,
    GET_NOTES_SUCCESS,
    GET_NOTES_FAIL,
    DELETE_NOTE_REQUEST,
    DELETE_NOTE_SUCCESS,
    DELETE_NOTE_FAIL,
    UPDATE_NOTE_REQUEST,
    UPDATE_NOTE_SUCCESS,
    UPDATE_NOTE_FAIL,
    MY_COURSES_REQUEST,
    MY_COURSES_SUCCESS,
    MY_COURSES_FAIL,
    CREATOR_COURSES_REQUEST,
    CREATOR_COURSES_SUCCESS,
    CREATOR_COURSES_FAIL,
    UPDATE_LESSON_REQUEST,
    UPDATE_LESSON_SUCCESS,
    UPDATE_LESSON_FAIL

} from '../constants/courseConstants'

export const getCourses = (keyword = '', currentPage = 1, price, category, rating = 0) => async (dispatch) => {
    try {

        dispatch({ type: ALL_COURSES_REQUEST })

        let link = `/api/v1/courses?keyword=${keyword}&page=${currentPage}&price[lte]=${price[1]}&price[gte]=${price[0]}&ratings[gte]=${rating}`

        if (category) {
            link = `/api/v1/courses?keyword=${keyword}&page=${currentPage}&price[lte]=${price[1]}&price[gte]=${price[0]}&category=${category}&ratings[gte]=${rating}`
        }

        const { data } = await axios.get(link)


        dispatch({
            type: ALL_COURSES_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: ALL_COURSES_FAIL,
            payload: error.response.data.message
        })
    }
}

export const newCourse = (courseData) => async (dispatch) => {
    try {

        dispatch({ type: NEW_COURSE_REQUEST })

        const config = {
            credentials: 'include',
            headers: {'Content-type': 'multipart/form-data; boundary=XXX' },
            body: '--XXX\r\nContent-Disposition: form-data; name="file"; filename="filename.csv"\r\nContent-Type: text/csv\r\n\r\nA,B,C\r\n1,1.1,name1\r\n2,2.2,name2\r\n\r\n--XXX--'
        }

        const { data } = await axios.post(`/api/v1/course/new`, courseData, config)

        dispatch({
            type: NEW_COURSE_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: NEW_COURSE_FAIL,
            payload: error.response.data.message
        })
    }
}

// Delete course (Admin)
export const deleteCourse = (id) => async (dispatch) => {
    try {

        dispatch({ type: DELETE_COURSE_REQUEST })

        const { data } = await axios.delete(`/api/v1/course/${id}`)

        dispatch({
            type: DELETE_COURSE_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: DELETE_COURSE_FAIL,
            payload: error.response.data.message
        })
    }
}

// Update Course (ADMIN)
export const updateCourse = (id, courseData) => async (dispatch) => {
    try {

        dispatch({ type: UPDATE_COURSE_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.put(`/api/v1/course/${id}`, courseData, config)

        dispatch({
            type: UPDATE_COURSE_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: UPDATE_COURSE_FAIL,
            payload: error.response.data.message
        })
    }
}

export const acceptCourse = (id, courseData) => async (dispatch) => {
    try {

        dispatch({ type: UPDATE_COURSE_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.put(`/api/v1/admin/course/accept/${id}`, courseData, config)

        dispatch({
            type: UPDATE_COURSE_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: UPDATE_COURSE_FAIL,
            payload: error.response.data.message
        })
    }
}

export const getCourseDetails = (id) => async (dispatch) => {
    try {

        dispatch({ type: COURSE_DETAILS_REQUEST })

        const { data } = await axios.get(`/api/v1/course/${id}`)

        dispatch({
            type: COURSE_DETAILS_SUCCESS,
            payload: data.course
        })

    } catch (error) {
        dispatch({
            type: COURSE_DETAILS_FAIL,
            payload: error.response.data.message
        })
    }
}

export const newLesson = (lessonData) => async (dispatch) => {
    try {

        dispatch({ type: NEW_LESSON_REQUEST })

        const config = {
            credentials: 'include',
            headers: {'Content-type': 'multipart/form-data; boundary=XXX' },
            body: '--XXX\r\nContent-Disposition: form-data; name="file"; filename="filename.csv"\r\nContent-Type: text/csv\r\n\r\nA,B,C\r\n1,1.1,name1\r\n2,2.2,name2\r\n\r\n--XXX--'
        }

       

        const { data } = await axios.post(`/api/v1/media/create`, lessonData, config)

        dispatch({
            type: NEW_LESSON_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: NEW_LESSON_FAIL,
            payload: error.response.data.message
        })
    }
}

export const getCourseLessons = (id) => async (dispatch) => {
    try {

        dispatch({ type: GET_LESSONS_REQUEST })

        const { data } = await axios.get(`/api/v1/media/all/${id}`)

        dispatch({
            type: GET_LESSONS_SUCCESS,
            payload: data.media
        })

    } catch (error) {

        dispatch({
            type: GET_LESSONS_FAIL,
            payload: error.response.data.message
        })
    }
}

export const getCourseLesson = (courseId,index) => async (dispatch) => {
    try {

        dispatch({ type: GET_LESSON_REQUEST })

        const { data } = await axios.get(`/api/v1/media/${courseId}/${index}`)

        dispatch({
            type: GET_LESSON_SUCCESS,
            payload: data.media
        })

    } catch (error) {

        dispatch({
            type: GET_LESSON_FAIL,
            payload: error.response.data.message
        })
    }
}


export const updateLesson = (id,lessonData) => async (dispatch) => {
    try {

        dispatch({ type: UPDATE_LESSON_REQUEST })

        const { data } = await axios.put(`/api/v1/media/update/${id}`,lessonData)

        dispatch({
            type: UPDATE_LESSON_SUCCESS,
            payload: data.success
        })

    } catch (error) {



        dispatch({
            type: UPDATE_LESSON_FAIL,
            payload: error.response.data.message
        })
    }
}


export const deleteLesson = (id) => async (dispatch) => {
    try {

        dispatch({ type: DELETE_LESSON_REQUEST })

        const { data } = await axios.delete(`/api/v1/media/delete/${id}`)

        dispatch({
            type: DELETE_LESSON_SUCCESS,
            payload: data.success
        })

    } catch (error) {



        dispatch({
            type: DELETE_LESSON_FAIL,
            payload: error.response.data.message
        })
    }
}


export const newReview = (reviewData) => async (dispatch) => {
    try {

        dispatch({ type: NEW_REVIEW_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        

        const { data } = await axios.put(`/api/v1/review`, reviewData, config)

        dispatch({
            type: NEW_REVIEW_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: NEW_REVIEW_FAIL,
            payload: error.response.data.message
        })
    }
}


export const getAdminCourses = () => async (dispatch) => {
    try {

        dispatch({ type: ADMIN_COURSES_REQUEST })

        const { data } = await axios.get(`/api/v1/admin/courses`)

        dispatch({
            type: ADMIN_COURSES_SUCCESS,
            payload: data.courses
        })

    } catch (error) {

        dispatch({
            type: ADMIN_COURSES_FAIL,
            payload: error.response.data.message
        })
    }
}

export const getRegularCourses = () => async (dispatch) => {
    try {

        dispatch({ type: REGULAR_COURSES_REQUEST })

        const { data } = await axios.get(`/api/v1/regularCourses`)

        dispatch({
            type: REGULAR_COURSES_SUCCESS,
            payload: data.regularCourses
        })

    } catch (error) {

        dispatch({
            type: REGULAR_COURSES_FAIL,
            payload: error.response.data.message
        })
    }
}

export const getMeCourses = (userId) => async (dispatch) => {
    try {

        dispatch({ type: CREATOR_COURSES_REQUEST })

        const { data } = await axios.get(`/api/v1/me/courses/${userId}`)

        dispatch({
            type: CREATOR_COURSES_SUCCESS,
            payload: data.courses
        })

    } catch (error) {

        dispatch({
            type: CREATOR_COURSES_FAIL,
            payload: error.response.data.message
        })
    }
}

// Get course reviews
export const getCourseReviews = (id) => async (dispatch) => {
    try {

        dispatch({ type: GET_REVIEWS_REQUEST })

        const { data } = await axios.get(`/api/v1/reviews?id=${id}`)

        dispatch({
            type: GET_REVIEWS_SUCCESS,
            payload: data.reviews
        })

    } catch (error) {

        dispatch({
            type: GET_REVIEWS_FAIL,
            payload: error.response.data.message
        })
    }
}

// Delete course review
export const deleteReview = (id, courseId) => async (dispatch) => {
    try {

        dispatch({ type: DELETE_REVIEW_REQUEST })

        const { data } = await axios.delete(`/api/v1/reviews?id=${id}&courseId=${courseId}`)

        dispatch({
            type: DELETE_REVIEW_SUCCESS,
            payload: data.success
        })

    } catch (error) {

    

        dispatch({
            type: DELETE_REVIEW_FAIL,
            payload: error.response.data.message
        })
    }
}

// Clear Errors
export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    })
}


export const newTopic = (topicData) => async (dispatch) => {
    try {

        dispatch({ type: NEW_TOPIC_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }



        const { data } = await axios.post(`/api/v1/topic/new`, topicData, config)

        dispatch({
            type: NEW_TOPIC_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: NEW_TOPIC_FAIL,
            payload: error.response.data.message
        })
    }
}

export const getCourseTopics = (id) => async (dispatch) => {
    try {

        dispatch({ type: GET_TOPICS_REQUEST })

        const { data } = await axios.get(`/api/v1/topics/${id}`)

        dispatch({
            type: GET_TOPICS_SUCCESS,
            payload: data.topics
        })

    } catch (error) {

        dispatch({
            type: GET_TOPICS_FAIL,
            payload: error.response.data.message
        })
    }
}



export const deleteTopic = (id) => async (dispatch) => {
    try {

        dispatch({ type: DELETE_TOPIC_REQUEST })

        const { data } = await axios.delete(`/api/v1/topic/delete/${id}`)

        dispatch({
            type: DELETE_TOPIC_SUCCESS,
            payload: data.success
        })

    } catch (error) {


        dispatch({
            type: DELETE_TOPIC_FAIL,
            payload: error.response.data.message
        })
    }
}

export const updateTopic = (id, topicData) => async (dispatch) => {
    try {

        dispatch({ type: UPDATE_TOPIC_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.put(`/api/v1/topic/update/${id}`, topicData, config)

        dispatch({
            type: UPDATE_TOPIC_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: UPDATE_TOPIC_FAIL,
            payload: error.response.data.message
        })
    }
}



export const newQuiz = (quizData) => async (dispatch) => {
    try {

        dispatch({ type: NEW_QUIZ_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }


        const { data } = await axios.post(`/api/v1/quiz/new`, quizData, config)

        dispatch({
            type: NEW_QUIZ_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: NEW_QUIZ_FAIL,
            payload: error.response.data.message
        })
    }
}

export const getTopicQuizs = (id) => async (dispatch) => {
    try {

        dispatch({ type: GET_QUIZS_REQUEST })

        const { data } = await axios.get(`/api/v1/quizs/${id}`)

        dispatch({
            type: GET_QUIZS_SUCCESS,
            payload: data.quiz
        })

    } catch (error) {

        dispatch({
            type: GET_QUIZS_FAIL,
            payload: error.response.data.message
        })
    }
}



export const deleteQuiz = (id) => async (dispatch) => {
    try {

        dispatch({ type: DELETE_QUIZ_REQUEST })

        const { data } = await axios.delete(`/api/v1/quiz/delete/${id}`)

        dispatch({
            type: DELETE_QUIZ_SUCCESS,
            payload: data.success
        })

    } catch (error) {



        dispatch({
            type: DELETE_QUIZ_FAIL,
            payload: error.response.data.message
        })
    }
}

export const updateQuiz = (id, quizData) => async (dispatch) => {
    try {

        dispatch({ type: UPDATE_QUIZ_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.put(`/api/v1/quiz/update/${id}`, quizData, config)

        dispatch({
            type: UPDATE_QUIZ_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: UPDATE_QUIZ_FAIL,
            payload: error.response.data.message
        })
    }
}


export const newDocument = (docData) => async (dispatch) => {
    try {

        dispatch({ type: NEW_DOCUMENT_REQUEST })

        const config = {
            credentials: 'include',
            headers: {'Content-type': 'multipart/form-data; boundary=XXX' },
            body: '--XXX\r\nContent-Disposition: form-data; name="file"; filename="filename.csv"\r\nContent-Type: text/csv\r\n\r\nA,B,C\r\n1,1.1,name1\r\n2,2.2,name2\r\n\r\n--XXX--'
        }

       

        const { data } = await axios.post(`/api/v1/document/create`, docData, config)

        dispatch({
            type: NEW_DOCUMENT_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: NEW_DOCUMENT_FAIL,
            payload: error.response.data.message
        })
    }
}

export const getCourseDocuments = (id) => async (dispatch) => {
    try {

        dispatch({ type: GET_DOCUMENTS_REQUEST })

        const { data } = await axios.get(`/api/v1/document/all/${id}`)

        dispatch({
            type: GET_DOCUMENTS_SUCCESS,
            payload: data.documents
        })

    } catch (error) {

        dispatch({
            type: GET_DOCUMENTS_FAIL,
            payload: error.response.data.message
        })
    }
}

export const getCourseDocument = (courseId,index) => async (dispatch) => {
    try {

        dispatch({ type: GET_DOCUMENT_REQUEST })

        const { data } = await axios.get(`/api/v1/document/${courseId}/${index}`)

        dispatch({
            type: GET_DOCUMENT_SUCCESS,
            payload: data.document
        })

    } catch (error) {

        dispatch({
            type: GET_DOCUMENT_FAIL,
            payload: error.response.data.message
        })
    }
}

export const deleteDocument = (id) => async (dispatch) => {
    try {

        dispatch({ type: DELETE_DOCUMENT_REQUEST })

        const { data } = await axios.delete(`/api/v1/document/delete/${id}`)

        dispatch({
            type: DELETE_DOCUMENT_SUCCESS,
            payload: data.success
        })

    } catch (error) {

        dispatch({
            type: DELETE_DOCUMENT_FAIL,
            payload: error.response.data.message
        })
    }
}


export const newNote = (noteData) => async (dispatch) => {
    try {

        dispatch({ type: NEW_NOTE_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }



        const { data } = await axios.post(`/api/v1/note/new`, noteData, config)

        dispatch({
            type: NEW_NOTE_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: NEW_NOTE_FAIL,
            payload: error.response.data.message
        })
    }
}

export const getNotes = (id) => async (dispatch) => {
    try {

        dispatch({ type: GET_NOTES_REQUEST })

        const { data } = await axios.get(`/api/v1/notes/${id}`)

        dispatch({
            type: GET_NOTES_SUCCESS,
            payload: data.notes
        })

    } catch (error) {

        dispatch({
            type: GET_NOTES_FAIL,
            payload: error.response.data.message
        })
    }
}



export const deleteNote = (id) => async (dispatch) => {
    try {

        dispatch({ type: DELETE_NOTE_REQUEST })

        const { data } = await axios.delete(`/api/v1/note/delete/${id}`)

        dispatch({
            type: DELETE_NOTE_SUCCESS,
            payload: data.success
        })

    } catch (error) {



        dispatch({
            type: DELETE_NOTE_FAIL,
            payload: error.response.data.message
        })
    }
}

export const updateNote = (id, noteData) => async (dispatch) => {
    try {

        dispatch({ type: UPDATE_NOTE_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.put(`/api/v1/note/update/${id}`, noteData, config)

        dispatch({
            type: UPDATE_NOTE_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: UPDATE_NOTE_FAIL,
            payload: error.response.data.message
        })
    }
}
