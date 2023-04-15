import {EyeOutlined} from '@ant-design/icons';
import {Link} from 'react-router-dom'
import { Button, Image, Modal } from "antd";
import { useState } from "react";

const ProfileModal = ({ user, children }) => {
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const hideModal = () => {
    setOpen(false);
  };

  return (
    <>

      <Button style={{display:'flex',alignItems:'center'}} onClick={showModal} ><EyeOutlined/></Button>
    
      <Modal size="large" title={user.name} onCancel={hideModal} onOk={hideModal} open={open} >

          <div className="d-flex flex-column justify-content-between align-items-center">
            <Image
              style={{width:'150px'}}
              src={user.avatar?.url}
              alt={user.name}
            />
            <span
              style ={{fontSize:"28px"}}
            >
              Email: {user.email}
            </span>
            <Link to={`profile/${user._id}`}>Xem thông tin chi tiết</Link>
          </div>      
      </Modal>
    </>
  );
};

export default ProfileModal;
