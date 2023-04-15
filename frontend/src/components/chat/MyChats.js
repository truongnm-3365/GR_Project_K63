import axios from "axios";
import { useEffect, useState } from "react";
import { getSender } from "../../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import { ChatState } from "../../Context/ChatProvider";
import { useAlert } from "react-alert";

const MyChats = ({ fetchAgain }) => {

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  let alert = useAlert()

  let chatsStyle = (chat) => ({
    cursor:"pointer",
    background: selectedChat === chat ? "#38B2AC" : "#E8E8E8",
    color: selectedChat === chat ? "white" : "black",
    borderRadius:'10px',
    padding:'5px 10px',
    marginBottom:'10px'
  })

  const fetchChats = async () => {
    // console.log(user._id);
    try {

      const { data } = await axios.get("/api/v1/chat");
      setChats(data);
    } catch (error) {
      alert.error('Khổng tải được tin nhắn')
    }
  };

  useEffect(() => {
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (

    <>
      <div
        style={{display:"flex",background:'white',borderRadius:'10px',borderWidth:'1px'}}
        className="flex-column align-items-center p-3 col-12 col-md-3 "
      >
        <div
          className="pb-3 px-3 d-flex w-100 justify-content-between align-items-center"
          style={{fontSize:'30px'}}
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
                  onClick={() => setSelectedChat(chat)}
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
