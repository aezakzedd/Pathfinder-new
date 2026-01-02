import { useState } from 'react';
import { Calendar, ChevronRight, ChevronLeft } from 'lucide-react';

export default function TravellerInformation() {
  const [step, setStep] = useState(1); // 1: Dates, 2: Budget, 3: Preferences
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState(10000);
  const [preferences, setPreferences] = useState({
    beach: false,
    hiking: false,
    sightseeing: false,
    waterfalls: false,
    historical: false,
    adventure: false,
    relaxation: false,
    cultural: false
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const togglePreference = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Calculate days between dates
  const calculateDays = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  const days = calculateDays();

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px'
    }}>
      {/* Step Indicator */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '32px'
      }}>
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            style={{
              width: step === s ? '32px' : '8px',
              height: '8px',
              borderRadius: '4px',
              backgroundColor: step >= s ? '#84cc16' : '#374151',
              transition: 'all 0.3s ease'
            }}
          />
        ))}
      </div>

      {/* Step 1: Journey Dates */}
      {step === 1 && (
        <div style={{
          width: '100%',
          maxWidth: '400px',
          textAlign: 'center',
          animation: 'fadeIn 0.3s ease-in'
        }}>
          <h2 style={{
            color: 'white',
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '12px'
          }}>When are you traveling?</h2>
          <p style={{
            color: '#9ca3af',
            fontSize: '14px',
            marginBottom: '32px'
          }}>Select your journey dates to Catanduanes</p>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginBottom: '24px'
          }}>
            {/* Start Date */}
            <div style={{
              textAlign: 'left'
            }}>
              <label style={{
                color: '#9ca3af',
                fontSize: '12px',
                marginBottom: '8px',
                display: 'block'
              }}>Start Date</label>
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Calendar size={18} color="#9ca3af" style={{
                  position: 'absolute',
                  left: '12px',
                  pointerEvents: 'none'
                }} />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 40px',
                    backgroundColor: '#1f2937',
                    border: '2px solid #374151',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s',
                    colorScheme: 'dark'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#84cc16'}
                  onBlur={(e) => e.target.style.borderColor = '#374151'}
                />
              </div>
            </div>

            {/* End Date */}
            <div style={{
              textAlign: 'left'
            }}>
              <label style={{
                color: '#9ca3af',
                fontSize: '12px',
                marginBottom: '8px',
                display: 'block'
              }}>End Date</label>
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Calendar size={18} color="#9ca3af" style={{
                  position: 'absolute',
                  left: '12px',
                  pointerEvents: 'none'
                }} />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 40px',
                    backgroundColor: '#1f2937',
                    border: '2px solid #374151',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s',
                    colorScheme: 'dark'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#84cc16'}
                  onBlur={(e) => e.target.style.borderColor = '#374151'}
                />
              </div>
            </div>
          </div>

          {days > 0 && (
            <div style={{
              backgroundColor: '#1f2937',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '24px'
            }}>
              <p style={{
                color: '#84cc16',
                fontSize: '14px',
                fontWeight: '600',
                margin: 0
              }}>
                {days} {days === 1 ? 'day' : 'days'} trip to Catanduanes
              </p>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Budget */}
      {step === 2 && (
        <div style={{
          width: '100%',
          maxWidth: '400px',
          textAlign: 'center',
          animation: 'fadeIn 0.3s ease-in'
        }}>
          <h2 style={{
            color: 'white',
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '12px'
          }}>What's your budget?</h2>
          <p style={{
            color: '#9ca3af',
            fontSize: '14px',
            marginBottom: '32px'
          }}>Set your budget range for the trip</p>

          <div style={{
            backgroundColor: '#1f2937',
            padding: '32px',
            borderRadius: '16px',
            marginBottom: '24px'
          }}>
            <div style={{
              fontSize: '48px',
              fontWeight: '700',
              color: '#84cc16',
              marginBottom: '24px'
            }}>
              ₱{budget.toLocaleString()}
            </div>

            <input
              type="range"
              min="1000"
              max="50000"
              step="500"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              style={{
                width: '100%',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: '#374151',
                outline: 'none',
                cursor: 'pointer',
                WebkitAppearance: 'none',
                appearance: 'none'
              }}
            />
            
            <style>{`
              input[type='range']::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: #84cc16;
                cursor: pointer;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
              }
              input[type='range']::-moz-range-thumb {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: #84cc16;
                cursor: pointer;
                border: none;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
              }
              input[type='range']::-webkit-slider-runnable-track {
                background: linear-gradient(to right, #84cc16 0%, #84cc16 ${((budget - 1000) / (50000 - 1000)) * 100}%, #374151 ${((budget - 1000) / (50000 - 1000)) * 100}%, #374151 100%);
                height: 8px;
                border-radius: 4px;
              }
            `}</style>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '12px'
            }}>
              <span style={{ color: '#9ca3af', fontSize: '12px' }}>₱1,000</span>
              <span style={{ color: '#9ca3af', fontSize: '12px' }}>₱50,000</span>
            </div>
          </div>

          {days > 0 && (
            <div style={{
              backgroundColor: '#1f2937',
              padding: '12px',
              borderRadius: '8px'
            }}>
              <p style={{
                color: '#9ca3af',
                fontSize: '12px',
                margin: 0
              }}>
                ₱{Math.round(budget / days).toLocaleString()} per day
              </p>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Preferences */}
      {step === 3 && (
        <div style={{
          width: '100%',
          maxWidth: '500px',
          textAlign: 'center',
          animation: 'fadeIn 0.3s ease-in'
        }}>
          <h2 style={{
            color: 'white',
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '12px'
          }}>What interests you?</h2>
          <p style={{
            color: '#9ca3af',
            fontSize: '14px',
            marginBottom: '32px'
          }}>Select your preferences for the trip</p>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            justifyContent: 'center',
            marginBottom: '24px'
          }}>
            {Object.keys(preferences).map((key) => (
              <button
                key={key}
                onClick={() => togglePreference(key)}
                style={{
                  padding: '12px 24px',
                  borderRadius: '24px',
                  border: preferences[key] ? '2px solid #84cc16' : '2px solid #374151',
                  backgroundColor: preferences[key] ? '#84cc16' : '#1f2937',
                  color: preferences[key] ? '#000000' : 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all 0.2s ease',
                  outline: 'none'
                }}
                onMouseEnter={(e) => {
                  if (!preferences[key]) {
                    e.target.style.borderColor = '#84cc16';
                    e.target.style.backgroundColor = '#374151';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!preferences[key]) {
                    e.target.style.borderColor = '#374151';
                    e.target.style.backgroundColor = '#1f2937';
                  }
                }}
              >
                {key}
              </button>
            ))}
          </div>

          <div style={{
            backgroundColor: '#1f2937',
            padding: '12px',
            borderRadius: '8px'
          }}>
            <p style={{
              color: '#9ca3af',
              fontSize: '12px',
              margin: 0
            }}>
              {Object.values(preferences).filter(Boolean).length} preferences selected
            </p>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginTop: 'auto',
        paddingTop: '32px'
      }}>
        {step > 1 && (
          <button
            onClick={handlePrevious}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              backgroundColor: '#374151',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#4b5563'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#374151'}
          >
            <ChevronLeft size={18} />
            Previous
          </button>
        )}
        
        {step < 3 ? (
          <button
            onClick={handleNext}
            disabled={step === 1 && (!startDate || !endDate)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              backgroundColor: (step === 1 && (!startDate || !endDate)) ? '#374151' : '#84cc16',
              color: (step === 1 && (!startDate || !endDate)) ? '#9ca3af' : '#000000',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: (step === 1 && (!startDate || !endDate)) ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              opacity: (step === 1 && (!startDate || !endDate)) ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (!(step === 1 && (!startDate || !endDate))) {
                e.target.style.backgroundColor = '#a3e635';
              }
            }}
            onMouseLeave={(e) => {
              if (!(step === 1 && (!startDate || !endDate))) {
                e.target.style.backgroundColor = '#84cc16';
              }
            }}
          >
            Next
            <ChevronRight size={18} />
          </button>
        ) : (
          <button
            onClick={() => console.log('Generate Itinerary', { startDate, endDate, budget, preferences })}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 32px',
              backgroundColor: '#84cc16',
              color: '#000000',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#a3e635'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#84cc16'}
          >
            Generate Itinerary
          </button>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
