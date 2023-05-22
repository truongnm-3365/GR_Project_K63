import axios from '../../src/axios/axios'
import { ACCESS_CHAT_FAIL, 
    ACCESS_CHAT_REQUEST, 
    ACCESS_CHAT_SUCCESS, 
    FETCH_CHATS_FAIL, 
    FETCH_CHATS_REQUEST, 
    FETCH_CHATS_SUCCESS, 
    FETCH_MESSAGES_FAIL, 
    FETCH_MESSAGES_REQUEST,
    FETCH_MESSAGES_SUCCESS,
    SEARCH_CHAT_FAIL,
    SEARCH_CHAT_REQUEST,
    SEARCH_CHAT_SUCCESS,
    SELECTED_CHAT,
    SEND_MESSAGE_FAIL,
    SEND_MESSAGE_REQUEST,
    SEND_MESSAGE_SUCCESS

} from "../constants/chatContant"

export const getSearchChat = (search) => async (dispatch) => {
    try {

        dispatch({ type: SEARCH_CHAT_REQUEST })


        const { data } = await axios.get(`/api/v1/user?search=${search}`);

        dispatch({
            type: SEARCH_CHAT_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: SEARCH_CHAT_FAIL,
            payload: error.response?.data?.message
        })
    }
}

export const getAccessChat = (userId) => async (dispatch) => {
    try {

        dispatch({ type: ACCESS_CHAT_REQUEST })


        const { data } = await axios.post(`/api/v1/chat`, { userId });

        dispatch({
            type: ACCESS_CHAT_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: ACCESS_CHAT_FAIL,
            payload: error.response?.data?.message
        })
    }
}

export const getMessages = (id) => async (dispatch) => {
    try {

        dispatch({ type: FETCH_MESSAGES_REQUEST })


        const { data } = await axios.get(`/api/v1/message/${id}`);

        dispatch({
            type: FETCH_MESSAGES_SUCCESS,
            payload: data
        })




    } catch (error) {
        dispatch({
            type: FETCH_MESSAGES_FAIL,
            payload: error.response?.data?.message
        })
    }
}

export const postMessage = (messageData,socket) => async (dispatch) => {
    try {

        dispatch({ type: SEND_MESSAGE_REQUEST })

  

        const { data } = await axios.post("/api/v1/message",messageData);
        
        socket.emit("new message", data);
      

        dispatch({
            type: SEND_MESSAGE_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: SEND_MESSAGE_FAIL,
            payload: error.response?.data?.message
        })
    }
}

export const getChats = () => async (dispatch) => {
    try {

        dispatch({ type: FETCH_CHATS_REQUEST })


        const { data } = await axios.get("/api/v1/chat");

        dispatch({
            type: FETCH_CHATS_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: FETCH_CHATS_FAIL,
            payload: error.response?.data?.message
        })
    }
}

export const setSeletedChat = (chat) => async (dispatch) => {

    console.log(chat);

    dispatch({
        type: SELECTED_CHAT,
        payload: chat
    })

    
}



