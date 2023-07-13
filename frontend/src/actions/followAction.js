import {
    ALL_FOLLOWING_REQUEST,
    ALL_FOLLOWING_FAIL,
    ALL_FOLLOWING_SUCCESS,
    ALL_FOLLOWER_REQUEST,
    ALL_FOLLOWER_FAIL,
    ALL_FOLLOWER_SUCCESS,
    NEW_FOLLOW_FAIL,
    NEW_FOLLOW_REQUEST,
    NEW_FOLLOW_RESET,
    NEW_FOLLOW_SUCCESS,
    DELETE_FOLLOW_FAIL,
    DELETE_FOLLOW_REQUEST,
    DELETE_FOLLOW_RESET,
    DELETE_FOLLOW_SUCCESS,
    CLEAR_ERRORS,
} from '../constants/followContant'

import axios from '../../src/axios/axios'

export const getFollowers = (id) => async (dispatch) => {
    try {

        dispatch({ type: ALL_FOLLOWER_REQUEST })

        const { data } = await axios.get(`/api/v1/getFollowers/${id}`)

       
        dispatch({
            type: ALL_FOLLOWER_SUCCESS,
            payload: data.followers
        })

    } catch (error) {
        dispatch({
            type: ALL_FOLLOWER_FAIL,
            payload: error.response?.data?.message
        })
    }
}

export const getFollowings = (id) => async (dispatch) => {
    try {

        dispatch({ type: ALL_FOLLOWING_REQUEST })

        const { data } = await axios.get(`/api/v1/getFollowings/${id}`)

       
        dispatch({
            type: ALL_FOLLOWING_SUCCESS,
            payload: data.followings
        })

    } catch (error) {
        dispatch({
            type: ALL_FOLLOWING_FAIL,
            payload: error.response?.data?.message
        })
    }
}

export const addFollow = (userId) => async (dispatch) => {
    try {

        dispatch({ type: NEW_FOLLOW_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        

        const { data } = await axios.post(`/api/v1/addFollow/${userId}`,{}, config)

        dispatch({
            type: NEW_FOLLOW_SUCCESS,
            payload: data.follow
        })

    } catch (error) {
        dispatch({
            type: NEW_FOLLOW_FAIL,
            payload: error.response?.data?.message
        })
    }
}

export const deleteFollow = (id) => async (dispatch) => {
    try {

        dispatch({ type: DELETE_FOLLOW_REQUEST })

        const { data } = await axios.delete(`/api/v1/deleteFollow/${id}`)

        dispatch({
            type: DELETE_FOLLOW_SUCCESS,
            payload: data.success
        })

    } catch (error) {


        dispatch({
            type: DELETE_FOLLOW_FAIL,
            payload: error.response?.data?.message
        })
    }
}