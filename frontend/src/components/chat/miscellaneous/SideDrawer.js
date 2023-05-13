import { Drawer, Button, Input, Tooltip, Spin, notification  } from 'antd';
import { useEffect, useState } from "react";
import axios from "../../../axios/axios";
import ChatLoading from "../ChatLoading";
import { getSender } from "../../../config/ChatLogics";
import UserListItem from "../userAvatar/UserListItem";
import { ChatState } from "../../../Context/ChatProvider";
import { useSelector } from 'react-redux';
import { useAlert } from 'react-alert';

function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [open, setOpen] = useState(false);

  const alert = useAlert();

  const { user } = useSelector(state => state.auth)
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const {
    setSelectedChat,
    chats,
    setChats,
  } = ChatState();

  useEffect(async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(`/api/v1/user?search=${search}`);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      alert.error('Tìm kiếm thất bại')
    }
  },[])

  const handleSearch = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(`/api/v1/user?search=${search}`);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      alert.error("Tìm kiếm thất bại")
    }
  };

  const accessChat = async (userId) => {

    try {
      setLoadingChat(true);

      const { data } = await axios.post(`/api/v1/chat`, { userId });

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      alert.error('Không tải được chat')
    }
  };


  return (
    <>
      <div style={{background:'white',borderWidth:'5px'}} className="d-flex justify-content-between align-items-center w-100 px-5 py-10 mt-4" >
          <Tooltip title="Tìm kiếm người để nhắn tin"  placement="bottomRight">
            <Button variant="ghost" onClick={showDrawer}>
              <i className="fa fa-search"></i>
              <span className="px-4">
                Danh sách người có thể nhắn tin
              </span> 
            </Button>
          </Tooltip>
      </div>

      <Drawer placement="left" title="Tìm kiếm người dùng" onClose={onClose} open={open}>
            <div className='d-flex p-2'>
              <Input
                placeholder="Tìm kiếm bằng tên hoặc email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Tìm kiếm</Button>
            </div>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((item) => (
                <UserListItem
                  key={item._id}
                  user={item}
                  handleFunction={() => accessChat(item._id)}
                />
              ))
            )}
            {loadingChat && <Spin style={{display:'flex', marginLeft:'auto'}} />}
         
       
      </Drawer>
    </>
  );
}

export default SideDrawer;
