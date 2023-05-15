import { useEffect, useState } from "react";
import Chatbox from "../../components/chat/Chatbox";
import MyChats from "../../components/chat/MyChats";
import SideDrawer from "../../components/chat/miscellaneous/SideDrawer";
import { useSelector } from "react-redux";



const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = useSelector(state => state.auth)

  


  return (

        <div className="container mt-1" style={{border:'1px solid #ccc'}}>
        {user && <SideDrawer />}
        <div className="d-flex justify-content-between" style={{height:"91.5vh",padding:'10px',width:'100%'}}>
          {user && <MyChats fetchAgain={fetchAgain} />}
          {user && (
            <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          )}
        </div>
      </div>

  );
};

export default Chatpage;
