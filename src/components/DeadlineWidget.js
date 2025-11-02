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
      return <ListGroup.Item><Spinner size="sm" /></ListGroup.Item>;
    }
    if (deadlines.length === 0) {
      return <ListGroup.Item className="text-muted">Inbox is clear!</ListGroup.Item>;
    }

    // For the demo, we just list "Urgent" items.
    return deadlines.map(msg => (
      <ListGroup.Item key={msg.id}>
        <strong>Urgent Email Found</strong>
        <small className="d-block text-muted">Subject: (e.g., Invoice Due)</small>
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