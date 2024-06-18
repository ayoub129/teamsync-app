import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { JitsiMeeting } from '@jitsi/react-sdk';

const Video = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const jitsiContainer = useRef(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [roomName, setRoomName] = useState('');
  const domain = "meet.jitsi.si";

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate("/login");
    }
    
    const admin = localStorage.getItem('admin');
    setIsAdmin(admin === '1');

    const randomNum = Math.floor(Math.random() * 1000);
    setRoomName(`${randomNum}-${id}`);

  }, [navigate]);

  const handleLeave = async () => {
    if (isAdmin) {
      navigate("/");
    }
  };

  return (
    <div ref={jitsiContainer} id='video-container' className='my-12 mx-4 md:mx-8 md:ml-[19%] h-[75vh] w-[80%]'>
      <JitsiMeeting
        roomName={roomName}
        getIFrameRef = { node => node.style.height = '800px' }
        // configOverwrite={{
        //   prejoinPageEnabled: false, 
        //   startWithAudioMuted: true,
        //   startWithVideoMuted: true,
        // }}
        userInfo={{
          displayName: localStorage.getItem('username'), 
        }}
        lang='en'
        domain={domain}
        onReadyToClose={handleLeave} 
      />
      {isAdmin && <p className="admin-message">You are the creator of this video chat</p>}
    </div>
  );
};

export default Video;