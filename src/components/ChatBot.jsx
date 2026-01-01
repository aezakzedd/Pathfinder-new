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
    'Best family activities in Catanduanes',
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
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'black',
      padding: '24px',
      boxSizing: 'border-box',
      position: 'relative'
    }}>
      {/* Initial state with suggestions */}
      {showSuggestions && messages.length === 0 && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          marginBottom: '40px',
          maxWidth: '600px',
          width: '100%'
        }}>
          {/* Icon */}
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sparkles color="black" size={24} strokeWidth={2} />
          </div>

          {/* Heading */}
          <div style={{ textAlign: 'center' }}>
            <h2 style={{
              color: 'white',
              fontSize: '24px',
              fontWeight: '600',
              margin: '0 0 8px 0'
            }}>
              How can we help you?
            </h2>
            <p style={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '14px',
              margin: '0',
              lineHeight: '1.5'
            }}>
              Planning a trip? I'll help you explore, plan, and discover hidden gems in Catanduanes. Where to?
            </p>
          </div>

          {/* Suggestion chips */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            justifyContent: 'center'
          }}>
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '24px',
                  color: 'white',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
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
        </div>
      )}

      {/* Chat messages display */}
      {messages.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          right: '24px',
          bottom: '100px',
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

      {/* Chat input form - always at bottom */}
      <form 
        onSubmit={handleSendMessage}
        style={{
          width: '100%',
          maxWidth: '600px',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          marginTop: 'auto'
        }}
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask Anything"
          style={{
            width: '100%',
            height: '56px',
            padding: '0 60px 0 24px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '28px',
            color: 'white',
            fontSize: '15px',
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
            right: '4px',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = ACCENT_COLOR;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
          }}
        >
          <Send color="white" size={20} strokeWidth={2} />
        </button>
      </form>
    </div>
  );
}
