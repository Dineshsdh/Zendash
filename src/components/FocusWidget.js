// src/components/FocusWidget.js

import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Eye, Layers, Bullseye } from 'react-bootstrap-icons';

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
    <Card className="enhanced-card">
      <Card.Header className="bg-transparent border-0 pb-0">
        <div className="d-flex align-items-center">
          <div className="icon-gradient-accent me-3">
            <Bullseye size={24} />
          </div>
          <div>
            <h5 className="mb-0 fw-bold">Focus Mode</h5>
            <p className="text-muted small mb-0">Distraction-free workspace</p>
          </div>
        </div>
      </Card.Header>
      <Card.Body className="pt-3">
        {/* Statistics Grid */}
        <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-number">{tabs.length}</div>
            <div className="stat-label">Related Tabs</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">{keywords.length}</div>
            <div className="stat-label">Keywords</div>
          </div>
        </div>

        {/* Focus Description */}
        <div className="text-center mb-4 p-3 bg-light rounded-lg">
          <Eye size={20} className="text-primary mb-2" />
          <p className="mb-0">
            We found <Badge bg="primary" className="fs-6 px-2 py-1">{tabs.length}</Badge> tabs related to
            <strong> '{eventName}'</strong>
          </p>
          <p className="text-muted small mb-0">
            Click below to organize them in a new window
          </p>
        </div>

        {/* Enhanced Button */}
        <div className="d-grid">
          <Button
            className="btn-gradient"
            size="lg"
            onClick={onFocusClick}
            disabled={tabs.length === 0}
          >
            {tabs.length === 0 ? (
              <>
                <Layers size={18} className="me-2" />
                No Related Tabs Found
              </>
            ) : (
              <>
                <Bullseye size={18} className="me-2" />
                Focus on {tabs.length} Tab{tabs.length !== 1 ? 's' : ''}
              </>
            )}
          </Button>
        </div>

        {tabs.length === 0 && (
          <p className="text-muted text-center mt-3 small mb-0">
            No tabs match your current event. Try opening relevant pages first.
          </p>
        )}
      </Card.Body>
    </Card>
  );
}

export default FocusWidget;