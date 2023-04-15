import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import store from '../store'
import { useSelector } from "react-redux";
import { loadUser } from "../actions/userActions";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [notify, setNotify] = useState([]);
  
  const [chats, setChats] = useState();

  const { user, isAuthenticated, loading } = useSelector(state => state.auth)

  useEffect(() => {
   
    store.dispatch(loadUser())
    
  }, [store.dispatch]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        notify,
        setNotify,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
