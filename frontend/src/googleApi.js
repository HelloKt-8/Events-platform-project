import { gapi } from "gapi-script";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

const SCOPES = "https://www.googleapis.com/auth/calendar.events";
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

export const loadGoogleAPI = () => {
  return new Promise((resolve, reject) => {
    gapi.load("client:auth2", async () => {
      try {
        await gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          scope: SCOPES,
          discoveryDocs: DISCOVERY_DOCS,
        });
        resolve(gapi);
      } catch (error) {
        reject(error);
      }
    });
  });
};

export const signInToGoogle = async () => {
  const authInstance = gapi.auth2.getAuthInstance();
  if (!authInstance.isSignedIn.get()) {
    await authInstance.signIn();
  }
  return authInstance.currentUser.get();
};

export const addEventToCalendar = async (eventDetails) => {
  try {
    const user = await signInToGoogle(); 

    const eventStart = new Date(`${eventDetails.event_date.split("T")[0]}T${eventDetails.event_time}`);
    const eventEnd = new Date(`${eventDetails.event_date.split("T")[0]}T${eventDetails.end_time}`);

    const response = await gapi.client.calendar.events.insert({
      calendarId: "primary",
      resource: {
        summary: eventDetails.event_name,
        description: eventDetails.description,
        location: eventDetails.event_location,
        start: {
          dateTime: eventStart.toISOString(),
          timeZone: "Europe/London",
        },
        end: {
          dateTime: eventEnd.toISOString(),
          timeZone: "Europe/London",
        },
      },
    });

    console.log("Event created:", response);
    return response;
  } catch (error) {
    console.error("Error creating event:", error);
    throw new Error("Failed to create event in Google Calendar.");
  }
};
