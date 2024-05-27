import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

const ChannelMembers = ({ members, setMembers }) => {
  const userId = localStorage.getItem('user_id');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingMemberId, setLoadingMemberId] = useState(null);

  useEffect(() => {
    const fetchFriendStatuses = async () => {
      try {
        const memberIds = members.map(member => member.id);
        const response = await axios.post(`http://localhost:8000/api/friend-statuses`, { members: memberIds }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        const statuses = response.data.statuses;
        const updatedMembers = members.map(member => ({
          ...member,
          status: statuses[member.id] || 'not_friends'
        }));

        setMembers(updatedMembers);
      } catch (error) {
        console.error('Error fetching friend statuses:', error);
      }
    };

    fetchFriendStatuses();
  }, [members, setMembers]);

  const handleMemberAction = async (memberId, status) => {
    setLoading(true);
    setLoadingMemberId(memberId);
    if (status === 'not_friends') {
      try {
        await axios.post(`http://localhost:8000/api/send-friend-request`, { receiver_id: memberId }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        setMembers(members.map(member => 
          member.id === memberId ? { ...member, status: 'request_sent' } : member
        ));
      } catch (error) {
        console.error('Error sending friend request:', error);
      } finally {
        setLoading(false);
        setLoadingMemberId(null);
      }
    } else if (status === 'friends') {
      navigate('/chat');
    }
  };

  const getMemberActionText = (status) => {
    switch (status) {
      case 'not_friends':
        return 'Add Friend';
      case 'request_sent':
        return 'Request Sent';
      case 'friends':
        return 'Message';
      default:
        return 'Add Friend';
    }
  };

  return (
    <div className="h-[500px] p-4 bg-white shadow-lg overflow-y-scroll">
      <h2 className='text-xl font-semibold my-5'>Channel Members</h2>
      {members.map(member => (
        <div key={member.id} className="flex items-center justify-between p-2 mb-2 bg-white rounded shadow">
          <div className="flex items-center">
            <img src={"https://images.unsplash.com/photo-1581382575275-97901c2635b7?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} alt={member.name} className="w-10 h-10 rounded-full mr-3" />
            <span>{member.name}</span>
          </div>
          {member.id !== parseInt(userId, 10) && (
            <Button 
              handlePress={() => handleMemberAction(member.id, member.status)} 
              color="bg-sky-500"
              disabled={loading && loadingMemberId === member.id}
            >
              {loading && loadingMemberId === member.id ? 'Loading...' : getMemberActionText(member.status)}
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChannelMembers;
