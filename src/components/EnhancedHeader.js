// EnhancedHeader.js - Modern header with gradients and theme toggle

import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'react-bootstrap-icons';
import { useTheme } from '../hooks/useTheme';

const EnhancedHeader = () => {
  const { theme, toggleTheme } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('Good Morning');

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Update greeting based on time
  useEffect(() => {
    const hour = currentTime.getHours();
    if (hour < 12) {
      setGreeting('Good Morning');
    } else if (hour < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  }, [currentTime]);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="enhanced-header fade-in">
      {/* Theme Toggle Button */}
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </button>

      {/* Header Content */}
      <div className="position-relative z-1">
        <div className="row align-items-center">
          <div className="col-md-8">
            {/* Greeting */}
            <h1 className="display-4 fw-bold mb-3">
              {greeting}!
              {theme === 'dark' && (
                <span className="text-gradient"> Welcome to your ZenDash</span>
              )}
            </h1>

            {/* Subtitle */}
            <p className="lead mb-0 opacity-90">
              Your personalized dashboard is ready with real-time updates
            </p>
          </div>

          <div className="col-md-4 text-md-end mt-3 mt-md-0">
            {/* Date and Time Display */}
            <div className="d-flex flex-column align-items-md-end">
              <div className="fs-5 fw-semibold mb-1">
                {formatDate(currentTime)}
              </div>
              <div className="fs-4 text-gradient">
                {formatTime(currentTime)}
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="position-absolute" style={{ bottom: '-20px', left: '20px' }}>
          <div className="d-flex align-items-center gap-2">
            <div className="pulse">
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#4facfe'
              }}></div>
            </div>
            <span className="small opacity-75">Live Updates Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedHeader;