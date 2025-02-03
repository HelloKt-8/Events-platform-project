import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import { getEventTypes } from "../api calls/fetchingEventTypes";

function EventPage() {
  const { event_id } = useParams();
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

  const convertToISO = (date, time) => {
    console.log("Raw Event Date:", date);
    console.log("Raw Event Time:", time);

    if (!date || !time) {
      throw new Error("Event date or time is missing");
    }

    const dateOnly = date.split("T")[0];
    console.log("Formatted Date:", dateOnly);

    let formattedTime = time;
    const timeRegex = /(\d{1,2}):(\d{2})(?:\s?(AM|PM))?/;
    const match = time.match(timeRegex);

    if (match) {
      let [, hour, minute, period] = match;
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

  return (
    <div>
      <Header />
      {loading && <p className="loading">Loading event details...</p>}
      {error && <p className="error">{error}</p>}

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
                value={
                  updatedEventDetails.event_name || eventDetails.event_name
                }
                onChange={handleModalChange}
              />
            </label>
            <br></br>
            <br></br>
            <label className="label">
              Description:
              <textarea
                name="description"
                value={
                  updatedEventDetails.description || eventDetails.description
                }
                onChange={handleModalChange}
              />
            </label>
            <br></br>
            <br></br>
            <label className="label">
              Event Location:
              <input
                type="text"
                name="event_location"
                value={
                  updatedEventDetails.event_location ||
                  eventDetails.event_location
                }
                onChange={handleModalChange}
              />
            </label>
            <br></br>
            <br></br>
            <label className="label">
              Event Cost:
              <input
                type="number"
                name="event_cost"
                value={
                  updatedEventDetails.event_cost || eventDetails.event_cost
                }
                onChange={handleModalChange}
              />
            </label>
            <br></br>
            <br></br>
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
