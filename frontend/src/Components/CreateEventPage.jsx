import React, { useContext, useState } from "react";
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
      const response = await fetch("https://events-platform-project-z29t.onrender.com/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error("Failed to create event.");
      }

      alert("Event created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Error creating event. Please try again.");
    }
  };

  return (
    <div className="create-event-page">
      <h1>Create New Event</h1>
      <form onSubmit={handleSubmit}>
        {/* Form fields here */}
        <button type="submit" className="createSubmit">Create Event</button>
      </form>
    </div>
  );
};

export default CreateEventPage;
