import React, { useEffect, useState } from 'react';
import echo from '../../echo';
import instance from '../../axios';

const MessageList = ({ receiverId, groupId }) => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchMessages = async () => {
            let url = '';
            if (receiverId) {
                url = `/messages?receiver_id=${receiverId}`;
            } else if (groupId) {
                url = `/messages?group_id=${groupId}`;
            }
            const response = await instance.get(url , {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setMessages(response.data.messages);
            console.log(response.data.messages)
        };

        fetchMessages();

        // Listen for new messages
        const channel = receiverId ? `private-chat.${receiverId}` : `group-chat.${groupId}`;
        echo.private(channel).listen('MessageSent', (e) => {
            setMessages((prevMessages) => [...prevMessages, e.message]);
        });

        return () => {
            echo.leaveChannel(channel);
        };
    }, [receiverId, groupId]);

    return (
        <div>
            {messages.map((message) => (
                <div key={message.id}>
                   {message.message}
                </div>
            ))}
        </div>
    );
};

export default MessageList;
