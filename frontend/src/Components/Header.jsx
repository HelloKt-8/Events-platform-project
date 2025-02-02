import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { supabase } from "../supabaseClient";
import { gapi } from "gapi-script"; // Ensure gapi is imported
import { getEventTypes } from "../api calls/fetchingEventTypes"; // Import event fetching function

const Header = () => {
  const { user } = useAuth(); // Get user from AuthContext
  const navigate = useNavigate(); // Initialize useNavigate

  // State for search input, results, and dropdown visibility
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      if (error) throw error;
      console.log("Successfully signed in with Google");
    } catch (error) {
      console.error("Google sign-in error:", error.message);
    }
  };

  const handleLogout = async () => {
    console.log("Attempting to log out...");
    try {
      // Ensure gapi is loaded
      if (!gapi.auth2.getAuthInstance()) {
        console.error("Google API client not initialized");
        return;
      }

      const authInstance = gapi.auth2.getAuthInstance();
      if (authInstance.isSignedIn.get()) {
        await authInstance.signOut(); // Google sign out
        console.log("Google logout successful!");
      } else {
        console.log("User not signed in to Google");
      }

      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error during Supabase logout:", error.message);
      } else {
        console.log("Supabase logout successful!");
        alert("You have successfully logged out.");
        navigate("/"); // Redirect to homepage
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleCreateEvent = () => {
    navigate("/create-event");
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleEventSelect = (eventId) => {
    navigate(`/event/${eventId}`); // Navigate to the event page
    setSearchQuery(""); // Clear search input
    setShowDropdown(false); // Hide dropdown
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    getEventTypes(searchQuery)
      .then((events) => {
        setSearchResults(events || []);
        setShowDropdown(events.length > 0);
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
        setSearchResults([]);
        setShowDropdown(false);
      });
  }, [searchQuery]);

  return (
    <div className="topnav">
      <a className="active" href="/">
        LondonLife
      </a>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search event"
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => setShowDropdown(searchResults.length > 0)}
        />

        {/* Search Dropdown */}
        {showDropdown && (
          <ul className="search-dropdown">
            {searchResults.map((event) => (
              <li
                key={event.event_id}
                className="search-result-item"
                onClick={() => handleEventSelect(event.event_id)}
              >
                <strong>{event.event_name}</strong>
                <p>{event.event_location}</p>
                <p>{new Date(event.event_date).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        )}

        <button type="submit">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </div>
      {/* Navigation Links */}

      {/* Create Event Button (only visible for admin or staff) */}
      {user && (user.user_type === "admin" || user.user_type === "staff") && (
        <button className="create-event-button" onClick={handleCreateEvent}>
          Create Event
        </button>
      )}

      {/* Google Sign In / Logout Button */}
      <div className="auth-button-container">
        {!user ? (
          <button className="auth-button" onClick={handleGoogleSignIn}>
            Login / Sign Up with Google
          </button>
        ) : (
          <button className="auth-button" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
