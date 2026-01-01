import { useState } from 'react';
import { Send } from 'lucide-react';

export default function ChatBot() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      setMessages([...messages, { text: message, sender: 'user' }]);
      setMessage('');
      
      // Simulate bot response (replace with actual API call later)
      setTimeout(() => {
        setMessages(prev => [...prev, { text: 'This is a bot response', sender: 'bot' }]);
      }, 500);
    }
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '24px',
      boxSizing: 'border-box',
      backgroundColor: 'black'
    }}>
      {/* Chat messages container */}
      <div style={{
        width: '100%',
        maxWidth: '600px',
        height: '60%',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '16px',
        marginBottom: '16px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {messages.length === 0 ? (
          <div style={{
            color: 'rgba(255, 255, 255, 0.4)',
            textAlign: 'center',
            marginTop: 'auto',
            marginBottom: 'auto',
            fontSize: '14px'
          }}>
            Start a conversation...
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.sender === 'user' ? '#84cc16' : 'white',
                color: msg.sender === 'user' ? 'black' : 'black',
                padding: '10px 16px',
                borderRadius: '12px',
                maxWidth: '70%',
                wordWrap: 'break-word'
              }}
            >
              {msg.text}
            </div>
          ))
        )}
      </div>

      {/* Chat input form */}
      <form 
        onSubmit={handleSendMessage}
        style={{
          width: '100%',
          maxWidth: '600px',
          display: 'flex',
          gap: '12px',
          alignItems: 'center'
        }}
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: '12px 16px',
            backgroundColor: 'black',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '24px',
            color: 'white',
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.2s ease'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#84cc16';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }}
        />
        <button
          type="submit"
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: '#84cc16',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            boxShadow: '0 2px 8px rgba(132, 204, 22, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(132, 204, 22, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(132, 204, 22, 0.3)';
          }}
        >
          <Send color="black" size={20} strokeWidth={2} />
        </button>
      </form>
    </div>
  );
}
