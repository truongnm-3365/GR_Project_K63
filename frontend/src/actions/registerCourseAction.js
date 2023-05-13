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
    CLEAR_ERRORS,
    UPDATE_REGISTER_COURSE_REQUEST,
    UPDATE_REGISTER_COURSE_SUCCESS,
    UPDATE_REGISTER_COURSE_FAIL
} from '../constants/registerCourseContants'

import axios from '../../src/axios/axios'

export const getMeRegisterCourses = () => async (dispatch) => {
    try {

        dispatch({ type: ALL_REGISTER_COURSES_REQUEST })

        const { data } = await axios.get(`/api/v1/getRegisterCourses`)

       
        dispatch({
            type: ALL_REGISTER_COURSES_SUCCESS,
            payload: data
        })

    } catch (error) {
        console.log(error);
        dispatch({
            type: ALL_REGISTER_COURSES_FAIL,
            payload: error.response.data.message
        })
    }
}

export const newRegisterCourse = (courseId) => async (dispatch) => {
    try {

        dispatch({ type: NEW_REGISTER_COURSE_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        

        const { data } = await axios.post(`/api/v1/registerCourse/${courseId}`,{}, config)

        dispatch({
            type: NEW_REGISTER_COURSE_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: NEW_REGISTER_COURSE_FAIL,
            payload: error.response.data.message
        })
    }
}

export const comleteVideo = (videoData) => async (dispatch) => {
    try {

        dispatch({ type: NEW_REGISTER_COURSE_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        

        const { data } = await axios.post(`/api/v1/completeVideo`,videoData, config)

        dispatch({
            type: NEW_REGISTER_COURSE_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: NEW_REGISTER_COURSE_FAIL,
            payload: error.response.data.message
        })
    }
}


export const completedVideo = (videoData) => async (dispatch) => {
    try {

        dispatch({ type: UPDATE_REGISTER_COURSE_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.put(`/api/v1/completedVideo`,videoData,config)

        dispatch({
            type: UPDATE_REGISTER_COURSE_SUCCESS,
            payload: data.success
        })

    } catch (error) {


        dispatch({
            type: UPDATE_REGISTER_COURSE_FAIL,
            payload: error.response.data.message
        })
    }
}

export const extendCourse = (course) => async (dispatch) => {
    try {

        dispatch({ type: UPDATE_REGISTER_COURSE_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.put(`/api/v1/courseExtend`,course,config)

        dispatch({
            type: UPDATE_REGISTER_COURSE_SUCCESS,
            payload: data.success
        })

    } catch (error) {


        dispatch({
            type: UPDATE_REGISTER_COURSE_FAIL,
            payload: error.response.data.message
        })
    }
}


export const deleteRegisterCourse = (id) => async (dispatch) => {
    try {

        dispatch({ type: DELETE_REGISTER_COURSE_REQUEST })

        const { data } = await axios.delete(`/api/v1/cancelRegister/${id}`)

        dispatch({
            type: DELETE_REGISTER_COURSE_SUCCESS,
            payload: data.success
        })

    } catch (error) {


        dispatch({
            type: DELETE_REGISTER_COURSE_FAIL,
            payload: error.response.data.message
        })
    }
}