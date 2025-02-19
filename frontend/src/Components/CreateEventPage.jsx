import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateEventPage = () => {
  const navigate = useNavigate();
  const { userProfile } = useContext(UserContext);
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventCost, setEventCost] = useState("");
  const [eventImg, setEventImg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      !userProfile ||
      (userProfile.user_type !== "admin" && userProfile.user_type !== "staff")
    ) {
      toast("You are not authorized to create events.");
      navigate("/");
    }
  }, [userProfile, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !eventName ||
      !eventType ||
      !eventDate ||
      !eventTime ||
      !endTime ||
      !eventDescription ||
      !eventLocation ||
      !eventCost ||
      !eventImg
    ) {
      toast.warn("Please fill in all fields.");
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
      user_id: userProfile?.user_id,
    };

    try {
      setLoading(true);
      const response = await fetch(
        "https://events-platform-project-z29t.onrender.com/api/events",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventData),
        }
      );

      if (!response.ok) throw new Error("Failed to create event.");

      toast.success("Event created successfully!");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error("Error creating event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-event-page">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1>Create New Event</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Event Name:<span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>
            Event Type:<span style={{ color: "red" }}>*</span>
          </label>
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            required
          >
            <option value="" disabled>
              Select an event type
            </option>
            <option value="sport">Sport</option>
            <option value="comedy">Comedy</option>
            <option value="party">Party</option>
            <option value="music">Music</option>
            <option value="holidays">Holidays</option>
            <option value="games">Games</option>
            <option value="food">Food</option>
            <option value="networking">Networking</option>
          </select>
        </div>

        <div>
          <label>
            Event Date:<span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label>
            Event Time:<span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="time"
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
            required
          />
        </div>

        <div>
          <label>
            End Time:<span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>

        <div>
          <label>
            Description:<span style={{ color: "red" }}>*</span>
          </label>
          <textarea
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div>
          <label>
            Event Location:<span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            value={eventLocation}
            onChange={(e) => setEventLocation(e.target.value)}
            required
          />
        </div>

        <div>
          <label>
            Event Cost (£):<span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="number"
            value={eventCost}
            onChange={(e) => setEventCost(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Event Image URL:</label>
          <input
            type="url"
            value={eventImg}
            onChange={(e) => setEventImg(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="createSubmit" disabled={loading}>
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default CreateEventPage;
