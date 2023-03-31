import axios from 'axios';
import { 
    ALL_CATEGORIES_FAIL, 
    ALL_CATEGORIES_REQUEST, 
    ALL_CATEGORIES_SUCCESS,
    NEW_CATEGORY_REQUEST,
    NEW_CATEGORY_SUCCESS,
    NEW_CATEGORY_FAIL,
    DELETE_CATEGORY_REQUEST,
    DELETE_CATEGORY_SUCCESS,
    DELETE_CATEGORY_FAIL,
    UPDATE_CATEGORY_REQUEST,
    UPDATE_CATEGORY_SUCCESS,
    UPDATE_CATEGORY_FAIL,
    CLEAR_ERRORS,
    CATEGORY_DETAILS_REQUEST,
    CATEGORY_DETAILS_SUCCESS,
    CATEGORY_DETAILS_FAIL,
} from '../constants/categoryConstant';

export const getCategories = () => async (dispatch) => {
    try {

        dispatch({ type: ALL_CATEGORIES_REQUEST })


        const { data } = await axios.get('/api/v1/categories')

        dispatch({
            type: ALL_CATEGORIES_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: ALL_CATEGORIES_FAIL,
            payload: error.response.data.message
        })
    }
}

export const newCategory = (categoryData) => async (dispatch) => {
    try {

        dispatch({ type: NEW_CATEGORY_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.post(`/api/v1/admin/category/new`, categoryData, config)

        dispatch({
            type: NEW_CATEGORY_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: NEW_CATEGORY_FAIL,
            payload: error.response.data.message
        })
    }
}

export const deleteCategory = (id) => async (dispatch) => {
    try {

        dispatch({ type: DELETE_CATEGORY_REQUEST })

        const { data } = await axios.delete(`/api/v1/admin/category/delete/${id}`)

        dispatch({
            type: DELETE_CATEGORY_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: DELETE_CATEGORY_FAIL,
            payload: error.response.data.message
        })
    }
}

export const updateCategory = (id, categoryData) => async (dispatch) => {
    try {

        dispatch({ type: UPDATE_CATEGORY_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.put(`/api/v1/admin/category/update/${id}`, categoryData, config)

        dispatch({
            type: UPDATE_CATEGORY_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: UPDATE_CATEGORY_FAIL,
            payload: error.response.data.message
        })
    }
}


export const getCategoryDetails = (id) => async (dispatch) => {
    try {

        dispatch({ type: CATEGORY_DETAILS_REQUEST })

        const { data } = await axios.get(`/api/v1/admin/category/${id}`)


        dispatch({
            type: CATEGORY_DETAILS_SUCCESS,
            payload: data.category
        })

    } catch (error) {
        dispatch({
            type: CATEGORY_DETAILS_FAIL,
            payload: error.response.data.message
        })
    }
}


export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    })
}