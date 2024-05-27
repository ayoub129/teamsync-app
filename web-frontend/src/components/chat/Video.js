import React, { useEffect, useRef, useState } from 'react';
import Pusher from 'pusher-js';
import SimplePeer from 'simple-peer';

const Video = () => {
  const localVideoRef = useRef(null);
  const [peers, setPeers] = useState([]);
  const [stream, setStream] = useState(null);
  const peersRef = useRef([]);
  const pusher = useRef(null);
  const roomId = 'your-room-id'; // Use a unique room ID

  useEffect(() => {
    pusher.current = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
      cluster: process.env.REACT_APP_PUSHER_CLUSTER,
      encrypted: true,
    });

    const channel = pusher.current.subscribe('video-chat');
    channel.bind('user-joined', handleUserJoined);
    channel.bind('signal', handleReceiveSignal);
    channel.bind('user-disconnected', handleUserDisconnected);

    startLocalStream();

    return () => {
      pusher.current.unsubscribe('video-chat');
    };
  }, []);

  const startLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(stream);
      localVideoRef.current.srcObject = stream;
      sendMessage('user-joined', { roomId });
    } catch (err) {
      console.error('Error accessing media devices.', err);
    }
  };

  const createPeer = (peerId, initiator = false) => {
    const peer = new SimplePeer({
      initiator,
      trickle: false,
      stream,
    });

    peer.on('signal', signal => {
      sendMessage('signal', { peerId, signal });
    });

    peer.on('error', err => {
      console.error('Peer error:', err);
    });

    peer.on('close', () => {
      console.log('Peer connection closed');
    });

    peer.on('connect', () => {
      console.log('Peer connected');
    });

    return peer;
  };

  const handleUserJoined = ({ peerId }) => {
    const peer = createPeer(peerId, true);
    peersRef.current.push({ peerId, peer });
    setPeers(users => [...users, { peerId, peer }]);
  };

  const handleReceiveSignal = ({ peerId, signal }) => {
    const peerObj = peersRef.current.find(p => p.peerId === peerId);
    if (peerObj) {
      peerObj.peer.signal(signal);
    }
  };

  const handleUserDisconnected = ({ peerId }) => {
    const peerObj = peersRef.current.find(p => p.peerId === peerId);
    if (peerObj) {
      peerObj.peer.destroy();
    }
    setPeers(users => users.filter(p => p.peerId !== peerId));
  };

  const sendMessage = (event, data) => {
    fetch('http://localhost:8000/api/pusher/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ event, data }),
    });
  };

  const startCall = async () => {
    const peer = createPeer('self', true);
    peersRef.current.push({ peerId: 'self', peer });
    setPeers(users => [...users, { peerId: 'self', peer }]);

    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);

    sendMessage('new-offer', { offer });
  };

  const toggleAudio = () => {
    const enabled = stream.getAudioTracks()[0].enabled;
    stream.getAudioTracks()[0].enabled = !enabled;
  };

  const toggleVideo = () => {
    const enabled = stream.getVideoTracks()[0].enabled;
    stream.getVideoTracks()[0].enabled = !enabled;
  };

  const shareScreen = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const videoTrack = screenStream.getVideoTracks()[0];
      const sender = peersRef.current[0].peer.getSenders().find(s => s.track.kind === 'video');
      sender.replaceTrack(videoTrack);

      videoTrack.onended = () => {
        sender.replaceTrack(stream.getVideoTracks()[0]);
      };
    } catch (err) {
      console.error('Error sharing screen.', err);
    }
  };

  return (
    <div className='ml-[19%] mx-8 p-8'>
      <h2>Video Chat Room</h2>
      <div className="video-container">
        <video ref={localVideoRef} autoPlay playsInline muted className="local-video"></video>
        {peers.map((peerObj, index) => (
          <VideoPeer key={index} peer={peerObj.peer} />
        ))}
      </div>
      <button onClick={startCall} className="btn btn-primary mt-4">Start Call</button>
      <div className="controls">
        <button onClick={toggleAudio}>Toggle Audio</button>
        <button onClick={toggleVideo}>Toggle Video</button>
        <button onClick={shareScreen}>Share Screen</button>
      </div>
    </div>
  );
};

const VideoPeer = ({ peer }) => {
  const ref = useRef();

  useEffect(() => {
    peer.on('stream', stream => {
      ref.current.srcObject = stream;
    });

    return () => {
      peer.destroy();
    };
  }, [peer]);

  return <video autoPlay playsInline ref={ref} />;
};

export default Video;
