import { BrowserRouter as Router, Routes, Route } from "react-router-dom";  // Corrected the import
import HomePage from "./Pages/homePage";
import EventPage from "./Pages/eventPage";

const App = () => {
  return (
    <Router>  {/* Use Router as the wrapper for your Routes */}
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events/:event_id" element={<EventPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
