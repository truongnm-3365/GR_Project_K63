import "./styles.css";

import { getSender, getSenderFull } from "../../config/ChatLogics";
import { useEffect, useState } from "react";


import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../../animations/typing.json";

import io from "socket.io-client";
import { Button, Spin, Form, Input,notification } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getMessages, postMessage, setSeletedChat } from "../../actions/chatAction";
import { TypingIndicator } from "@chatscope/chat-ui-kit-react";
import { getMeNotifies } from "../../actions/notifyAction";

const ENDPOINT = process.env.REACT_APP_API_URL; 
var socket, selectedChatCompare;

const isObjectEmpty = (objectName) => {
  if(objectName)
      return Object.keys(objectName).length === 0
  else{
      return true
  }
}

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const dispatch = useDispatch();

  //const [messages, setMessages] = useState([]);
  // const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [api, contextHolder] = notification.useNotification();


  const { messages, loading } = useSelector(state => state.messages) 
  const { selectedChat } = useSelector(state => state.selectedChat)
  const {newMessage: message } = useSelector(state => state.newMessage)
  const { accessChat, success } = useSelector(state => state.accessChat);
  const { user } = useSelector(state => state.auth)

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const fetchMessages = (accessChat) => {
    try {
      if(!isObjectEmpty(accessChat)){
        if(accessChat._id !== selectedChat._id){
          dispatch(getMessages(accessChat._id))
        }else{
          dispatch(getMessages(selectedChat._id))
        }
          
      }else{
        dispatch(getMessages(selectedChat._id))
      }

      
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      api['error']({
        message: 'Không tải được tin nhắn',
      });
    }
  };


  const sendMessage = (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        dispatch(postMessage( {content: newMessage,chatId: selectedChat},socket))
        setNewMessage("");
      
      } catch (error) {
        api['error']({
          message: 'Không gửi được tin nhắn',
        });
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

  }, []);

  console.log(message);


  useEffect(() => {

    if (!isObjectEmpty(selectedChat)){
      fetchMessages();
    }
    

    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat,message,dispatch,accessChat,success]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
      } else {
        if (!isObjectEmpty(selectedChat)){
          fetchMessages();
        }
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  //console.log(mess);
  

  return (
    <>
      {!isObjectEmpty(selectedChat) ? (
        <>
          {contextHolder}
          
          <span style={{fontSize:'28px'}} className="px-2 pb-3 w-100 d-flex justify-content-between align-items-center"
          >
            <Button onClick={() => dispatch(setSeletedChat({}))}>
              <i style={{fontSize:'16px'}} class="fa fa-arrow-left" aria-hidden="true"></i>
            </Button>
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                </>
              ))}
          </span>
          <div className="chat-box"
          >
            {loading ? (
              <div className="spin">
                <Spin/>
              </div>
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <Form
              onKeyDown={sendMessage}
              className="mt-3"
            >
              {istyping ? (
                <div>
                  <TypingIndicator content="đối phương đang viết gì đó" />
                </div>
              ) : (
                <></>
              )}
              <Form.Item>
                <Input
                  placeholder="Nhập tin nhắn.."
                  value={newMessage}
                  onChange={typingHandler}
                />
              </Form.Item>

            </Form>
          </div>
        </>
      ) : (
  
        <div className="d-flex align-items-center justify-content-center">
          <span className="p-3">
            Nhập vào người dùng để bắt đầu nhăn tin
          </span>
        </div>
      )}
    </>
  );
};

export default SingleChat;
