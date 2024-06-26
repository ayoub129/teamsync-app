import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';
import Echo from 'laravel-echo';
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
        const response = await axios.get('/friends-groups', {
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
          const response = await axios.get(`/messages/${selectedFriendOrGroup.id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          setMessages(response.data.message);
        } catch (error) {
          console.error('Error fetching messages:', error.response ? error.response.data : error.message);
        }
      };

      fetchMessages();

      const echo = new Echo({
        broadcaster: 'pusher',
        key: process.env.REACT_APP_PUSHER_APP_KEY,
        cluster: process.env.REACT_APP_PUSHER_APP_CLUSTER,
        forceTLS: true,
        auth: {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      });

      const channelName = selectedFriendOrGroup.group_id 
          ? `group-chat.${selectedFriendOrGroup.id}`
          : `private-chat.${selectedFriendOrGroup.id}`;

      echo.channel(channelName)
          .listen('MessageSent', (data) => {
            setMessages((prevMessages) => [...prevMessages, data.message]);
          });

      return () => {
        echo.leaveChannel(channelName);
      };
    }
  }, [selectedFriendOrGroup]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    try {
      const response = await axios.post('/send-message', {
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
      <SideBar setIsSidebarOpen={setIsSidebarOpen} toggleSidebar={toggleSidebar} active="chats" isSidebarOpen={isSidebarOpen} />
      <div className="mx-4 md:mx-8 md:ml-[19%] flex">
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
