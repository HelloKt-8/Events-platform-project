import { BrowserRouter as Router, Routes, Route } from "react-router-dom";  // Corrected the import
import HomePage from "./Pages/homePage";
import EventPage from "./Pages/eventPage";
import LoginPage from "./Pages/loginPage";
import SignUpPage from "./Pages/signUpPage";
import { AuthProvider } from "./AuthContext";

const App = () => {
  return (
    <AuthProvider>
    <Router>  {/* Use Router as the wrapper for your Routes */}
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events/:event_id" element={<EventPage />} />
          <Route path="/login/" element={<LoginPage />} />
          <Route path="/signup/" element={<SignUpPage />} />
        </Routes>
      </div>
    </Router>
    </AuthProvider>
  );
};

export default App;
