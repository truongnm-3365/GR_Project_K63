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
    CLEAR_ERRORS
} from '../constants/wishListContant'

export const wishListReducer = (state = { wishList: [] }, action) => {
    switch (action.type) {
        case ALL_WISH_LIST_REQUEST:
            return {
                loading: true,
                wishList: []
            }

        case ALL_WISH_LIST_SUCCESS:
            return {
                loading: false,
                wishList: action.payload,
            }


        case ALL_WISH_LIST_FAIL:
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

export const newWishListReducer = (state = { course: {} }, action) => {
    switch (action.type) {

        case NEW_WISH_LIST_REQUEST:
            return {
                ...state,
                loading: true
            }

        case NEW_WISH_LIST_SUCCESS:
            return {
                loading: false,
                success: true,
                course: action.payload
            }

        case NEW_WISH_LIST_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case NEW_WISH_LIST_RESET:
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

export const deleteWishListReducer = (state = {}, action) => {
    switch (action.type) {

        case DELETE_WISH_LIST_REQUEST:
        
            return {
                ...state,
                loading: true
            }

        case DELETE_WISH_LIST_SUCCESS:
            return {
                ...state,
                loading: false,
                isDeleted: action.payload
            }

    

        case DELETE_WISH_LIST_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case DELETE_WISH_LIST_RESET:
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