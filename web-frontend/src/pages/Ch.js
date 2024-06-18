import React, { useEffect, useState } from 'react';
import axios from '../axios';
import '../echo';

function Ch() {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        console.log('Setting up Echo listener');
        const channel = window.Echo.channel('chat')
            .listen('MessageSent', (e) => {
                console.log('Message received: ', e.message);
                setMessages((prevMessages) => [...prevMessages, e.message]);
            });

        // Cleanup listener on component unmount
        return () => {
            console.log('Stopping Echo listener');
            channel.stopListening('MessageSent');
        };
    }, []);

    const sendMessage = async () => {
        console.log('Sending message:', message);
        try {
            await axios.post('/send-message', { message }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
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
