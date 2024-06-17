import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { JitsiMeeting } from '@jitsi/react-sdk';
import axios from '../../axios';

const Video = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const jitsiContainer = useRef(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate("/login");
    }
    
    const admin = localStorage.getItem('admin');
    setIsAdmin(admin === 'true');
  }, [navigate]);

  const handleLeave = async () => {
    if (isAdmin) {
      try {
        await axios.post(`/video-chat/archive/${id}`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        navigate("/");
      } catch (error) {
        console.error('Error archiving video chat:', error);
      }
    }
  };

  return (
    <div ref={jitsiContainer} className='my-12 mx-4 md:mx-8 md:ml-[19%] h-[75vh] w-[80%]'>
      <JitsiMeeting
        domain="meet.jit.si" 
        roomName={id}
        configOverwrite={{
          prejoinPageEnabled: false, 
          startWithAudioMuted: false,
          startWithVideoMuted: false,
        }}
        userInfo={{
          displayName: localStorage.getItem('username'), 
        }}
        onReadyToClose={handleLeave} 
      />
      {isAdmin && <div className="admin-message">You are the creator of this video chat</div>}
    </div>
  );
};

export default Video;
