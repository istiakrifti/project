import React, { useState, useEffect } from 'react';
import { FaBell } from 'react-icons/fa';
import { useUser } from './UserCntxt';
import './UserNotification.css';
import axios from 'axios';

function Notification(props) {
  const [showOffCanvas, setShowOffCanvas] = useState(false);
  const { userRole } = useUser();
  const [msg, setMsg] = useState({info:[]});


  const handleNotificationClick = () => {
    setShowOffCanvas(!showOffCanvas);
    localStorage.setItem('newMsg','false');
    const user = props.user;
    axios.post('http://localhost:3000/usernotification', { user })
        .then(res => {
          setMsg({info:res.data});
        })
        .catch(err => console.log(err));
  };

  const handleCloseOffCanvas = () => {
    setShowOffCanvas(false);
  };

  return (
    <div>
      {userRole === 'customer' ? (
        <div className={`notification-icon ${showOffCanvas ? 'active' : ''}`} style={localStorage.getItem('newMsg')==='true'?{backgroundColor:'red'}:{backgroundColor:'#05305e'}}onClick={handleNotificationClick}>
          <FaBell />
          
        </div>
      ) : ''}
      {showOffCanvas && (
        <div className="off-canvas">
          <div className="off-canvas-content">
            <h2 style={{color:'yellow'}}><b>Notifications</b></h2>
            <ul>
              {msg.info.map((message, index) => (
                <li key={index}><div className="message-text">{message.MESSAGE}</div>
                <div className="message-time">
                  {new Date(message.RECEIVE_DATE).toLocaleString()}
                </div></li>
              ))}
            </ul>
            <button className="offcanvas-close" onClick={handleCloseOffCanvas}>
        &times;
      </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notification;
