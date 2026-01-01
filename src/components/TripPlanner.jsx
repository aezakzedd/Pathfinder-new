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
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: '1fr 1fr',
      gap: '12px',
      padding: '8px'
    }}>
      {/* Journey Dates Card */}
      <div style={{
        backgroundColor: '#1f2937',
        borderRadius: '12px',
        padding: '14px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h3 style={{
          color: 'white',
          fontSize: '13px',
          fontWeight: '600',
          marginBottom: '10px',
          margin: 0
        }}>Journey Dates</h3>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#374151',
          padding: '8px',
          borderRadius: '8px',
          marginTop: '8px'
        }}>
          <Calendar size={14} color="white" />
          <input
            type="text"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '12px',
              outline: 'none',
              flex: 1
            }}
          />
        </div>
        <p style={{
          color: '#9ca3af',
          fontSize: '10px',
          marginTop: 'auto',
          paddingTop: '8px',
          margin: 0
        }}>Selected period is 3 days to Catanduanes</p>
      </div>

      {/* Budget Card */}
      <div style={{
        backgroundColor: '#1f2937',
        borderRadius: '12px',
        padding: '14px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h3 style={{
          color: 'white',
          fontSize: '13px',
          fontWeight: '600',
          marginBottom: '10px',
          margin: 0
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
            accentColor: '#84cc16',
            marginTop: '8px'
          }}
        />
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '6px'
        }}>
          <span style={{ color: '#9ca3af', fontSize: '9px' }}>₱1,000</span>
          <span style={{ color: 'white', fontSize: '12px', fontWeight: '600' }}>₱{budget.toLocaleString()}</span>
          <span style={{ color: '#9ca3af', fontSize: '9px' }}>₱50,000</span>
        </div>
        <p style={{
          color: '#9ca3af',
          fontSize: '10px',
          marginTop: 'auto',
          paddingTop: '4px',
          textAlign: 'center',
          margin: 0
        }}>Price range for your trip</p>
      </div>

      {/* Weather Card */}
      <div style={{
        backgroundColor: '#1f2937',
        borderRadius: '12px',
        padding: '14px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h3 style={{
          color: 'white',
          fontSize: '13px',
          fontWeight: '600',
          marginBottom: '10px',
          margin: 0
        }}>Weather in Catanduanes</h3>
        {loading ? (
          <p style={{ color: '#9ca3af', fontSize: '11px', margin: 0 }}>Loading...</p>
        ) : weather && weather.main ? (
          <div style={{ marginTop: '4px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '6px'
            }}>
              <span style={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: 'white'
              }}>{Math.round(weather.main.temp)}°C</span>
              <div>
                <p style={{
                  color: 'white',
                  fontSize: '11px',
                  textTransform: 'capitalize',
                  margin: 0
                }}>{weather.weather[0].description}</p>
                <p style={{
                  color: '#9ca3af',
                  fontSize: '9px',
                  margin: 0
                }}>Feels like {Math.round(weather.main.feels_like)}°C</p>
              </div>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '6px',
              marginTop: '8px'
            }}>
              <div>
                <p style={{ color: '#9ca3af', fontSize: '9px', margin: 0 }}>Humidity</p>
                <p style={{ color: 'white', fontSize: '11px', margin: 0 }}>{weather.main.humidity}%</p>
              </div>
              <div>
                <p style={{ color: '#9ca3af', fontSize: '9px', margin: 0 }}>Wind</p>
                <p style={{ color: 'white', fontSize: '11px', margin: 0 }}>{Math.round(weather.wind.speed)} m/s</p>
              </div>
            </div>
          </div>
        ) : (
          <p style={{ color: '#9ca3af', fontSize: '11px', margin: 0 }}>Weather unavailable</p>
        )}
      </div>

      {/* Activities Card */}
      <div style={{
        backgroundColor: '#1f2937',
        borderRadius: '12px',
        padding: '14px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h3 style={{
          color: 'white',
          fontSize: '13px',
          fontWeight: '600',
          marginBottom: '8px',
          margin: 0
        }}>What Would You Like To Do?</h3>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          marginTop: '4px',
          flex: 1
        }}>
          {Object.entries(activities).map(([key, value]) => (
            <label
              key={key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                padding: '5px 6px',
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
                  width: '14px',
                  height: '14px',
                  cursor: 'pointer',
                  accentColor: '#84cc16'
                }}
              />
              <span style={{
                color: 'white',
                fontSize: '11px',
                textTransform: 'capitalize'
              }}>{key}</span>
            </label>
          ))}
        </div>
        <p style={{
          color: '#9ca3af',
          fontSize: '10px',
          marginTop: 'auto',
          paddingTop: '6px',
          margin: 0
        }}>Select your preferred activities</p>
      </div>
    </div>
  );
}
