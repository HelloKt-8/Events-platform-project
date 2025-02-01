import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import { getEventTypes } from "../api calls/fetchingEventTypes";
import { useAuth } from "../AuthContext"; // Access global state for user
import { addEventToCalendar } from "../googleApi"; // Import Google Calendar function

function EventPage() {
  const { event_id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user from global state
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const events = await getEventTypes(null, event_id);
        if (events.length > 0) {
          setEventDetails(events[0]);
        } else {
          setError("Event not found.");
        }
      } catch (err) {
        setError("Failed to fetch event details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (event_id) {
      fetchEventDetails();
    }
  }, [event_id]);

  const handleSignUp = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    alert("You have signed up for this event! Adding to Google Calendar...");

    // Convert to ISO format for Google Calendar
    const convertToISO = (date, time) => {
      return new Date(`${date}T${time}:00Z`).toISOString();
    };

    const eventDetailsForCalendar = {
      title: eventDetails.event_name,
      description: eventDetails.description || "Event registered via our platform!",
      startTime: convertToISO(eventDetails.event_date, eventDetails.event_time),
      endTime: convertToISO(eventDetails.event_date, eventDetails.end_time),
    };

    try {
      await addEventToCalendar(eventDetailsForCalendar);
      alert("Event added to your Google Calendar!");
    } catch (error) {
      console.error("Error adding event:", error);
      alert("Failed to add event to Google Calendar.");
    }
  };

  return (
    <div>
      <Header />
      {loading && <p className="loading">Loading event details...</p>}
      {error && <p className="error">{error}</p>}

      {eventDetails && (
        <div className="event-details">
          <h1 className="event-title">{eventDetails.event_name}</h1>
          <p><strong>Date:</strong> {eventDetails.event_date}</p>
          <p><strong>Time:</strong> {eventDetails.event_time} - {eventDetails.end_time}</p>
          <p><strong>Description:</strong> {eventDetails.description}</p>
          <p><strong>Location:</strong> {eventDetails.event_location}</p>
          <p><strong>Type:</strong> {eventDetails.event_type}</p>
          <p><strong>Cost:</strong> {eventDetails.event_cost === 0 ? "Free" : `£${eventDetails.event_cost}`}</p>
          
          <div className="event-buttons">
            {user ? (
              <>
                {user.user_type === "member" && (
                  <button className="btn-signup" onClick={handleSignUp}>
                    Sign Up!
                  </button>
                )}
                {(user.user_type === "admin" || user.user_type === "staff") && (
                  <>
                    <button className="btn-signup" onClick={handleSignUp}>
                      Sign Up!
                    </button>
                    <button className="btn-manage" onClick={() => alert("Redirecting to event management page...")}>
                      Manage
                    </button>
                  </>
                )}
              </>
            ) : (
              <button className="btn-join" onClick={() => navigate("/signup")}>
                Sign up to join
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default EventPage;
