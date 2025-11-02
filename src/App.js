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
    <Container fluid className="p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      
      <Row>
        <Col md={12}>
          <h1 className="display-4">Good Morning!</h1>
          <p className="lead">Your ZenDash is ready.</p>
        </Col>
      </Row>

      <Row className="mt-3">
        {/* === LEFT COLUMN === */}
        <Col md={8}>
          
          {/* We pass the event data down as a prop */}
          <CommuteWidget nextEvent={nextEvent} />
          
          <div className="mt-3" /> {/* Spacer */}
          
          {/* We pass the event data down as a prop */}
          <FocusWidget nextEvent={nextEvent} />

        </Col>

        {/* === RIGHT COLUMN === */}
        <Col md={4}>
          {/* We pass the token down so it can fetch email */}
          <DeadlineWidget token={token} />
        </Col>
      </Row>
      
    </Container>
  );
}

export default App;