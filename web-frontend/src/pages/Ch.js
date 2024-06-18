import React, { useEffect, useState } from 'react';
import axios from '../axios';
import '../echo';

function Ch() {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    const getMessages = () => {
        window.Echo.channel('chat')
        .listen('MessageSent', (e) => {
            console.log(e)
            setMessages([...messages, e.message]);
        });

    }

    useEffect(() => {
        getMessages()
    }, [messages]);

    const sendMessage = async () => {
        await axios.post('/send-message', { message } , {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        getMessages()
        setMessage('');
    };

    return (
        <div>
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}

export default Ch;
