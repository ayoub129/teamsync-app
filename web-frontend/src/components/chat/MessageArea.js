import React from 'react';

const MessageArea = ({ messages, onSendMessage, newMessage, setNewMessage }) => {
  console.log(messages)
  console.log(newMessage)
  return (
    <div className="w-2/3 p-4 bg-white shadow-lg flex flex-col h-[80%] overflow-y-scroll">
      <div className="flex-grow overflow-y-auto mb-4">
        {messages && messages.map((message) => (
          <div
            key={message.id}
            className={`p-2 mb-3 ${message.sender_id === parseInt(localStorage.getItem('user_id')) ? 'bg-blue-100' : 'bg-gray-100'} rounded`}
          >
            <p>{message.message}</p>
            <span className="text-xs text-gray-500">{new Date(message.created_at).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow p-2 border rounded-l"
          placeholder="Type a message"
        />
        <button onClick={onSendMessage} className="bg-blue-500 text-white p-2 rounded-r">
          Send
        </button>
      </div>
    </div>
  );
};

export default MessageArea;