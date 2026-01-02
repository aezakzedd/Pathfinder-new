import { useState } from 'react';
import { Calendar, Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, CloudFog } from 'lucide-react';

export default function TravellerInformation({ budget, setBudget }) {
  const [dateRange, setDateRange] = useState('Nov 30 - Dec 2');
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

  // Get weather icon based on condition
  const getWeatherIcon = (weatherMain) => {
    const iconProps = { size: 48, color: '#84cc16', strokeWidth: 1.5 };
    
    switch (weatherMain) {
      case 'Clear':
        return <Sun {...iconProps} />;
      case 'Clouds':
        return <Cloud {...iconProps} />;
      case 'Rain':
        return <CloudRain {...iconProps} />;
      case 'Drizzle':
        return <CloudDrizzle {...iconProps} />;
      case 'Thunderstorm':
        return <CloudLightning {...iconProps} />;
      case 'Snow':
        return <CloudSnow {...iconProps} />;
      case 'Mist':
      case 'Fog':
      case 'Haze':
      case 'Smoke':
        return <CloudFog {...iconProps} />;
      default:
        return <Cloud {...iconProps} />;
    }
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
        gap: '12px',
        width: 'calc(100% - 48px)',
        height: 'calc(100% - 48px)',
        maxWidth: '90%',
        maxHeight: '90%'
      }}>
        {/* Journey Dates Card */}
        <div style={{
          backgroundColor: '#000000',
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
            backgroundColor: '#1f2937',
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
          backgroundColor: '#000000',
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
          backgroundColor: '#000000',
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
            <div style={{ marginTop: '4px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              {/* Weather Icon and Temperature */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                marginBottom: '8px'
              }}>
                {getWeatherIcon(weather.weather[0].main)}
                <div>
                  <span style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: 'white'
                  }}>{Math.round(weather.main.temp)}°C</span>
                </div>
              </div>
              
              {/* Weather Description */}
              <p style={{
                color: 'white',
                fontSize: '11px',
                textTransform: 'capitalize',
                textAlign: 'center',
                margin: 0,
                marginBottom: '4px'
              }}>{weather.weather[0].description}</p>
              <p style={{
                color: '#9ca3af',
                fontSize: '9px',
                textAlign: 'center',
                margin: 0,
                marginBottom: '8px'
              }}>Feels like {Math.round(weather.main.feels_like)}°C</p>
              
              {/* Humidity and Wind */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '6px',
                marginTop: 'auto'
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
          backgroundColor: '#000000',
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
    </div>
  );
}
