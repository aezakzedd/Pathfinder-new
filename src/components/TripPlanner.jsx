import { useState } from 'react';
import { Calendar } from 'lucide-react';

export default function TripPlanner() {
  const [dateRange, setDateRange] = useState('Nov 30 - Dec 2');
  const [budget, setBudget] = useState(5000);
  const [activities, setActivities] = useState({
    swimming: false,
    hiking: false,
    sightseeing: false,
    waterfalls: false,
    historical: false
  });
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch weather data for Catanduanes
  useState(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Virac,Catanduanes,PH&units=metric&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
        );
        const data = await response.json();
        setWeather(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching weather:', error);
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  const handleActivityChange = (activity) => {
    setActivities(prev => ({
      ...prev,
      [activity]: !prev[activity]
    }));
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      overflowY: 'auto',
      padding: '8px'
    }}>
      {/* Journey Dates Card */}
      <div style={{
        backgroundColor: '#1f2937',
        borderRadius: '12px',
        padding: '16px'
      }}>
        <h3 style={{
          color: 'white',
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '12px'
        }}>Journey Dates</h3>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#374151',
          padding: '10px',
          borderRadius: '8px'
        }}>
          <Calendar size={16} color="white" />
          <input
            type="text"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '14px',
              outline: 'none',
              flex: 1
            }}
          />
        </div>
        <p style={{
          color: '#9ca3af',
          fontSize: '11px',
          marginTop: '8px'
        }}>Selected period is 3 days to Catanduanes</p>
      </div>

      {/* Budget Card */}
      <div style={{
        backgroundColor: '#1f2937',
        borderRadius: '12px',
        padding: '16px'
      }}>
        <h3 style={{
          color: 'white',
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '12px'
        }}>Budget</h3>
        <input
          type="range"
          min="1000"
          max="50000"
          step="1000"
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          style={{
            width: '100%',
            accentColor: '#84cc16'
          }}
        />
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '8px'
        }}>
          <span style={{ color: '#9ca3af', fontSize: '11px' }}>₱1,000</span>
          <span style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>₱{budget.toLocaleString()}</span>
          <span style={{ color: '#9ca3af', fontSize: '11px' }}>₱50,000</span>
        </div>
        <p style={{
          color: '#9ca3af',
          fontSize: '11px',
          marginTop: '4px',
          textAlign: 'center'
        }}>Price range for your trip</p>
      </div>

      {/* Weather Card */}
      <div style={{
        backgroundColor: '#1f2937',
        borderRadius: '12px',
        padding: '16px'
      }}>
        <h3 style={{
          color: 'white',
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '12px'
        }}>Weather in Catanduanes</h3>
        {loading ? (
          <p style={{ color: '#9ca3af', fontSize: '12px' }}>Loading weather...</p>
        ) : weather && weather.main ? (
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '8px'
            }}>
              <span style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: 'white'
              }}>{Math.round(weather.main.temp)}°C</span>
              <div>
                <p style={{
                  color: 'white',
                  fontSize: '13px',
                  textTransform: 'capitalize',
                  margin: 0
                }}>{weather.weather[0].description}</p>
                <p style={{
                  color: '#9ca3af',
                  fontSize: '11px',
                  margin: 0
                }}>Feels like {Math.round(weather.main.feels_like)}°C</p>
              </div>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              marginTop: '12px'
            }}>
              <div>
                <p style={{ color: '#9ca3af', fontSize: '10px', margin: 0 }}>Humidity</p>
                <p style={{ color: 'white', fontSize: '12px', margin: 0 }}>{weather.main.humidity}%</p>
              </div>
              <div>
                <p style={{ color: '#9ca3af', fontSize: '10px', margin: 0 }}>Wind</p>
                <p style={{ color: 'white', fontSize: '12px', margin: 0 }}>{Math.round(weather.wind.speed)} m/s</p>
              </div>
            </div>
          </div>
        ) : (
          <p style={{ color: '#9ca3af', fontSize: '12px' }}>Weather data unavailable</p>
        )}
      </div>

      {/* Activities Card */}
      <div style={{
        backgroundColor: '#1f2937',
        borderRadius: '12px',
        padding: '16px'
      }}>
        <h3 style={{
          color: 'white',
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '12px'
        }}>What Would You Like To Do?</h3>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          {Object.entries(activities).map(([key, value]) => (
            <label
              key={key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '6px',
                backgroundColor: value ? '#374151' : 'transparent',
                transition: 'background-color 0.2s'
              }}
            >
              <input
                type="checkbox"
                checked={value}
                onChange={() => handleActivityChange(key)}
                style={{
                  width: '16px',
                  height: '16px',
                  cursor: 'pointer',
                  accentColor: '#84cc16'
                }}
              />
              <span style={{
                color: 'white',
                fontSize: '13px',
                textTransform: 'capitalize'
              }}>{key}</span>
            </label>
          ))}
        </div>
        <p style={{
          color: '#9ca3af',
          fontSize: '11px',
          marginTop: '12px'
        }}>Select your preferred activities</p>
      </div>
    </div>
  );
}
