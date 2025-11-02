// src/components/CommuteWidget.js

import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { CloudSun, MapPin, Clock, Umbrella } from 'react-bootstrap-icons';

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
      return <p className="text-muted">All clear! No upcoming events.</p>;
    }

    const eventTime = new Date(nextEvent.start.dateTime || nextEvent.start.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
      <>
        <Card.Title>{eventTime}: {nextEvent.summary}</Card.Title>
        <Card.Text>
          {nextEvent.location ? `Location: ${nextEvent.location}` : "No location specified."}
        </Card.Text>
        <Card.Text className="text-success">
          {/* This is hardcoded for the demo. */}
          Leave by <strong>10:25 AM</strong>. 
          (Est. {DUMMY_COMMUTE.time}, {DUMMY_COMMUTE.weather}).
        </Card.Text>
        <Button 
          variant="outline-primary" 
          href={nextEvent.htmlLink} 
          target="_blank"
        >
          Open in Calendar
        </Button>
      </>
    );
  };

  return (
    <Card className="shadow-sm border-0">
      <Card.Header as="h5" className="bg-white border-0 d-flex align-items-center">
        <CloudSun size={24} className="me-2" /> What's Next
      </Card.Header>
      <Card.Body>
        {renderContent()}
      </Card.Body>
    </Card>
  );
}

export default CommuteWidget;