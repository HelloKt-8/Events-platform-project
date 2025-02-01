import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import { getEventTypes } from "../api calls/fetchingEventTypes";
import { useAuth } from "../AuthContext"; // Access global state for user

function EventPage() {
  const { event_id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user from global state
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debugging: Log the user object
  console.log("User object from global state:", user);

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

  // Debugging: Log eventDetails after fetch
  useEffect(() => {
    if (eventDetails) {
      console.log("Fetched event details:", eventDetails);
    }
  }, [eventDetails]);

  if (loading) {
    return (
      <div>
        <Header />
        <p className="loading">Loading event details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <p className="error">{error}</p>
      </div>
    );
  }

  // Handle button actions
  const handleSignUp = () => {
    if (!user) {
      navigate("/login"); // Redirect to login page if user is not logged in
    } else {
      alert("You have signed up for this event!");
    }
  };

  const handleManage = () => {
    alert("Redirecting to event management page...");
    // Add navigation logic to the event management page
  };

  return (
    <div>
      <Header />
      {eventDetails ? (
        <div className="event-details">
          <h1 className="event-title">{eventDetails.event_name}</h1>
          <p><strong>Date:</strong> {eventDetails.event_date.slice(0, -14)}</p>
          <p><strong>Time:</strong> {eventDetails.event_time} - {eventDetails.end_time}</p>
          <p><strong>Description:</strong>{eventDetails.description}</p>
          <p><strong>Location:</strong> {eventDetails.event_location}</p>
          <p><strong>Type:</strong> {eventDetails.event_type}</p>
          <p><strong>Cost:</strong> {eventDetails.event_cost === 0 ? "Free" : `£${eventDetails.event_cost}`}</p>
          
          <div className="event-buttons">
            {/* Buttons logic */}
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
                    <button className="btn-manage" onClick={handleManage}>
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
      ) : (
        <p className="no-event">No event details available.</p>
      )}
    </div>
  );
}

export default EventPage;
