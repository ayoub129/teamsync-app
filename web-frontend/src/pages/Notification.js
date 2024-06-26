import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import Header from '../components/ui/Header';
import SideBar from '../components/ui/SideBar';

const Notification = () => {
  const navigate = useNavigate();
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate("/login");
    } else {
      fetchFriendRequests();
    }
  }, [navigate]);

  const fetchFriendRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/friend-requests', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setFriendRequests(response.data.friend_requests);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const acceptFriendRequest = async (requestId) => {
    try {
      await axios.post(`/accept-friend-request/${requestId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchFriendRequests();
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <Header toggleSidebar={toggleSidebar} />
      <SideBar setIsSidebarOpen={setIsSidebarOpen} toggleSidebar={toggleSidebar} active="profile" isSidebarOpen={isSidebarOpen} />
    <div className="md:ml-[19%] mx-4 md:mx-8 md:p-8 bg-white shadow-lg">
      <h2 className="text-xl font-semibold my-5">Friend Requests</h2>
      {loading ? (
        <Loader />
      ) : (
        friendRequests.length > 0 ? (
          friendRequests.map(request => (
            <div key={request.id} className="flex items-center justify-between p-2 mb-2 bg-white rounded shadow">
              <div className="flex items-center">
                <img src={request.sender.image} alt={request.sender.name} className="w-10 h-10 rounded-full mr-3" />
                <span>{request.sender.name}</span>
              </div>
              <Button 
                handlePress={() => acceptFriendRequest(request.id)} 
                color="bg-green-500"
              >
                Accept
              </Button>
            </div>
          ))
        ) : (
          <p>No friend requests.</p>
        )
      )}
    </div>
   </>
  );
};

export default Notification;
