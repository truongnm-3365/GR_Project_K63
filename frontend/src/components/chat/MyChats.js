import { useEffect, useState } from "react";
import { getSender } from "./config/ChatLogics";
import ChatLoading from "./ChatLoading";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { getChats, setSeletedChat } from "../../actions/chatAction";

const MyChats = () => {

  const { user } = useSelector( state => state.auth)

  const dispatch = useDispatch();
  const { selectedChat } = useSelector(state => state.selectedChat)
  const { chats} = useSelector(state => state.chats)
  const { accessChat } = useSelector(state => state.accessChat)

  let alert = useAlert()

  let chatsStyle = (chat) => ({
    cursor:"pointer",
    background: selectedChat._id === chat._id ? "#38B2AC" : "#E8E8E8",
    color: selectedChat._id === chat._id ? "white" : "black",
    borderRadius:'10px',
    padding:'5px 10px',
    marginBottom:'10px'
  })

  const fetchChats = async () => {
    try {
      dispatch(getChats())

    } catch (error) {
      alert.error('Khổng tải được tin nhắn')
    }
  };


  useEffect(() => {
    fetchChats();
  }, [dispatch,accessChat]);

  return (

    <>
      <div
        style={{display:"flex",background:'white',borderRadius:'10px',borderWidth:'1px'}}
        className="flex-column align-items-center p-3 col-12 col-md-3 "
      >
        <div
          className="pb-3 px-3 d-flex w-100 justify-content-between align-items-center"
          style={{fontSize:'26px'}}
        >
          Tin nhắn của tôi
        </div>
        <div
          className="d-flex flex-column p-3"
          style={{background:"#F8F8F8",width:'100%',height:'100%',borderRadius:'10px',overflowY:'hidden'}}
        >
          {chats ? (
            <div style={{overflowY:"scroll"}}>
              {chats.map((chat) => (
                <div
                  onClick={() => dispatch(setSeletedChat(chat))}
                  style={chatsStyle(chat)}                
                  key={chat._id}
                >
                  <div>
                    {!chat.isGroupChat
                      ? getSender(user, chat.users)
                      : chat.chatName}
                  </div>
                  {chat.latestMessage && (
                    <div style={{fontSize:"16px"}}>
                      <b>{chat.latestMessage.sender.name} : </b>
                      {chat.latestMessage.content.length > 50
                        ? chat.latestMessage.content.substring(0, 51) + "..."
                        : chat.latestMessage.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <ChatLoading />
          )}
        </div>
      </div>
    </>

  );
};

export default MyChats;
