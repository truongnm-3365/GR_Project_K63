import {
    ALL_FOLLOWER_REQUEST,
    ALL_FOLLOWER_FAIL,
    ALL_FOLLOWER_SUCCESS,
    ALL_FOLLOWING_REQUEST,
    ALL_FOLLOWING_FAIL,
    ALL_FOLLOWING_SUCCESS,
    NEW_FOLLOW_FAIL,
    NEW_FOLLOW_REQUEST,
    NEW_FOLLOW_RESET,
    NEW_FOLLOW_SUCCESS,
    DELETE_FOLLOW_FAIL,
    DELETE_FOLLOW_REQUEST,
    DELETE_FOLLOW_RESET,
    DELETE_FOLLOW_SUCCESS,
    CLEAR_ERRORS
} from '../constants/followContant'

export const followersReducer = (state = { followers: [] }, action) => {
    switch (action.type) {
        case ALL_FOLLOWER_REQUEST:
            return {
                loading: true,
                followers: []
            }

        case ALL_FOLLOWER_SUCCESS:
            return {
                loading: false,
                followers: action.payload,
            }


        case ALL_FOLLOWER_FAIL:
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

export const followingsReducer = (state = { followings: [] }, action) => {
    switch (action.type) {
        case ALL_FOLLOWING_REQUEST:
            return {
                loading: true,
                followings: []
            }

        case ALL_FOLLOWING_SUCCESS:
            return {
                loading: false,
                followings: action.payload,
            }


        case ALL_FOLLOWING_FAIL:
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

export const newFollowReducer = (state = { follow: {} }, action) => {
    switch (action.type) {

        case NEW_FOLLOW_REQUEST:
            return {
                ...state,
                loading: true
            }

        case NEW_FOLLOW_SUCCESS:
            return {
                loading: false,
                success: true,
                follow: action.payload
            }

        case NEW_FOLLOW_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case NEW_FOLLOW_RESET:
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

export const deleteFollowReducer = (state = {}, action) => {
    switch (action.type) {

        case DELETE_FOLLOW_REQUEST:
        
            return {
                ...state,
                loading: true
            }

        case DELETE_FOLLOW_SUCCESS:
            return {
                ...state,
                loading: false,
                isDeleted: action.payload
            }

    

        case DELETE_FOLLOW_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case DELETE_FOLLOW_RESET:
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