import { gapi } from "gapi-script";

const CLIENT_ID = "34184742042-hlstvun9lu5f2c00d25t7kg0gded2fq6.apps.googleusercontent.com";
const API_KEY = "AIzaSyCut8fTMLzxVyXKRn50QmDkjNlV_qafU0w";
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

// **Google Sign-In Function**
export const signInToGoogle = async () => {
  const authInstance = gapi.auth2.getAuthInstance();
  if (!authInstance.isSignedIn.get()) {
    await authInstance.signIn();
  }
  return authInstance.currentUser.get();
};

// **Function to Add Event to Google Calendar**
export const addEventToCalendar = async (eventDetails) => {
  try {
    const user = await signInToGoogle(); // Ensure the user is signed in

    const response = await gapi.client.calendar.events.insert({
      calendarId: "primary",
      resource: {
        summary: eventDetails.event_name,
        description: eventDetails.description,
        start: {
          dateTime: eventDetails.event_time, // Example: "2025-02-15T14:00:00Z"
          timeZone: "Europe/London",
        },
        end: {
          dateTime: eventDetails.end_time, // Example: "2025-02-15T16:00:00Z"
          timeZone: "Europe/London",
        },
      },
    });

    console.log("Event created:", response);
    return response;
  } catch (error) {
    console.error("Error creating event:", error);
  }
};
