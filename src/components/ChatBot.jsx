import { useState } from 'react';
import { Send } from 'lucide-react';

const ACCENT_COLOR = '#84cc16'; // Green from chevron button

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
      backgroundColor: 'black',
      padding: '24px',
      boxSizing: 'border-box'
    }}>
      {/* Chat input form - centered */}
      <form 
        onSubmit={handleSendMessage}
        style={{
          width: '100%',
          maxWidth: '600px',
          display: 'flex',
          alignItems: 'center',
          position: 'relative'
        }}
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          style={{
            width: '100%',
            height: '64px',
            padding: '0 70px 0 24px',
            backgroundColor: 'black',
            border: 'none',
            borderRadius: '32px',
            color: 'white',
            fontSize: '16px',
            outline: 'none',
            boxShadow: `0 0 0 1px ${ACCENT_COLOR}`,
            transition: 'box-shadow 0.2s ease'
          }}
          onFocus={(e) => {
            e.target.style.boxShadow = `0 0 0 2px ${ACCENT_COLOR}`;
          }}
          onBlur={(e) => {
            e.target.style.boxShadow = `0 0 0 1px ${ACCENT_COLOR}`;
          }}
        />
        <button
          type="submit"
          style={{
            position: 'absolute',
            right: '8px',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: ACCENT_COLOR,
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            boxShadow: `0 2px 8px rgba(132, 204, 22, 0.3)`
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = `0 4px 12px rgba(132, 204, 22, 0.5)`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = `0 2px 8px rgba(132, 204, 22, 0.3)`;
          }}
        >
          <Send color="black" size={20} strokeWidth={2} />
        </button>
      </form>

      {/* Chat messages display (hidden for now, can be shown above input later) */}
      {messages.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          right: '24px',
          bottom: '120px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          padding: '16px'
        }}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.sender === 'user' ? ACCENT_COLOR : 'white',
                color: 'black',
                padding: '10px 16px',
                borderRadius: '12px',
                maxWidth: '70%',
                wordWrap: 'break-word'
              }}
            >
              {msg.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
