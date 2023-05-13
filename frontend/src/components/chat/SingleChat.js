import "./styles.css";

import { getSender, getSenderFull } from "../../config/ChatLogics";
import { useEffect, useState } from "react";
import axios from "../../axios/axios";

import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../../animations/typing.json";

import io from "socket.io-client";
import { ChatState } from "../../Context/ChatProvider";
import { Button, Spin, Form, Input,notification } from "antd";

const ENDPOINT = "http://localhost:4000"; 
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const { selectedChat, setSelectedChat, user, notify,  setNotify } =
    ChatState();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);

      const { data } = await axios.get(
        `/api/v1/message/${selectedChat._id}`
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      api['error']({
        message: 'Không tải được tin nhắn',
      });
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        setNewMessage("");
        const { data } = await axios.post(
          "/api/v1/message",
          {
            content: newMessage,
            chatId: selectedChat,
          }
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
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

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notify.includes(newMessageRecieved)) {
          setNotify([newMessageRecieved, ...notify]);
          
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
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

  return (
    <>
      {selectedChat ? (
        <>
          {contextHolder}
          <span style={{fontSize:'28px'}} className="px-2 pb-3 w-100 d-flex justify-content-between align-items-center"
          >
            <Button onClick={() => setSelectedChat("")}>
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
                  <Lottie
                    options={defaultOptions}
                    // height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
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
