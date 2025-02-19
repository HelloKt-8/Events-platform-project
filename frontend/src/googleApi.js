export const addEventToCalendar = async (eventDetails, token) => {
  try {
    const eventStart = new Date(
      `${eventDetails.event_date.split("T")[0]}T${eventDetails.event_time}`
    );
    const eventEnd = new Date(
      `${eventDetails.event_date.split("T")[0]}T${eventDetails.end_time}`
    );

    const event = {
      summary: eventDetails.event_name,
      description: eventDetails.description,
      location: eventDetails.event_location,
      start: { dateTime: eventStart.toISOString(), timeZone: "Europe/London" },
      end: { dateTime: eventEnd.toISOString(), timeZone: "Europe/London" },
    };

    console.log("event in google format", event);
    await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      }
    ).then((data) => {
      return data.json();
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create event in Google Calendar.");
  }
};
