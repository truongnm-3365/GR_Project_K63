import {
    ALL_REGISTER_COURSES_REQUEST,
    ALL_REGISTER_COURSES_FAIL,
    ALL_REGISTER_COURSES_SUCCESS,
    NEW_REGISTER_COURSE_FAIL,
    NEW_REGISTER_COURSE_REQUEST,
    NEW_REGISTER_COURSE_RESET,
    NEW_REGISTER_COURSE_SUCCESS,
    DELETE_REGISTER_COURSE_FAIL,
    DELETE_REGISTER_COURSE_REQUEST,
    DELETE_REGISTER_COURSE_RESET,
    DELETE_REGISTER_COURSE_SUCCESS,
    UPDATE_REGISTER_COURSE_FAIL,
    UPDATE_REGISTER_COURSE_REQUEST,
    UPDATE_REGISTER_COURSE_RESET,
    UPDATE_REGISTER_COURSE_SUCCESS,
    CLEAR_ERRORS
} from '../constants/registerCourseContants'

export const registerCoursesReducer = (state = { registerCourses: [] }, action) => {
    switch (action.type) {
        case ALL_REGISTER_COURSES_REQUEST:
            return {
                loading: true,
                registerCourses: []
            }

        case ALL_REGISTER_COURSES_SUCCESS:
            return {
                loading: false,
                registerCourses: action.payload.courses,
                completeVideos: action.payload.videos
            }


        case ALL_REGISTER_COURSES_FAIL:
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

export const newRegisterCourseReducer = (state = { registerCourse: {} }, action) => {
    switch (action.type) {

        case NEW_REGISTER_COURSE_REQUEST:
            return {
                ...state,
                loading: true
            }

        case NEW_REGISTER_COURSE_SUCCESS:
            return {
                loading: false,
                success: true,
                registerCourse: action.payload
            }

        case NEW_REGISTER_COURSE_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case NEW_REGISTER_COURSE_RESET:
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

export const RegisterCourseReducer = (state = {}, action) => {
    switch (action.type) {

        case DELETE_REGISTER_COURSE_REQUEST:
        case UPDATE_REGISTER_COURSE_REQUEST:
            return {
                ...state,
                loading: true
            }

        case DELETE_REGISTER_COURSE_SUCCESS:
            return {
                ...state,
                loading: false,
                isDeleted: action.payload
            }

        case UPDATE_REGISTER_COURSE_SUCCESS:
            return {
                ...state,
                loading: false,
                isUpdated: action.payload
            }
    

        case DELETE_REGISTER_COURSE_FAIL:
        case UPDATE_REGISTER_COURSE_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case DELETE_REGISTER_COURSE_RESET:
            return {
                ...state,
                isDeleted: false
            }
        case UPDATE_REGISTER_COURSE_RESET:
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