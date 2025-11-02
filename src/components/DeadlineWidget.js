// src/components/DeadlineWidget.js

import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Spinner, Badge } from 'react-bootstrap';
import { Bell, Mail, AlertCircle, CheckCircle } from 'react-bootstrap-icons';

function DeadlineWidget({ token }) {
  const [deadlines, setDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    // Search for unread emails with "due", "invoice", or "trial"
    const API_URL = 'https://www.googleapis.com/gmail/v1/users/me/messages?q=is:unread (due OR invoice OR trial)&maxResults=5';

    fetch(API_URL, {
      headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(res => res.json())
    .then(data => {
      if (data.messages && data.messages.length > 0) {
        // HACKATHON SHORTCUT: We are just showing the *count* of messages.
        // A full app would fetch each message's subject.
        setDeadlines(data.messages); 
      }
      setLoading(false);
    })
    .catch(err => {
      console.error("Gmail fetch error:", err);
      setLoading(false);
    });

  }, [token]);

  const renderContent = () => {
    if (loading) {
      return (
        <ListGroup.Item className="text-center py-4">
          <Spinner animation="border" className="loading-spinner mb-2" />
          <div className="text-muted">Checking your inbox...</div>
        </ListGroup.Item>
      );
    }

    if (deadlines.length === 0) {
      return (
        <ListGroup.Item className="text-center py-4">
          <CheckCircle size={32} className="text-success mb-2" />
          <div className="text-success fw-semibold">All Clear!</div>
          <div className="text-muted small">No urgent deadlines detected</div>
        </ListGroup.Item>
      );
    }

    // Enhanced deadline items
    return deadlines.map((msg, index) => (
      <ListGroup.Item
        key={msg.id}
        className="border-0 border-bottom hover-bg-light transition-all"
        style={{
          padding: '16px',
          borderLeft: `4px solid var(--gradient-primary)`,
          margin: '4px 0',
          borderRadius: '8px',
          backgroundColor: 'var(--bg-card)'
        }}
      >
        <div className="d-flex align-items-start">
          <div className="icon-gradient-secondary me-3" style={{ minWidth: '40px', height: '40px' }}>
            <Mail size={20} />
          </div>
          <div className="flex-grow-1">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <h6 className="mb-0 fw-semibold">Urgent Email Detected</h6>
              <Badge bg="danger" className="pulse">#{index + 1}</Badge>
            </div>
            <p className="mb-2 small text-muted">
              Keywords: due, invoice, or trial found in unread message
            </p>
            <div className="d-flex align-items-center text-muted small">
              <AlertCircle size={14} className="me-1" />
              <span>Requires attention</span>
            </div>
          </div>
        </div>
      </ListGroup.Item>
    ));
  };

  return (
    <Card className="shadow-sm border-0">
      <Card.Header as="h5" className="bg-white border-0 d-flex align-items-center">
        <Bell size={24} className="me-2" /> Smart Deadlines
      </Card.Header>
      <ListGroup variant="flush">
        {renderContent()}
      </ListGroup>
    </Card>
  );
}

export default DeadlineWidget;