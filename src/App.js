// src/App.js

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import theme styles
import './styles/ThemeStyles.css';

// Import our components
import EnhancedHeader from './components/EnhancedHeader';
import CommuteWidget from './components/CommuteWidget';
import FocusWidget from './components/FocusWidget';
import DeadlineWidget from './components/DeadlineWidget';

function App() {
  const [token, setToken] = useState(null);
  const [nextEvent, setNextEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Get the Auth Token
    if (window.chrome && window.chrome.identity) {
      window.chrome.identity.getAuthToken({ 'interactive': true }, (authToken) => {
        if ((window.chrome.runtime && window.chrome.runtime.lastError) || !authToken) {
          setError("Login Failed: " + (window.chrome.runtime && window.chrome.runtime.lastError ? window.chrome.runtime.lastError.message : 'Unknown error'));
          setLoading(false);
          return;
        }
        console.log("Got auth token");
        setToken(authToken);

        // 2. NOW that we have the token, fetch the event
        const API_URL = "https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=" + (new Date().toISOString()) + "&maxResults=1&orderBy=startTime&singleEvents=true";
        
        fetch(API_URL, {
          headers: { 'Authorization': 'Bearer ' + authToken }
        })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            setError(data.error.message);
          } else if (data.items && data.items.length > 0) {
            setNextEvent(data.items[0]); // Set the event
          }
          setLoading(false); // We are done loading
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
      });
    } else {
      setError("This must be run as a Chrome extension.");
      setLoading(false);
    }
  }, []); // Runs once on load

  // --- Render Loading / Error States ---
  if (loading) {
    return (
      <Container fluid className="d-flex vh-100 justify-content-center align-items-center">
        <div className="text-center">
          <Spinner animation="border" className="loading-spinner mb-3" />
          <div className="lead">Loading ZenDash...</div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="p-4">
        <div className="enhanced-card p-4 border-danger">
          <Alert variant="danger" className="mb-0">
            <strong>Error:</strong> {error}
          </Alert>
        </div>
      </Container>
    );
  }

  // --- Render The Main Dashboard ---
  return (
    <Container fluid className="p-4" style={{ minHeight: '100vh' }}>
      {/* Enhanced Header with Theme Toggle */}
      <EnhancedHeader />

      {/* Modern Grid Layout using CSS Grid */}
      <div
        className="dashboard-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '20px',
          marginTop: '30px'
        }}
      >
        {/* === LEFT COLUMN === */}
        <div className="left-column d-flex flex-column gap-3">
          {/* Commute Widget */}
          <div className="slide-in" style={{ animationDelay: '0.1s' }}>
            <CommuteWidget nextEvent={nextEvent} />
          </div>

          {/* Focus Widget */}
          <div className="slide-in" style={{ animationDelay: '0.2s' }}>
            <FocusWidget nextEvent={nextEvent} />
          </div>
        </div>

        {/* === RIGHT COLUMN === */}
        <div className="right-column">
          {/* Deadline Widget */}
          <div className="slide-in" style={{ animationDelay: '0.3s' }}>
            <DeadlineWidget token={token} />
          </div>
        </div>
      </div>

      {/* Responsive Grid Override */}
      <style>{`
        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </Container>
  );
}

export default App;