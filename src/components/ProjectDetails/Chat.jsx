"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '@/config/api';

const Chat = ({ projectId, token, loggedInUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (projectId && token) {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/projects/${projectId}/chat`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setMessages(response.data.messageList);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };

      fetchMessages();
    }
  }, [projectId, token]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && loggedInUser) {
      try {
        const response = await axios.post(`${BASE_URL}/api/message/send`, {
          sendId: loggedInUser.id,
          projectId,
          message: newMessage,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMessages((prevMessages) =>
          Array.isArray(prevMessages) ? [...prevMessages, response.data.message] : [response.data.message]
        );
        setNewMessage(''); // Clear the input after sending the message
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // Format date as desired
  };

  return (
    <div className='flex flex-col h-full border border-gray-300 overflow-y-auto rounded-md shadow-md p-4'>
      <h1 className='text-bold text-xl'>Chat Box</h1>
      <div className='flex-1 overflow-y-auto mb-4 p-2 rounded-md'>
        {messages?.length > 0 ? (
          messages.map((message, index) => (
            <div key={index} className={`mb-2 p-2  rounded-md`}>
              <div className='flex items-center justify-end  p-3 gap-3'>
              
                {/* Display the message content */}
                <p className='text-lg text-white '>{message.message}</p>
                {/* Display sender's initial or any avatar */}
                <span className='text-lg w-8 h-8 bg-transparent border text-white font-semibold flex items-center justify-center rounded-full'>
                  {message.sender?.userName?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className='text-right text-xs text-gray-300'>
                {/* Display the created timestamp */}
                {formatDate(message.createdAt)}
              </div>
            </div>
          ))
        ) : (
          <p className='text-gray-300 text-center'>No messages yet.</p>
        )}
      </div>
      <div className='flex items-center space-x-2'>
        <input
          type='text'
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className='flex-1 border rounded-md p-2 focus:outline-none'
          placeholder='Type your message...'
        />
        <button
          onClick={handleSendMessage}
          className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200'
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
