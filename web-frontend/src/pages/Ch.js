import React, { useEffect, useState } from 'react';
import axios from '../axios';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

function Ch() {
    useEffect(() => {
        if (!window.Echo) {
            window.Echo = new Echo({
                broadcaster: 'pusher',
                key: process.env.REACT_APP_PUSHER_KEY,
                cluster: 'eu',
                forceTLS: true
            });
        }

        console.log('Echo instance:', window.Echo);

        const channel = window.Echo.channel('chat');
        console.log('Channel instance:', channel);
        console.log('Available methods on channel:', Object.keys(channel));

        if (typeof channel.listen === 'function') {
            channel.listen('MessageSent', (data) => {
                console.log('Message received: ', data);
                setMessages((prevMessages) => [...prevMessages, data.message]);
            });
        } else {
            console.error('listen method is not available on channel');
        }

        // Cleanup listener on component unmount
        return () => {
            console.log('Stopping Echo listener');
            if (window.Echo && typeof window.Echo.leaveChannel === 'function') {
                window.Echo.leaveChannel('chat');
            }
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
