import React, { useState } from 'react';
import instance from '../../axios';

const MessageInput = ({ receiverId, groupId }) => {
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { message };
        if (receiverId) payload.receiver_id = receiverId;
        if (groupId) payload.group_id = groupId;

        await instance.post('/messages', {
            body: JSON.stringify(payload)
        },
        {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        setMessage('');
    };


    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message"
                required
            />
            <button type="submit">Send</button>
        </form>
    );
};

export default MessageInput;