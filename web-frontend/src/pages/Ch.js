import React, { useEffect, useState } from 'react';
import api from '../axios';
import '../echo';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        console.log(window.Echo)
        window.Echo.channel('user.' + userId)
            .listen('MessageSent', (e) => {
                setMessages([...messages, e.message]);
            });

        return () => {
            window.Echo.leaveChannel('user.' + userId);
        };
    }, [messages]);

    const sendMessage = async (e) => {
        e.preventDefault();
        await api.post('/send-message', { message, receiver_id: 7 } , {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
        setMessage('');
    };

    return (
        <div>
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index}>{msg.message}</div>
                ))}
            </div>
            <form onSubmit={sendMessage}>
                <input 
                    type="text" 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Chat;
