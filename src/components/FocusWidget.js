// src/components/FocusWidget.js

import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Briefcase } from 'react-bootstrap-icons';

// A simple function to get keywords from a title
const getKeywords = (title) => {
  if (!title) return [];
  return title.toLowerCase().split(' ').filter(word => word.length > 3);
};

// Check if we are running as an extension
const isExtension = typeof window !== 'undefined' && window.chrome && window.chrome.tabs;

function FocusWidget({ nextEvent }) {
  const [tabs, setTabs] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [eventName, setEventName] = useState('...');

  // 1. When the event prop changes, update our keywords
  useEffect(() => {
    if (nextEvent && nextEvent.summary) {
      setKeywords(getKeywords(nextEvent.summary));
      setEventName(nextEvent.summary);
    } else {
      setKeywords([]);
      setEventName('your next event');
    }
  }, [nextEvent]);

  // 2. When keywords change, find matching tabs
  useEffect(() => {
    // GUARD CLAUSE: Only run this if the chrome.tabs API exists
    if (!isExtension) {
      console.warn("FocusWidget: Not in extension environment. Tab query skipped.");
      return;
    }

    if (keywords.length === 0) {
      setTabs([]);
      return;
    }

    // Use window.chrome to avoid referencing an undefined global
    window.chrome.tabs.query({}, (allTabs) => {
      const matchingTabs = allTabs.filter(tab => {
        const title = (tab.title || '').toLowerCase();
        const url = (tab.url || '').toLowerCase();
        return keywords.some(key => title.includes(key) || url.includes(key));
      });
      setTabs(matchingTabs);
    });
  }, [keywords]); // This re-runs whenever 'keywords' changes

  const onFocusClick = () => {
    // GUARD CLAUSE: Check for API before using it
    if (!isExtension) {
      alert("This feature only works when run as a Chrome Extension.");
      return;
    }

    const tabIds = tabs.map(tab => tab.id);
    if (tabIds.length === 0) return;

    // Use window.chrome to avoid referencing an undefined global
    window.chrome.windows.create({ focused: true }, (newWindow) => {
      window.chrome.tabs.move(tabIds, { windowId: newWindow.id, index: -1 });
    });
  };

  return (
    <Card className="shadow-sm border-0">
      <Card.Header as="h5" className="bg-white border-0 d-flex align-items-center">
        <Briefcase size={24} className="me-2" /> Focus Mode
      </Card.Header>
      <Card.Body>
        <Card.Text>
          We found <Badge bg="primary">{tabs.length}</Badge> tabs
          related to <strong>'{eventName}'</strong>.
        </Card.Text>
        <Button variant="primary" size="lg" onClick={onFocusClick} disabled={tabs.length === 0}>
          Click to Focus
        </Button>
      </Card.Body>
    </Card>
  );
}

export default FocusWidget;