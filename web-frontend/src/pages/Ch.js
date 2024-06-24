import React, { useEffect, useState } from 'react';
import api from '../axios';
import '../echo';
import Pusher from 'pusher-js';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage]  = useState('');
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        Pusher.logToConsole = true;
        let pusher = new Pusher(process.env.REACT_APP_PUSHER_APP_KEY, {
            cluster: process.env.REACT_APP_PUSHER_APP_CLUSTER
        });

        let channel = pusher.subscribe('chat');
        channel.bind('message', (data) => {
            setMessages([...messages, data]);
        });
    })

    const sendMessage = async (e) => {
        e.preventDefault();
        await api.post('/message', { message } , {
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
