import { ACCESS_CHAT_FAIL, 
        ACCESS_CHAT_REQUEST, 
        ACCESS_CHAT_SUCCESS, 
        CLEAR_SELECTED_CHAT, 
        FETCH_CHATS_FAIL, 
        FETCH_CHATS_REQUEST, 
        FETCH_CHATS_SUCCESS, 
        FETCH_MESSAGES_FAIL, 
        FETCH_MESSAGES_REQUEST,
        FETCH_MESSAGES_SUCCESS,
        RESET_ACCESS_CHAT,
        SEARCH_CHAT_FAIL,
        SEARCH_CHAT_REQUEST,
        SEARCH_CHAT_SUCCESS,
        SELECTED_CHAT,
        SEND_MESSAGE_FAIL,
        SEND_MESSAGE_REQUEST,
        SEND_MESSAGE_SUCCESS

    } from "../constants/chatContant"

export const chatsReducer = (state = { chats: [] }, action) => {
    switch (action.type) {
        case FETCH_CHATS_REQUEST:
            return {
                loading: true,
                chats: []
            }

        case FETCH_CHATS_SUCCESS:
            return {
                loading: false,
                chats: action.payload,
                success:true
            }

        case FETCH_CHATS_FAIL:
            return {
                loading: false,
                error: action.payload
            }

        default:
            return state;
    }
}

export const messagesReducer = (state = { messages: [] }, action) => {
    switch (action.type) {
        case FETCH_MESSAGES_REQUEST:
            return {
                loading: true,
                messages: []
            }

        case FETCH_MESSAGES_SUCCESS:
            return {
                loading: false,
                messages: action.payload,
                success:true
            }

        case FETCH_MESSAGES_FAIL:
            return {
                loading: false,
                error: action.payload
            }

        default:
            return state;
    }
}


export const accessChatReducer = (state = { accessChat: {} }, action) => {
    switch (action.type) {
        case ACCESS_CHAT_REQUEST:
            return {
                loading: true,
                accessChat: {}
            }

        case ACCESS_CHAT_SUCCESS:
            return {
                loading: false,
                accessChat: action.payload,
                success:true
            }

        case ACCESS_CHAT_FAIL:
            return {
                loading: false,
                error: action.payload
            }

        case RESET_ACCESS_CHAT:
            return {
                accessChat:{}
            }

        default:
            return state;
    }
}

export const sendMessagesReducer = (state = { newMessage: "" }, action) => {
    switch (action.type) {
        case SEND_MESSAGE_REQUEST:
            return {
                loading: true,
                newMessage: ""
            }

        case SEND_MESSAGE_SUCCESS:
            return {
                loading: false,
                newMessages: action.payload,
                success:true
            }

        case SEND_MESSAGE_FAIL:
            return {
                loading: false,
                error: action.payload
            }

        default:
            return state;
    }
}

export const searchChatReducer = (state = { searchResult: [] }, action) => {
    switch (action.type) {
        case SEARCH_CHAT_REQUEST:
            return {
                loading: true,
                searchResult: []
            }

        case SEARCH_CHAT_SUCCESS:
            return {
                loading: false,
                searchResult: action.payload,
                success:true
            }

        case SEARCH_CHAT_FAIL:
            return {
                loading: false,
                error: action.payload
            }

        default:
            return state;
    }
}

export const selectedChatReducer = (state = { selectedChat: {} }, action) => {
    switch (action.type) {

        case SELECTED_CHAT:
            return {
                selectedChat:action.payload
            }

        case CLEAR_SELECTED_CHAT:
            return {
               selectedChat:{}
            }

        default:
            return state;
    }
}