import React, { useState } from 'react';
import './ChatBox.css';

const ChatBox = ({ onRestart }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (inputValue.trim() === '') return;
    setMessages([...messages, { text: inputValue, sender: 'user' }]);
    setInputValue(''); // Clear the input field
    // Simulate a GPT response
    setTimeout(() => {
      setMessages(prevMessages => [...prevMessages, { text: 'This is a response from GPT', sender: 'gpt' }]);
    }, 1000);
  };

  const handleRestart = () => {
    setMessages([]);
    if (onRestart) onRestart();
  };

  return (
    <div className="chat-box-container">
      <div className="chat-box-header">
        <h2>Chat with GPT</h2>
        <button className="chat-box-restart" onClick={handleRestart}>Restart</button>
      </div>
      <div className="chat-box-messages">
        {messages.map((message, index) => (
          <div key={index} className={`chat-box-message ${message.sender}`}>
            <span className="sender-label">{message.sender === 'user' ? 'User' : 'GPT'}: </span>
            {message.text}
          </div>
        ))}
      </div>
      <div className="chat-box-input-container">
        <input 
          type="text" 
          className="chat-box-input" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
        />
        <button className="chat-box-button" onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
