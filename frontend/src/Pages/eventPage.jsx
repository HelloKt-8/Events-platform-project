import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import { getEventTypes } from "../api calls/fetchingEventTypes";
import { useAuth } from "../AuthContext"; // Access global state for user
import { addEventToCalendar } from "../googleApi"; // Import Google Calendar function
import { supabase } from "../supabaseClient";

function EventPage() {
  const { event_id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user from global state
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      if (error) throw error;
      console.log("Successfully signed in with Google");
    } catch (error) {
      console.error("Google sign-in error:", error.message);
    }
  };

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

    const convertToISO = (date, time) => {
      console.log("Raw Event Date:", date);
      console.log("Raw Event Time:", time);
    
      if (!date || !time) {
        throw new Error("Event date or time is missing");
      }
    
      const dateOnly = date.split("T")[0]; // "2025-02-13" from "2025-02-13T00:00:00.000Z"
      console.log("Formatted Date:", dateOnly);
    
      let formattedTime = time;
      const timeRegex = /(\d{1,2}):(\d{2})(?:\s?(AM|PM))?/;
      const match = time.match(timeRegex);
    
      if (match) {
        let [ , hour, minute, period ] = match;
        let adjustedHour = parseInt(hour, 10);
    
        if (period) {
          if (period.toUpperCase() === "PM" && adjustedHour < 12) {
            adjustedHour += 12;
          } else if (period.toUpperCase() === "AM" && adjustedHour === 12) {
            adjustedHour = 0;
          }
        }
    
        formattedTime = `${adjustedHour.toString().padStart(2, "0")}:${minute}`;
      }
    
      const dateTimeString = `${dateOnly}T${formattedTime}:00`;
      console.log("Formatted DateTime String:", dateTimeString);
    
      const dateTime = new Date(dateTimeString);
    
      if (isNaN(dateTime)) {
        throw new Error("Invalid date or time format");
      }
    
      return dateTime.toISOString();
    };

    const eventDetailsForCalendar = {
      event_name: eventDetails.event_name,
      description: eventDetails.description || "Event registered via our platform!",
      event_time: convertToISO(eventDetails.event_date, eventDetails.event_time),
      end_time: convertToISO(eventDetails.event_date, eventDetails.end_time),
    };

    try {
      await addEventToCalendar(eventDetailsForCalendar);
      alert("Event added to your Google Calendar!");

      // Redirect user to Google Calendar page
      window.open("https://calendar.google.com", "_blank");
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
              <button className="btn-join" onClick={handleGoogleSignIn}>
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
