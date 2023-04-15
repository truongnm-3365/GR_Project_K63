import { Avatar, Card, Space } from "antd";

import './index.css'

const UserListItem = ({ handleFunction, user }) => {

  return (
    <div className="user-list-item"
      onClick={handleFunction}
    >
      <Avatar
        style={{marginRight:'2rem'}}
        size={'large'}
        name={user.name}
        src={user.avatar.url}
      />
      <Space direction='vertical'>
        <span style={{fontSize:'16px'}}>{user.name}</span>
        <span style={{fontSize:'16px'}}>
          <b>Email : </b>
          {user.email}
        </span>
      </Space>
    </div>
  );
};

export default UserListItem;
