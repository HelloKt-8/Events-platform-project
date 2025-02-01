import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/homePage";
import EventPage from "./Pages/eventPage";
import { AuthProvider } from "./AuthContext";
import { useEffect, useState } from "react";
import { loadGoogleAPI } from "./googleApi";

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
            </Routes>
          ) : (
            <p>Loading Google API...</p>
          )}
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
