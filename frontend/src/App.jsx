import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/homePage";
import EventPage from "./Pages/eventPage";
import CreateEventPage from "./Components/CreateEventPage";
import { UserProvider } from "./context/UserContext";

const App = () => {
  return (
    <Router>
      <UserProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/events/:event_id" element={<EventPage />} />
            <Route path="/create-event" element={<CreateEventPage />} />
          </Routes>
        </div>
      </UserProvider>
    </Router>
  );
};

export default App;
