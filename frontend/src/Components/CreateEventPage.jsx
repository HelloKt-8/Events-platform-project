import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext"; // Import User Context

const CreateEventPage = () => {
  const navigate = useNavigate();
  const { userProfile } = useContext(UserContext); // Get global user profile
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventCost, setEventCost] = useState("");
  const [eventImg, setEventImg] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  // Redirect unauthorized users
  useEffect(() => {
    if (!userProfile || (userProfile.user_type !== "admin" && userProfile.user_type !== "staff")) {
      alert("You are not authorized to create events.");
      navigate("/");
    }
  }, [userProfile, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!eventName || !eventType || !eventDate || !eventTime || !endTime || !eventDescription || !eventLocation || !eventCost || !eventImg) {
      alert("Please fill in all fields.");
      return;
    }

    const eventData = {
      event_name: eventName,
      event_type: eventType,
      event_date: eventDate,
      event_time: eventTime,
      end_time: endTime,
      description: eventDescription,
      event_location: eventLocation,
      event_cost: parseFloat(eventCost),
      event_img: eventImg,
      user_id: userProfile?.user_id, // Attach user_id from global state
    };

    try {
      setLoading(true); // Show loading state
      const response = await fetch("https://events-platform-project-z29t.onrender.com/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) throw new Error("Failed to create event.");

      alert("✅ Event created successfully!");
      navigate("/"); // Redirect to homepage
    } catch (error) {
      console.error("❌ Error creating event:", error);
      alert("Error creating event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-event-page">
      <h1>Create New Event</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Event Name:</label>
          <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} required />
        </div>

        <div>
          <label>Event Type:</label>
          <input type="text" value={eventType} onChange={(e) => setEventType(e.target.value)} required />
        </div>

        <div>
          <label>Event Date:</label>
          <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
        </div>

        <div>
          <label>Event Time:</label>
          <input type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} required />
        </div>

        <div>
          <label>End Time:</label>
          <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
        </div>

        <div>
          <label>Description:</label>
          <textarea value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} required></textarea>
        </div>

        <div>
          <label>Event Location:</label>
          <input type="text" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} required />
        </div>

        <div>
          <label>Event Cost (£):</label>
          <input type="number" value={eventCost} onChange={(e) => setEventCost(e.target.value)} required />
        </div>

        <div>
          <label>Event Image URL:</label>
          <input type="url" value={eventImg} onChange={(e) => setEventImg(e.target.value)} required />
        </div>

        <button type="submit" className="createSubmit" disabled={loading}>
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
};

export default CreateEventPage;
