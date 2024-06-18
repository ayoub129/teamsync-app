import React, { useEffect, useState } from 'react';
import axios from '../axios';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

function Ch() {
    useEffect(() => {
        window.Echo = new Echo({
            broadcaster: 'pusher',
            key: process.env.REACT_APP_PUSHER_KEY,
            cluster: 'eu',
            forceTLS: true
        });

        // Log the Echo instance to check its properties
        console.log('Echo instance:', window.Echo);

        const channel = window.Echo.channel('chat')
            .listen('MessageSent', (data) => {
                console.log('Message received: ', data);
                setMessages((prevMessages) => [...prevMessages, data.message]);
            });

        // Cleanup listener on component unmount
        return () => {
            console.log('Stopping Echo listener');
            channel.stopListening('MessageSent');
        };
    }, []);

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

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