import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';
import Pusher from 'pusher-js';
import Header from '../components/ui/Header';
import SideBar from '../components/ui/SideBar';
import FriendsList from '../components/chat/FriendList';
import MessageArea from '../components/chat/MessageArea';

const Chat = () => {
  const [friendsAndGroups, setFriendsAndGroups] = useState({ friends: [], groups: [] });
  const [selectedFriendOrGroup, setSelectedFriendOrGroup] = useState(null);
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
    const fetchFriendsAndGroups = async () => {
      try {
        const response = await axios.get('/api/friends-groups', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setFriendsAndGroups(response.data);
      } catch (error) {
        console.error('Error fetching friends and groups:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriendsAndGroups();
  }, []);

  useEffect(() => {
    if (selectedFriendOrGroup) {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(`/api/messages/${selectedFriendOrGroup.id}`, {
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

      const pusher = new Pusher(process.env.REACT_APP_PUSHER_APP_KEY, {
        cluster: process.env.REACT_APP_PUSHER_APP_CLUSTER,
        authEndpoint: `${process.env.REACT_APP_API_URL}/broadcasting/auth`,
        auth: {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      });

      const channel = pusher.subscribe(`private-chat.${selectedFriendOrGroup.id}`);
      channel.bind('App\\Events\\MessageSent', (data) => {
        setMessages((prevMessages) => [...prevMessages, data.message]);
      });

      return () => {
        pusher.unsubscribe(`private-chat.${selectedFriendOrGroup.id}`);
      };
    }
  }, [selectedFriendOrGroup]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    try {
      const response = await axios.post('/api/messages', {
        receiver_id: selectedFriendOrGroup.id,
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
            <span>Loading friends and groups...</span>
          </div>
        ) : (
          <>
            <FriendsList 
              friends={friendsAndGroups.friends} 
              groups={friendsAndGroups.groups} 
              onSelectFriendOrGroup={setSelectedFriendOrGroup} 
            />
            {selectedFriendOrGroup && (
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
