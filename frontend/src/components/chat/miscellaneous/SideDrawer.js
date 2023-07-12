import { Drawer, Button, Input, Tooltip, Spin, notification  } from 'antd';
import { useEffect, useState } from "react";
import ChatLoading from "../ChatLoading";
import UserListItem from "../userAvatar/UserListItem";
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import { getAccessChat, getSearchChat, setSeletedChat } from '../../../actions/chatAction';

function SideDrawer() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const alert = useAlert();
  const dispatch = useDispatch();

  const { searchResult, loading} = useSelector(state => state.searchChat)
  const { loading:loadingChat,accessChat:chat ,success} = useSelector(state => state.accessChat)

  const { user } = useSelector(state => state.auth)
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };


  useEffect(async () => {
    try {
      dispatch(getSearchChat(search));
    } catch (error) {
      alert.error('Tìm kiếm thất bại')
    }
    dispatch(setSeletedChat(chat));

  },[dispatch,chat])

  const handleSearch = async () => {
    try {
      dispatch(getSearchChat(search));
    } catch (error) {
      alert.error("Tìm kiếm thất bại")
    }
  };

  const accessChat = (userId) => {
    
    try {
      dispatch(getAccessChat(userId))
      
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
                  handleFunction={() => {accessChat(item._id);}}
                />
              ))
            )}
            {loadingChat && <Spin style={{display:'flex', marginLeft:'auto'}} />}
         
       
      </Drawer>
    </>
  );
}

export default SideDrawer;
