import "./styles.css";
import SingleChat from "./SingleChat";
import { ChatState } from "../../Context/ChatProvider";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  let style ={
    display: selectedChat ? 'flex' : 'none',
    alignItems:'center',
    flexDirection: 'column',
    padding:'10px',
    background:'white',

    borderRadius:'10px',
    borderWidth:'1px'
  }

  return (
    <div className="col-12 col-md-9" style={style}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  );
};

export default Chatbox;
