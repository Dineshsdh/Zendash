// src/components/CommuteWidget.js

import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { CloudSun, GeoAlt, Clock, Umbrella } from 'react-bootstrap-icons';

// HACKATHON SHORTCUTS:
// We aren't calling the backend for commute time in this step.
// We are just displaying the event info.
const DUMMY_COMMUTE = {
  time: "35 mins",
  weather: "expect rain",
  traffic: "moderate"
};

function CommuteWidget({ nextEvent }) {

  const renderContent = () => {
    if (!nextEvent) {
      return (
        <div className="text-center py-4">
          <div className="icon-gradient-secondary mb-3 mx-auto" style={{ width: '60px', height: '60px' }}>
            <CloudSun size={30} />
          </div>
          <p className="text-muted mb-0">All clear! No upcoming events.</p>
          <p className="text-muted small">Enjoy your free time!</p>
        </div>
      );
    }

    const eventTime = new Date(nextEvent.start.dateTime || nextEvent.start.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const eventDate = new Date(nextEvent.start.dateTime || nextEvent.start.date).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

    return (
      <>
        {/* Event Time with enhanced styling */}
        <div className="d-flex align-items-center mb-3">
          <div className="icon-gradient me-3">
            <Clock size={24} />
          </div>
          <div>
            <div className="h3 mb-0 fw-bold">{eventTime}</div>
            <div className="text-muted small">{eventDate}</div>
          </div>
        </div>

        {/* Event Title */}
        <h4 className="mb-3 fw-semibold">{nextEvent.summary}</h4>

        {/* Location with icon */}
        {nextEvent.location && (
          <div className="d-flex align-items-center mb-3 p-3 bg-light rounded-lg">
            <MapPin size={20} className="text-primary me-2" />
            <span>{nextEvent.location}</span>
          </div>
        )}

        {/* Commute Alert Box */}
        <div className="alert-gradient mb-4">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <Umbrella size={20} className="me-2" />
              <div>
                <div className="fw-semibold">Commute Alert</div>
                <div className="small opacity-90">
                  Leave by <strong>10:25 AM</strong> • {DUMMY_COMMUTE.time} travel time
                </div>
              </div>
            </div>
            <div className="text-end">
              <div className="badge bg-white text-dark p-2">
                {DUMMY_COMMUTE.weather}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Button */}
        <div className="d-grid">
          <Button
            className="btn-gradient"
            href={nextEvent.htmlLink}
            target="_blank"
            size="lg"
          >
            Open in Calendar
          </Button>
        </div>
      </>
    );
  };

  return (
    <Card className="enhanced-card">
      <Card.Header className="bg-transparent border-0 pb-0">
        <div className="d-flex align-items-center">
          <div className="icon-gradient me-3">
            <CloudSun size={24} />
          </div>
          <div>
            <h5 className="mb-0 fw-bold">What's Next</h5>
            <p className="text-muted small mb-0">Your upcoming schedule</p>
          </div>
        </div>
      </Card.Header>
      <Card.Body className="pt-3">
        {renderContent()}
      </Card.Body>
    </Card>
  );
}

export default CommuteWidget;