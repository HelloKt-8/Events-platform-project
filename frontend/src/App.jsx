import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/homePage";
import EventPage from "./Pages/eventPage";
import { AuthProvider } from "./AuthContext";
import { useEffect, useState } from "react";
import { loadGoogleAPI } from "./googleApi";
import CreateEventPage from "./Components/CreateEventPage";

const App = () => {
  const [gapiLoaded, setGapiLoaded] = useState(false);

  useEffect(() => {
    loadGoogleAPI()
      .then(() => setGapiLoaded(true))
      .catch((err) => console.error("Error loading Google API:", err));
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          {gapiLoaded ? (
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/events/:event_id" element={<EventPage />} />
              <Route path="/create-event" element={<CreateEventPage />} />
            </Routes>
          ) : (
            <p>Loading our fun activities...</p>
          )}
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
