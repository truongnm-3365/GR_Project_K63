import {
    GET_NOTIFIES_REQUEST,
    GET_NOTIFIES_SUCCESS,
    GET_NOTIFIES_FAIL,
    DELETE_ALL_NOTIFIES_FAIL,
    DELETE_ALL_NOTIFIES_REQUEST,
    DELETE_ALL_NOTIFIES_SUCCESS,
    DELETE_ALL_NOTIFIES_RESET,
    CLEAR_ERRORS

} from '../constants/notifyContants'
export const notifiesReducer = (state = {notifies:[]}, action) => {
    switch (action.type) {

        case GET_NOTIFIES_REQUEST:
            return {
                ...state,
                loading: true
            }

        case GET_NOTIFIES_SUCCESS:
            return {
                ...state,
                loading: false,
                notifies: action.payload
            }

        case GET_NOTIFIES_FAIL:
            return {
                ...state,
                error: action.payload
            }
        case DELETE_ALL_NOTIFIES_REQUEST:
                return {
                    ...state,
                    loading: true
                }
    
        case DELETE_ALL_NOTIFIES_SUCCESS:
                return {
                    ...state,
                    loading: false,
                    isDeleted: action.payload
                }
    
        case DELETE_ALL_NOTIFIES_FAIL:
                return {
                    ...state,
                    error: action.payload
                }
    
        case DELETE_ALL_NOTIFIES_RESET:
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

