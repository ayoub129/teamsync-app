import React, { useEffect, useState } from 'react';
import axios from '../../axios';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import Loader from '../ui/Loader';

const GroupMembers = ({ groupId }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem('user_id');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/groups/${groupId}/members`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setMembers(response.data.members);
      } catch (error) {
        console.error('Error fetching members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [groupId]);

  useEffect(() => {
    const fetchFriendStatuses = async () => {
      try {
        const memberIds = members.map(member => member.id);
        const response = await axios.post(`/friend-statuses`, { members: memberIds }, {
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

    if (members.length > 0) {
      fetchFriendStatuses();
    }
  }, [members]);

  const handleMemberAction = async (memberId, status) => {
    if (status === 'not_friends') {
      try {
         await axios.post(`/send-friend-request`, { receiver_id: memberId }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setMembers(members.map(member => 
          member.id === memberId ? { ...member, status: 'request_sent' } : member
        ));
      } catch (error) {
        console.error('Error sending friend request:', error);
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
    <div className="p-4 bg-white shadow-lg h-[500px] overflow-y-auto">
      <h2 className='text-xl font-semibold my-5'>Group Members</h2>
      {loading ? (
        <Loader />
      ) : (
        members.map(member => (
          <div key={member.id} className="flex items-center justify-between p-2 mb-2 bg-white rounded shadow">
            <div className="flex items-center">
              <img src={member.image ? member.image : "https://via.placeholder.com/40"} alt={member.name} className="w-10 h-10 rounded-full mr-3" />
              <span>{member.name}</span>
            </div>
            {member.id !== parseInt(userId , 10) && (
              <Button handlePress={() => handleMemberAction(member.id, member.status)} color="bg-sky-500">
                {getMemberActionText(member.status)}
              </Button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default GroupMembers;
