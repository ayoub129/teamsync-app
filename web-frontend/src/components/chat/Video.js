import React, { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { JitsiMeeting } from '@jitsi/react-sdk';
import axios from '../../axios';

const Video = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const jitsiContainer = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLeave = async () => {
    const admin = localStorage.getItem('admin');
    if (admin) {
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
    <div ref={jitsiContainer} className='h-screen'>
      <JitsiMeeting
        domain="meet.jit.si"
        roomName={id}
        configOverwrite={{
          prejoinPageEnabled: false,
          startWithAudioMuted: true,
          startWithVideoMuted: true,
        }}
        userInfo={{
          displayName: localStorage.getItem('username'),
        }}
        onReadyToClose={handleLeave}
      />
    </div>
  );
};

export default Video;
