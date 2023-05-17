import axios from '../../src/axios/axios'
import {
    GET_NOTIFIES_REQUEST,
    GET_NOTIFIES_SUCCESS,
    GET_NOTIFIES_FAIL,
    DELETE_ALL_NOTIFIES_FAIL,
    DELETE_ALL_NOTIFIES_REQUEST,
    DELETE_ALL_NOTIFIES_RESET,
    DELETE_ALL_NOTIFIES_SUCCESS,
    CLEAR_ERRORS

} from '../constants/notifyContants'
export const getMeNotifies = (id) => async (dispatch) => {
    try {

        dispatch({ type: GET_NOTIFIES_REQUEST })

        const { data } = await axios.get(`/api/v1/me/notifies/${id}`)

        dispatch({
            type: GET_NOTIFIES_SUCCESS,
            payload: data.notifies
        })

    } catch (error) {

        dispatch({
            type: GET_NOTIFIES_FAIL,
            payload: error.response.data.message
        })
    }
}

export const deleteAllNotifies = (id) => async (dispatch) => {
    try {

        dispatch({ type: DELETE_ALL_NOTIFIES_REQUEST })

        const { data } = await axios.delete(`/api/v1/me/notifies/delete/${id}`)

        dispatch({
            type: DELETE_ALL_NOTIFIES_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: DELETE_ALL_NOTIFIES_FAIL,
            payload: error.response.data.message
        })
    }
}

export const deleteAllNotifiesMessage = (id) => async (dispatch) => {
    try {

        dispatch({ type: DELETE_ALL_NOTIFIES_REQUEST })

        const { data } = await axios.delete(`/api/v1/me/notifies/delete-message/${id}`)

        dispatch({
            type: DELETE_ALL_NOTIFIES_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: DELETE_ALL_NOTIFIES_FAIL,
            payload: error.response.data.message
        })
    }
}