import React, {  useState } from 'react';
import axios from '../axios';
// import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

function Ch() {
    Pusher.logToConsole = true;
    var pusher = new Pusher('c792b64a837850229f3a', {
        cluster: 'eu'
      });
  
    var channel = pusher.subscribe('chat');
    channel.bind('MessageSent', function(data) {
        console.log(JSON.stringify(data));
    });
  
    const [message, setMessage] = useState('');

    const sendMessage = async () => {
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
                {/* {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))} */}
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
