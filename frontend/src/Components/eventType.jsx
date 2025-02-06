import React, { useEffect, useState } from "react";
import { getEventTypes } from "../api calls/fetchingEventTypes";
import { Link } from "react-router-dom"; 

const EventType = () => {
  const [groupedEvents, setGroupedEvents] = useState({});
  const [loading, setLoading] = useState(true);

  const event_Types = [
    "sport",
    "comedy",
    "party",
    "music",
    "holidays",
    "games",
    "food",
    "networking",
  ];

  useEffect(() => {
    const fetchEventsByType = async () => {
      const grouped = {};
      for (const eventType of event_Types) {
        try {
          const events = await getEventTypes(eventType); 
          grouped[eventType] = events;
        } catch (error) {
          console.log(`error: ${eventType}`);
        }
      }
      setGroupedEvents(grouped); 
      setLoading(false); 
    };

    fetchEventsByType();
  }, []);

  if (loading) {
    return <p>Loading events...</p>;
  }

  return (
    <div>
      {Object.entries(groupedEvents).map(([type, events]) => (
        <div key={type} id={type}> 
          <h2>{type.charAt(0).toUpperCase() + type.slice(1)}</h2>
          <div className="cardCollection">
            {events.map((event) => (
              <div className="card" key={event.event_id}>
                <Link to={`/events/${event.event_id}`}>
                  <img
                    className="card-img-top"
                    src={event.event_img || "https://www.charitycomms.org.uk/wp-content/uploads/2019/02/placeholder-image-square.jpg"}
                    alt={event.event_name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{event.event_name}</h5>
                    <p className="card-text">
                      <strong>Date:</strong> {event.event_date.slice(0,-14)} <br />
                      <strong>Time:</strong> {event.event_time} <br />
                      <strong>Cost:</strong> £{event.event_cost}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
  
};

export default EventType;
