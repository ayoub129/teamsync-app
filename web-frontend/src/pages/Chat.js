import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';
import Pusher from 'pusher-js';
import Header from '../components/ui/Header';
import SideBar from '../components/ui/SideBar';
import FriendsList from '../components/chat/FriendList';
import MessageArea from '../components/chat/MessageArea';

const Chat = () => {
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get('/api/friends', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setFriends(response.data.friends);
      } catch (error) {
        console.error('Error fetching friends:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  useEffect(() => {
    if (selectedFriend) {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(`/api/messages/${selectedFriend.id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          setMessages(response.data.messages);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };

      fetchMessages();
      const url = process.env.REACT_APP_API_URL_STORAGE

      const pusher = new Pusher('9ada276d3331c72f98a1', {
        cluster: 'eu',
        authEndpoint: `${url}/api/broadcasting/auth`,
        auth: {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      });

      const channel = pusher.subscribe(`private-chat.${selectedFriend.id}`);
      channel.bind('App\\Events\\MessageSent', function (data) {
        console.log(data);
        setMessages((prevMessages) => [...prevMessages, data.message]);
      });

      return () => {
        pusher.unsubscribe(`private-chat.${selectedFriend.id}`);
      };
    }
  }, [selectedFriend]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    try {
      const response = await axios.post('/api/messages', {
        receiver_id: selectedFriend.id,
        message: newMessage,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessages((prevMessages) => [...prevMessages, response.data.message]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="min-h-screen">
      <Header toggleSidebar={toggleSidebar} />
      <SideBar toggleSidebar={toggleSidebar} active="chats" isSidebarOpen={isSidebarOpen} />
      <div className="ml-[19%] mx-8 p-8 flex">
        {loading ? (
          <div className="flex justify-center items-center w-full">
            <div className="loader"></div>
            <span>Loading friends...</span>
          </div>
        ) : (
          <>
            <FriendsList friends={friends} onSelectFriend={setSelectedFriend} />
            {selectedFriend && (
              <MessageArea
                messages={messages}
                onSendMessage={handleSendMessage}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;
