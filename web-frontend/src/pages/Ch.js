import React, { useEffect, useState } from 'react';
import MessageList from '../components/chat/MessageList';
import MessageInput from '../components/chat/MessageInput';
import instance from '../axios'

const Ch = () => {
    const [receiverId, setReceiverId] = useState(null);
    const [users, setUsers] = useState([]);

    // Fetch all users from the backend
    useEffect(() => {
        const fetchUsers = async () => {
            const response = await instance.get('/friends', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setUsers(data.users);
        };

        fetchUsers();
    }, []);

    return (
        <div>
            <h1>Chat Application</h1>
            <div>
                <label>Select User:</label>
                <select
                    value={receiverId || ''}
                    onChange={(e) => setReceiverId(e.target.value)}
                >
                    <option value="" disabled>Select a user</option>
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.name}
                        </option>
                    ))}
                </select>
            </div>
            {receiverId && (
                <>
                    <MessageList receiverId={receiverId} groupId={null} />
                    <MessageInput receiverId={receiverId} groupId={null} />
                </>
            )}
        </div>
    );
};

export default Ch;
