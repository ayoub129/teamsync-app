import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { JitsiMeeting } from '@jitsi/react-sdk';

const Video = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const jitsiContainer = useRef(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [mediaSupported, setMediaSupported] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate("/login");
      return;
    }

    const admin = localStorage.getItem('admin');
    setIsAdmin(admin === '1');

    const randomNum = Math.floor(Math.random() * 1000);
    setRoomName(`${randomNum}-${id}`);

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          console.log('Access to media devices granted');
          setMediaSupported(true);
          // Optionally stop the stream immediately as it's just a test
          stream.getTracks().forEach(track => track.stop());
        })
        .catch(error => {
          console.error('Error accessing media devices:', error);
        });
    } else {
      console.error('getUserMedia is not supported in this browser');
    }
  }, [navigate, id]);

  const handleLeave = () => {
    if (isAdmin) {
      navigate("/");
    }
  };

  if (!mediaSupported) {
    return <p>Your browser does not support media devices or permission was denied.</p>;
  }

  return (
    <div ref={jitsiContainer} id='video-container' className='my-12 mx-4 md:mx-8 md:ml-[19%] h-[75vh] w-[80%]'>
      <JitsiMeeting
        roomName={roomName}
        getIFrameRef={node => {
          if (node) {
            node.style.height = '800px';
          }
        }}
        configOverwrite = {{
          prejoinPageEnabled: false,
          disableModeratorIndicator: true,
          disableThirdPartyRequests: true,
          disableLocalVideoFlip: true,
          backgroundAlpha: 0.5
        }}
        interfaceConfigOverwrite = {{
            VIDEO_LAYOUT_FIT: 'nocrop',
            MOBILE_APP_PROMO: false,
            TILE_VIEW_MAX_COLUMNS: 4
        }}
        userInfo={{
          displayName: localStorage.getItem('username'),
        }}
        lang='en'
        onReadyToClose={handleLeave}
      />
      {isAdmin && <p className="admin-message">You are the creator of this video chat</p>}
    </div>
  );
};

export default Video;
