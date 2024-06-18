import React, { useEffect, useState } from 'react';
import axios from '../axios';
import '../echo';

function Ch() {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        window.Echo.channel('chat')
            .listen('MessageSent', (e) => {
                setMessages([...messages, e.message]);
            });
    }, [messages]);

    const sendMessage = async () => {
        await axios.post('/send-message', { message });
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
