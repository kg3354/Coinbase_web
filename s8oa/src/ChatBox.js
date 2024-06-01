import React, { useState } from 'react';
import axios from 'axios';
import './App.css';  // Make sure it imports App.css where the styles are combined

function ChatBox({ onClose }) {
  const [message, setMessage] = useState('');
  const [responses, setResponses] = useState([]);
  const [isSending, setIsSending] = useState(false);  // New state to track sending status

  const sendMessage = async () => {
    if (!message || isSending) return;

    setIsSending(true);  // Disable the input and button

    try {
      const response = await axios.post(`http://${window.location.hostname}:3000/api/chat`, { message });
      const data = response.data;
      setResponses(prev => [...prev, { question: message, answer: data.content }]);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      setResponses(prev => [...prev, { question: message, answer: 'Error fetching response from server' }]);
    }

    setTimeout(() => {
      setIsSending(false);  // Re-enable the input and button after 10 seconds
    }, 10000);  // 10 seconds
  };

  return (
    <div className="chat-box-container">
      <span className="chat-box-close" onClick={onClose}>×</span>
      <div className="chat-box-messages">
        {responses.map((response, index) => (
          <div key={index} className="chat-box-message">
            <p><strong>You:</strong> {response.question}</p>
            <p><strong>ChatGPT:</strong> {response.answer}</p>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask ChatGPT here..."
        disabled={isSending}  // Disable input while sending
        className="chat-box-input"
      />
      <button 
        onClick={sendMessage} 
        disabled={isSending} 
        className="chat-box-button"
      >
        Send
      </button> 
    </div>
  );
}

export default ChatBox;
