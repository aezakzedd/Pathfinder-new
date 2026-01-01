import { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

const ACCENT_COLOR = '#84cc16'; // Green from chevron button

export default function ChatBot() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const suggestions = [
    'Create a 5-day Catanduanes itinerary',
    'Romantic getaway in Puraran Beach',
    'One-day Virac city tour',
    'Best beaches in Catanduanes'
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      setMessages([...messages, { text: message, sender: 'user' }]);
      setMessage('');
      setShowSuggestions(false);
      
      // Simulate bot response (replace with actual API call later)
      setTimeout(() => {
        setMessages(prev => [...prev, { text: 'This is a bot response', sender: 'bot' }]);
      }, 500);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setMessage(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      alignItems: 'center',
      backgroundColor: 'black',
      padding: '0',
      boxSizing: 'border-box',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Initial state with suggestions */}
      {showSuggestions && messages.length === 0 && (
        <>
          {/* Header - positioned higher */}
          <div style={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'clamp(16px, 3vh, 24px)',
            width: '90%',
            maxWidth: '600px'
          }}>
            {/* Icon */}
            <div style={{
              width: 'clamp(40px, 6vw, 48px)',
              height: 'clamp(40px, 6vw, 48px)',
              borderRadius: '50%',
              backgroundColor: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Sparkles color="black" size={24} strokeWidth={2} />
            </div>

            {/* Heading only */}
            <h2 style={{
              color: 'white',
              fontSize: 'clamp(18px, 3vw, 24px)',
              fontWeight: '600',
              margin: '0',
              textAlign: 'center'
            }}>
              How can we help you?
            </h2>
          </div>

          {/* Suggestion chips - directly above input */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            justifyContent: 'flex-end',
            width: '90%',
            maxWidth: '600px',
            marginBottom: '16px',
            padding: '0 8px'
          }}>
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '20px',
                  color: 'white',
                  fontSize: 'clamp(11px, 1.8vw, 14px)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = ACCENT_COLOR;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Chat messages display */}
      {messages.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          right: '16px',
          bottom: '80px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
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
                wordWrap: 'break-word',
                fontSize: 'clamp(12px, 2vw, 14px)'
              }}
            >
              {msg.text}
            </div>
          ))}
        </div>
      )}

      {/* Chat input form - always at bottom */}
      <form 
        onSubmit={handleSendMessage}
        style={{
          width: '90%',
          maxWidth: '600px',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          marginBottom: '16px',
          padding: '0 8px'
        }}
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask Anything"
          style={{
            width: '100%',
            height: 'clamp(48px, 7vh, 56px)',
            padding: '0 60px 0 20px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '28px',
            color: 'white',
            fontSize: 'clamp(13px, 2vw, 15px)',
            outline: 'none',
            transition: 'all 0.2s ease'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = ACCENT_COLOR;
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
          }}
        />
        <button
          type="submit"
          style={{
            position: 'absolute',
            right: '12px',
            width: 'clamp(40px, 6vw, 48px)',
            height: 'clamp(40px, 6vw, 48px)',
            borderRadius: '50%',
            backgroundColor: 'transparent',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            flexShrink: 0
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = ACCENT_COLOR;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <Send color="white" size={20} strokeWidth={2} />
        </button>
      </form>
    </div>
  );
}
