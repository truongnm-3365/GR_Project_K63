import "./styles.css";
import SingleChat from "./SingleChat";
import { useSelector } from "react-redux";

const isObjectEmpty = (objectName) => {
  if(objectName)
      return Object.keys(objectName).length === 0
  else{
      return true
  }
}


const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = useSelector(state => state.selectedChat)


  let style ={
    display: !isObjectEmpty(selectedChat) ? 'flex' : 'none',
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
