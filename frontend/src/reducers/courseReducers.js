import {
    ALL_COURSES_REQUEST,
    ALL_COURSES_SUCCESS,
    ALL_COURSES_FAIL,
    ADMIN_COURSES_REQUEST,
    ADMIN_COURSES_SUCCESS,
    ADMIN_COURSES_FAIL,
    NEW_COURSE_REQUEST,
    NEW_COURSE_SUCCESS,
    NEW_COURSE_RESET,
    NEW_COURSE_FAIL,
    DELETE_COURSE_REQUEST,
    DELETE_COURSE_SUCCESS,
    DELETE_COURSE_RESET,
    DELETE_COURSE_FAIL,
    UPDATE_COURSE_REQUEST,
    UPDATE_COURSE_SUCCESS,
    UPDATE_COURSE_RESET,
    UPDATE_COURSE_FAIL,
    COURSE_DETAILS_REQUEST,
    COURSE_DETAILS_SUCCESS,
    COURSE_DETAILS_FAIL,
    NEW_LESSON_REQUEST,
    NEW_LESSON_SUCCESS,
    NEW_LESSON_RESET,
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
    UPDATE_LESSON_REQUEST,
    UPDATE_LESSON_SUCCESS,
    UPDATE_LESSON_RESET,
    UPDATE_LESSON_FAIL,
    NEW_REVIEW_REQUEST,
    NEW_REVIEW_SUCCESS,
    NEW_REVIEW_RESET,
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
    NEW_DOCUMENT_RESET,
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
    NEW_NOTE_RESET,
    GET_NOTES_REQUEST,
    GET_NOTES_SUCCESS,
    GET_NOTES_FAIL,
    UPDATE_NOTE_REQUEST,
    DELETE_NOTE_REQUEST,
    DELETE_NOTE_SUCCESS,
    UPDATE_NOTE_SUCCESS,
    UPDATE_NOTE_FAIL,
    DELETE_NOTE_FAIL,
    DELETE_NOTE_RESET,
    UPDATE_NOTE_RESET,
    MY_COURSES_REQUEST,
    CREATOR_COURSES_REQUEST,
    MY_COURSES_SUCCESS,
    CREATOR_COURSES_SUCCESS,
    MY_COURSES_FAIL,
    CREATOR_COURSES_FAIL

} from '../constants/courseConstants'


export const coursesReducer = (state = { courses: [] }, action) => {
    switch (action.type) {
        case ALL_COURSES_REQUEST:
        case ADMIN_COURSES_REQUEST:
        case MY_COURSES_REQUEST:
        case CREATOR_COURSES_REQUEST:
            return {
                loading: true,
                courses: []
            }

        case ALL_COURSES_SUCCESS:
            return {
                loading: false,
                courses: action.payload.courses,
                coursesCount: action.payload.coursesCount,
                resPerPage: action.payload.resPerPage,
                filteredCoursesCount: action.payload.filteredCoursesCount
            }

        case ADMIN_COURSES_SUCCESS:
            return {
                loading: false,
                courses: action.payload
            }

        case MY_COURSES_SUCCESS:
            return {
                loading: false,
                courses: action.payload
            }

        case CREATOR_COURSES_SUCCESS:
            return {
                loading: false,
                courses: action.payload
            }

        case ALL_COURSES_FAIL:
        case MY_COURSES_FAIL:
        case CREATOR_COURSES_FAIL:
        case ADMIN_COURSES_FAIL:
            return {
                loading: false,
                error: action.payload
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state;
    }
}

export const regularCoursesReducer = (state = { regularCourses: [] }, action) => {
    switch (action.type) {
        case REGULAR_COURSES_REQUEST:
            return {
                loading: true,
                regularCourses: []
            }

        case REGULAR_COURSES_SUCCESS:
            return {
                loading: false,
                regularCourses: action.payload
            }

        case REGULAR_COURSES_FAIL:
            return {
                loading: false,
                error: action.payload
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state;
    }
}



export const newCourseReducer = (state = { course: {} }, action) => {
    switch (action.type) {

        case NEW_COURSE_REQUEST:
            return {
                ...state,
                loading: true
            }

        case NEW_COURSE_SUCCESS:
            return {
                loading: false,
                success: action.payload.success,
                course: action.payload.course
            }

        case NEW_COURSE_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case NEW_COURSE_RESET:
            return {
                ...state,
                success: false
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}

export const courseReducer = (state = {}, action) => {
    switch (action.type) {

        case DELETE_COURSE_REQUEST:
        case UPDATE_COURSE_REQUEST:
            return {
                ...state,
                loading: true
            }

        case DELETE_COURSE_SUCCESS:
            return {
                ...state,
                loading: false,
                isDeleted: action.payload
            }

        case UPDATE_COURSE_SUCCESS:
            return {
                ...state,
                loading: false,
                isUpdated: action.payload
            }


        case DELETE_COURSE_FAIL:
        case UPDATE_COURSE_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case DELETE_COURSE_RESET:
            return {
                ...state,
                isDeleted: false
            }

        case UPDATE_COURSE_RESET:
            return {
                ...state,
                isUpdated: false
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}

export const courseDetailsReducer = (state = { course: {} }, action) => {
    switch (action.type) {

        case COURSE_DETAILS_REQUEST:
            return {
                ...state,
                loading: true
            }

        case COURSE_DETAILS_SUCCESS:
            return {
                loading: false,
                course: action.payload
            }

        case COURSE_DETAILS_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}

export const newLessonReducer = (state = {}, action) => {
    switch (action.type) {

        case NEW_LESSON_REQUEST:
            return {
                ...state,
                loading: true
            }

        case NEW_LESSON_SUCCESS:
            return {
                loading: false,
                success: action.payload
            }

        case NEW_LESSON_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case NEW_LESSON_RESET:
            return {
                ...state,
                success: false
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}

export const courseLessonsReducer = (state = {lessons:[]}, action) => {
    switch (action.type) {

        case GET_LESSONS_REQUEST:
            return {
                ...state,
                loading: true
            }

        case GET_LESSONS_SUCCESS:
            return {
                ...state,
                loading: false,
                lessons: action.payload
            }

        case GET_LESSONS_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}

export const courseLessonReducer = (state = {media:{}}, action) => {
    switch (action.type) {

        case GET_LESSON_REQUEST:
            return {
                ...state,
                loading: true
            }

        case GET_LESSON_SUCCESS:
            return {
                ...state,
                loading: false,
                media: action.payload
            }

        case GET_LESSON_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}

export const lessonReducer = (state = {}, action) => {
    switch (action.type) {

        case UPDATE_LESSON_REQUEST:
        case DELETE_LESSON_REQUEST:
            return {
                ...state,
                loading: true
            }

        case DELETE_LESSON_SUCCESS:
            return {
                ...state,
                loading: false,
                isDeleted: action.payload
            }

        case UPDATE_LESSON_SUCCESS:
            return {
                ...state,
                loading: false,
                isUpdated: action.payload
            }
    
        case UPDATE_LESSON_FAIL:
        case DELETE_LESSON_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case DELETE_LESSON_RESET:
            return {
                ...state,
                isDeleted: false
            }

        case UPDATE_LESSON_RESET:
            return {
                ...state,
                isUpdated: false
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}


export const newReviewReducer = (state = {}, action) => {
    switch (action.type) {

        case NEW_REVIEW_REQUEST:
            return {
                ...state,
                loading: true
            }

        case NEW_REVIEW_SUCCESS:
            return {
                loading: false,
                success: action.payload
            }

        case NEW_REVIEW_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case NEW_REVIEW_RESET:
            return {
                ...state,
                success: false
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}

export const courseReviewsReducer = (state = { review: [] }, action) => {
    switch (action.type) {

        case GET_REVIEWS_REQUEST:
            return {
                ...state,
                loading: true
            }

        case GET_REVIEWS_SUCCESS:
            return {
                loading: false,
                reviews: action.payload
            }

        case GET_REVIEWS_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}

export const reviewReducer = (state = {}, action) => {
    switch (action.type) {

        case DELETE_REVIEW_REQUEST:
            return {
                ...state,
                loading: true
            }

        case DELETE_REVIEW_SUCCESS:
            return {
                ...state,
                loading: false,
                isDeleted: action.payload
            }

        case DELETE_REVIEW_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case DELETE_REVIEW_RESET:
            return {
                ...state,
                isDeleted: false
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}

export const newTopicReducer = (state = {}, action) => {
    switch (action.type) {

        case NEW_TOPIC_REQUEST:
            return {
                ...state,
                loading: true
            }

        case NEW_TOPIC_SUCCESS:
            return {
                loading: false,
                success: action.payload
            }

        case NEW_TOPIC_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case NEW_TOPIC_RESET:
            return {
                ...state,
                success: false
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}

export const courseTopicsReducer = (state = {topics:[]}, action) => {
    switch (action.type) {

        case GET_TOPICS_REQUEST:
            return {
                ...state,
                loading: true
            }

        case GET_TOPICS_SUCCESS:
            return {
                ...state,
                loading: false,
                topics: action.payload
            }

        case GET_TOPICS_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}

export const courseTopicReducer = (state = {topic:{}}, action) => {
    switch (action.type) {

        case UPDATE_TOPIC_REQUEST:
        case DELETE_TOPIC_REQUEST:
                return {
                    ...state,
                    loading: true
                }
    
        case DELETE_TOPIC_SUCCESS:
                return {
                    ...state,
                    loading: false,
                    isDeleted: action.payload
                }
        case UPDATE_TOPIC_SUCCESS:
                return {
                        ...state,
                        loading: false,
                        isUpdated: action.payload
            }
        case UPDATE_TOPIC_FAIL:
        case DELETE_TOPIC_FAIL:
                return {
                    ...state,
                    error: action.payload
                }
    
        case DELETE_TOPIC_RESET:
                return {
                    ...state,
                    isDeleted: false
                }
        case UPDATE_TOPIC_RESET:
                    return {
                    ...state,
                    isUpdated: false
                }
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}

export const newQuizReducer = (state = {}, action) => {
    switch (action.type) {

        case NEW_QUIZ_REQUEST:
            return {
                ...state,
                loading: true
            }

        case NEW_QUIZ_SUCCESS:
            return {
                loading: false,
                success: action.payload
            }

        case NEW_QUIZ_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case NEW_QUIZ_RESET:
            return {
                ...state,
                success: false
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}

export const topicQuizsReducer = (state = {quizs:[]}, action) => {
    switch (action.type) {

        case GET_QUIZS_REQUEST:
            return {
                ...state,
                loading: true
            }

        case GET_QUIZS_SUCCESS:
            return {
                ...state,
                loading: false,
                quizs: action.payload
            }

        case GET_QUIZS_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}

export const topicQuizReducer = (state = {quiz:{}}, action) => {
    switch (action.type) {

        case UPDATE_QUIZ_REQUEST:
        case DELETE_QUIZ_REQUEST:
                return {
                    ...state,
                    loading: true
                }
    
        case DELETE_QUIZ_SUCCESS:
                return {
                    ...state,
                    loading: false,
                    isDeleted: action.payload
                }
        case UPDATE_QUIZ_SUCCESS:
                return {
                        ...state,
                        loading: false,
                        isUpdated: action.payload
            }
        case UPDATE_QUIZ_FAIL:
        case DELETE_QUIZ_FAIL:
                return {
                    ...state,
                    error: action.payload
                }
    
        case DELETE_QUIZ_RESET:
                return {
                    ...state,
                    isDeleted: false
                }
        case UPDATE_QUIZ_RESET:
                    return {
                        ...state,
                        isDeleted: false
                }
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}

export const newDocumentReducer = (state = {}, action) => {
    switch (action.type) {

        case NEW_DOCUMENT_REQUEST:
            return {
                ...state,
                loading: true
            }

        case NEW_DOCUMENT_SUCCESS:
            return {
                loading: false,
                success: action.payload
            }

        case NEW_DOCUMENT_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case NEW_DOCUMENT_RESET:
            return {
                ...state,
                success: false
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}

export const courseDocumentsReducer = (state = {documents:[]}, action) => {
    switch (action.type) {

        case GET_DOCUMENTS_REQUEST:
            return {
                ...state,
                loading: true
            }

        case GET_DOCUMENTS_SUCCESS:
            return {
                ...state,
                loading: false,
                documents: action.payload
            }

        case GET_DOCUMENTS_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}

export const courseDocumentReducer = (state = {document:{}}, action) => {
    switch (action.type) {

        case GET_DOCUMENT_REQUEST:
            return {
                ...state,
                loading: true
            }

        case GET_DOCUMENT_SUCCESS:
            return {
                ...state,
                loading: false,
                document: action.payload
            }

        case GET_DOCUMENT_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}

export const documentReducer = (state = {}, action) => {
    switch (action.type) {

        case DELETE_DOCUMENT_REQUEST:
            return {
                ...state,
                loading: true
            }

        case DELETE_DOCUMENT_SUCCESS:
            return {
                ...state,
                loading: false,
                isDeleted: action.payload
            }

        case DELETE_DOCUMENT_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case DELETE_DOCUMENT_RESET:
            return {
                ...state,
                isDeleted: false
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}


export const newNoteReducer = (state = {}, action) => {
    switch (action.type) {

        case NEW_NOTE_REQUEST:
            return {
                ...state,
                loading: true
            }

        case NEW_NOTE_SUCCESS:
            return {
                loading: false,
                success: action.payload.success,
                note: action.payload.note
            }

        case NEW_NOTE_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case NEW_NOTE_RESET:
            return {
                ...state,
                success: false
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}

export const notesReducer = (state = {notes:[]}, action) => {
    switch (action.type) {

        case GET_NOTES_REQUEST:
            return {
                ...state,
                loading: true
            }

        case GET_NOTES_SUCCESS:
            return {
                ...state,
                loading: false,
                notes: action.payload
            }

        case GET_NOTES_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}

export const noteReducer = (state = {note:{}}, action) => {
    switch (action.type) {

        case UPDATE_NOTE_REQUEST:
        case DELETE_NOTE_REQUEST:
                return {
                    ...state,
                    loading: true
                }
    
        case DELETE_NOTE_SUCCESS:
                return {
                    ...state,
                    loading: false,
                    isDeleted: action.payload
                }
        case UPDATE_NOTE_SUCCESS:
                return {
                        ...state,
                        loading: false,
                        isUpdated: action.payload
            }
        case UPDATE_NOTE_FAIL:
        case DELETE_NOTE_FAIL:
                return {
                    ...state,
                    error: action.payload
                }
    
        case DELETE_NOTE_RESET:
                return {
                    ...state,
                    isDeleted: false
                }
        case UPDATE_NOTE_RESET:
                    return {
                        ...state,
                        isDeleted: false
                }
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}