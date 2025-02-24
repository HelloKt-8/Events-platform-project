import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import Header from "../Components/Header";
import { getEventTypes } from "../api calls/fetchingEventTypes";
import { addEventToCalendar } from "../googleApi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'


function EventPage() {
  const { event_id } = useParams();
  const navigate = useNavigate();
  const { userProfile, session } = useContext(UserContext);
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updatedEventDetails, setUpdatedEventDetails] = useState({});

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const events = await getEventTypes(null, event_id);
        if (events.length > 0) {
          setEventDetails(events[0]);
          setUpdatedEventDetails(events[0]);
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

  const handleJoinEvent = async () => {
    if (!userProfile) {
      toast.warn("Sign up to LondonLife to join!");
      return;
    }

    if (!session) {
      toast.warn("Session not found. Please log in again.");
      return;
    }

    try {
      await addEventToCalendar(eventDetails, session.provider_token);
      toast.success("Event added to your calendar!");

      window.open("https://calendar.google.com/calendar/u/0/r", "_blank");
    } catch (error) {
      toast.success("Event added to your calendar!");
    }
  };

  const handleModalChange = (e) => {
    setUpdatedEventDetails({
      ...updatedEventDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitEdit = async () => {
    try {
      const response = await fetch(
        `https://events-platform-project-z29t.onrender.com/api/events/${event_id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ event_id, ...updatedEventDetails }),
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(
          `Failed to update event. Server Response: ${errorMessage}`
        );
      }

      toast.success("Event updated successfully!");
      setEventDetails(updatedEventDetails);
      setShowModal(false);
    } catch (error) {
      toast.error(`Error updating event: ${error.message}`);
    }
  };

  const handleDeleteEvent = async () => {
    const confirmDelete = window.confirm(
      "⚠️ Are you sure you want to delete this event?"
    );
    
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `https://events-platform-project-z29t.onrender.com/api/events/${event_id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Failed to delete event.");
      }
      toast.success("Event deleted successfully!")
      setTimeout(() => {
        navigate("/");
      }, 800);
      
    } catch (error) {
      console.error(error);
      toast.error("Error deleting event. Please try again.");
    }
  };

  return (
    <div className="event-page-container">
      <ToastContainer position="top-right" autoClose={3000} />

      <Header />

      {loading && <p className="loading">Loading event details...</p>}
      {error && <p className="error">{error}</p>}

      <div className="event-overlay"></div>
      <div
        className="event-background"
        style={{
          backgroundImage: `url(${
            eventDetails?.event_img ||
            "https://via.placeholder.com/1200x800?text=Event+Image"
          })`,
        }}
      ></div>
      {eventDetails && (
        <div className="event-details">
          <h1 className="event-title">{eventDetails.event_name}</h1>
          <p>
            <strong>Date:</strong> {eventDetails.event_date.slice(0, -14)}
          </p>
          <p>
            <strong>Time:</strong> {eventDetails.event_time} -{" "}
            {eventDetails.end_time}
          </p>
          <p>
            <strong>Description:</strong> {eventDetails.description}
          </p>
          <p>
            <strong>Location:</strong> {eventDetails.event_location}
          </p>
          <p>
            <strong>Type:</strong> {eventDetails.event_type}
          </p>
          <p>
            <strong>Cost:</strong>{" "}
            {eventDetails.event_cost === 0
              ? "Free"
              : `£${eventDetails.event_cost}`}
          </p>

          <button onClick={handleJoinEvent} className="btn-join">
            Join Event
          </button>

          {(userProfile?.user_type === "admin" ||
            userProfile?.user_type === "staff") && (
            <button className="btn-manage" onClick={() => setShowModal(true)}>
              Manage Event
            </button>
          )}
        </div>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2 className="edit">Edit Event</h2>

            <label className="label">
              Event Name:
              <input
                type="text"
                name="event_name"
                value={updatedEventDetails.event_name}
                onChange={handleModalChange}
              />
            </label>
            <br />
            <br />

            <label className="label">
              Description:
              <textarea
                name="description"
                value={updatedEventDetails.description}
                onChange={handleModalChange}
              />
            </label>
            <br />
            <br />

            <label className="label">
              Event Date:
              <input
                type="date"
                name="event_date"
                value={updatedEventDetails.event_date.slice(0, 10)}
                onChange={handleModalChange}
              />
            </label>
            <br />
            <br />

            <label className="label">
              Start Time:
              <input
                type="time"
                name="event_time"
                value={updatedEventDetails.event_time}
                onChange={handleModalChange}
              />
            </label>
            <br />
            <br />

            <label className="label">
              End Time:
              <input
                type="time"
                name="end_time"
                value={updatedEventDetails.end_time}
                onChange={handleModalChange}
              />
            </label>
            <br />
            <br />

            <label className="label">
              Event Location:
              <input
                type="text"
                name="event_location"
                value={updatedEventDetails.event_location}
                onChange={handleModalChange}
              />
            </label>
            <br />
            <br />

            <label className="label">
              Event Cost:
              <input
                type="number"
                name="event_cost"
                value={updatedEventDetails.event_cost}
                onChange={handleModalChange}
              />
            </label>
            <br />
            <br />

            <div className="modalButtons">
              <button className="btn-editDelete" onClick={handleDeleteEvent}>
                Delete Event
              </button>
              <button className="btn-editSubmit" onClick={handleSubmitEdit}>
                Submit
              </button>
              <button
                className="btn-editCancel"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default EventPage;
