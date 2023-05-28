import {
    ALL_WISH_LIST_REQUEST,
    ALL_WISH_LIST_FAIL,
    ALL_WISH_LIST_SUCCESS,
    NEW_WISH_LIST_FAIL,
    NEW_WISH_LIST_REQUEST,
    NEW_WISH_LIST_RESET,
    NEW_WISH_LIST_SUCCESS,
    DELETE_WISH_LIST_FAIL,
    DELETE_WISH_LIST_REQUEST,
    DELETE_WISH_LIST_RESET,
    DELETE_WISH_LIST_SUCCESS,
    CLEAR_ERRORS,
} from '../constants/wishListContant'

import axios from '../../src/axios/axios'

export const getMeWishList = () => async (dispatch) => {
    try {

        dispatch({ type: ALL_WISH_LIST_REQUEST })

        const { data } = await axios.get(`/api/v1/getWishList`)

       
        dispatch({
            type: ALL_WISH_LIST_SUCCESS,
            payload: data.courses
        })

    } catch (error) {
        console.log(error);
        dispatch({
            type: ALL_WISH_LIST_FAIL,
            payload: error.response?.data?.message
        })
    }
}

export const addWishlist = (courseId) => async (dispatch) => {
    try {

        dispatch({ type: NEW_WISH_LIST_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        

        const { data } = await axios.post(`/api/v1/addWishList/${courseId}`,{}, config)

        dispatch({
            type: NEW_WISH_LIST_SUCCESS,
            payload: data.course
        })

    } catch (error) {
        dispatch({
            type: NEW_WISH_LIST_FAIL,
            payload: error.response?.data?.message
        })
    }
}

export const deleteWishlist = (id) => async (dispatch) => {
    try {

        dispatch({ type: DELETE_WISH_LIST_REQUEST })

        const { data } = await axios.delete(`/api/v1/deleteWishList/${id}`)

        dispatch({
            type: DELETE_WISH_LIST_SUCCESS,
            payload: data.success
        })

    } catch (error) {


        dispatch({
            type: DELETE_WISH_LIST_FAIL,
            payload: error.response?.data?.message
        })
    }
}