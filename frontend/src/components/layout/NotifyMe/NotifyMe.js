import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

import Overlay from "react-bootstrap/Overlay";
import Popover from "react-bootstrap/Popover";
import Button from "react-bootstrap/Button";

import moment from "moment";
import {Link} from "react-router-dom"

import { reactLocalStorage } from "reactjs-localstorage";

import { Bell, BellOff, BookOpen, AlertTriangle } from "react-feather";

import "bootstrap/dist/css/bootstrap.min.css";
import "./NotifyMe.css";

const NotifyMe = (props) => {
  moment.locale(navigator.languages[0].toLowerCase());

  // State variabls
  const [showCount, setShowCount] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [show, setShow] = useState(false);
  const [target, setTarget] = useState(null);
  const [raedIndex, setReadIndex] = useState(0);

  // Useref for the overlay
  const ref = useRef(null);


  // Props passed to the component
  const data = props.data;
  const storageKey = props.storageKey || "notification_timeline_storage_id";
  const key = props.notific_key;
  const notificationMsg = props.notific_value;
  const sortedByKey = props.sortedByKey;
  const heading = props.heading || "Thông báo";
  const bellSize = props.size || 32;
  const bellColor = props.color || "#FFFFFF";
  const multiLineSplitter = props.multiLineSplitter || "\n";
  const showDate = props.showDate || false;
  const deleteNotifiesHandler = props.deleteNotifiesHandler;

  useEffect(() => {
    if (!sortedByKey) {
      data.sort((a, b) => b[key] - a[key]);
    }

    let readItemLs = reactLocalStorage.getObject(storageKey);
    let readMsgId = Object.keys(readItemLs).length > 0 ? readItemLs["id"] : "";

  
    let readIndex =
      readMsgId === ""
        ? data.length
        : data.findIndex((elem) => elem[key] === readMsgId);

    if(readIndex === -1){
        readIndex = data.length
    } 

    setReadIndex(readIndex);

    (data.length && readIndex) > 0 ? setShowCount(true) : setShowCount(false);
    setMessageCount(readIndex);
  }, [data]);

  const handleClick = (event) => {
    setShow(!show);
    setTarget(event.target);
  };

  // Calculate the day diff
  const getDayDiff = (timestamp) => {
    let a = moment();
    let b = moment(timestamp);
    let diff = a.diff(b, "year");
    if (diff === 0) {
      diff = a.diff(b, "month");
      if (diff === 0) {
        diff = a.diff(b, "days");
        if (diff === 0) {
          diff = a.diff(b, "hour");
          if (diff === 0) {
            diff = a.diff(b, "minute");
            if (diff === 0) {
              diff = a.diff(b, "second");
              return `${diff} giây trước`;
            } else {
              return `${diff} phút trước`;
            }
          } else {
            return `${diff} giờ trước`;
          }
        } else {
          return `${diff} ngày trước`;
        }
      } else {
        return `${diff} tháng trước`;
      }
    } else {
      return `${diff} năm trước`;
    }
  };

  const getWhen = (timestamp) => {
    let when = `${moment(timestamp).format("L")} ${moment(timestamp).format(
      "LTS"
    )}`;
    return when;
  };

  // Get the notification message
  const getContent = (message) => {
    
    if (message.indexOf(multiLineSplitter) >= 0) {
      let splitted = message.split(multiLineSplitter);
      let ret = "<ul>";

      for (let i = 0; i <= splitted.length - 1; i++) {
        if (splitted[i] !== "") {
          ret = ret + "<li>" + splitted[i] + "</li>";
        }
      }

      ret = ret + "</ul>";
      return {
        __html: ret
      };
    }
    return {
      __html: `<ul><li>${message}</li></ul>`
    };
  };

  // Hide the notification on clicking outside
  const hide = () => {
    setShow(false);
  };

  // Call the function when mark as read link is clicked
  const markAsRead = () => {
    setShowCount(false);
    reactLocalStorage.setObject(storageKey, { id: data[0][key] });
    setReadIndex(0);
  };

  return (
    <>
      <div className="notification-container">
        <div
          className={
            showCount ? "notification notify show-count" : "notification notify"
          }
          data-count={messageCount}
          onClick={(event) => handleClick(event)}
        >
          <Bell color={bellColor} size={bellSize} />
        </div>
      </div>

      <div ref={ref}>
        <Overlay
          show={show}
          target={target}
          placement="bottom"
          container={ref.current}
          containerPadding={20}
          rootClose={true}
          onHide={hide}
        >
          <Popover id="popover-contained">
            <Popover.Title as="h3">{heading}</Popover.Title>
            <Popover.Content style={{ padding: "3px 3px" }}>
              {showCount && (
                <div>
                  <Button variant="link" onClick={deleteNotifiesHandler}>
                    <BookOpen size={24} />
                        {' '}Đánh dấu đã đọc tất cả
                  </Button>
                </div>
              )}
              <ul className="notification-info-panel">
                {data.length > 0 ? (
                  data.map((message, index) => (
                    <li
                      className={
                        index < raedIndex
                          ? "notification-message unread"
                          : "notification-message"
                      }
                      key={index}
                    >
                      <Link to= {`/course/${message['course']}`}>
                        <div className="timestamp">
                          <span style={{paddingLeft: '8px'}}>{getDayDiff(message[key])}</span>
                          {showDate && (
                            <span>
                              {" ("}
                              {getWhen(message[key])}
                              {")"}
                            </span>
                          )}
                        </div>
                        <div
                          className="content"
                          dangerouslySetInnerHTML={getContent(
                            message[notificationMsg]
                          )}
                        />
                      </Link>

                    </li>
                  ))
                ) : (
                  <>
                    <AlertTriangle color="#000000" size={32} />
                    <h6 className="nodata">Không tìm thấy thông báo</h6>
                  </>
                )}
              </ul>
            </Popover.Content>
          </Popover>
        </Overlay>
      </div>
    </>
  );
};

NotifyMe.prototype = {
  storageKey: PropTypes.string,
  notific_key: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  notific_value: PropTypes.string.isRequired,
  sortedByKey: PropTypes.bool,
  color: PropTypes.string,
  size: PropTypes.string,
  heading: PropTypes.string,
  multiLineSplitter: PropTypes.string,
  showDate: PropTypes.bool
};

export default NotifyMe;
