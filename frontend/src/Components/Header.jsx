import React, { useContext, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import supabase from "../supabaseClient";
import { UserContext } from "../context/UserContext";

const Header = () => {
  const navigate = useNavigate();
  const { user, userProfile, setUserProfile } = useContext(UserContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://events-platform-project-z29t.onrender.com/api/events/event_name?event_name=${searchQuery}`
        );
        setSearchResults(response.data.eventName);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      }
      setLoading(false);
    };

    const debounce = setTimeout(fetchEvents, 300); // Debounce API calls
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleSelectEvent = (event) => {
    setSearchQuery(event.event_name);
    setSearchResults([]); // Hide dropdown after selection
    navigate(`/events/${event.event_id}`); // Navigate to event details page
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { queryParams: { prompt: "select_account" } },
    });

    if (error) console.error("Google Sign-in Error:", error);
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Sign out error:", error);
    else setUserProfile(null); // Reset user profile on logout
  };

  return (
    <div className="topnav">
      <a className="active" href="/">LondonLife</a>

      <div className="search-container relative">
        <input
          type="text"
          placeholder="Search event"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="searchBarInput border p-2 rounded w-full"
        />
        <button type="submit">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>

        {/* Dropdown Results */}
        {searchResults.length > 0 && (
          <ul className="dropdown absolute bg-white border w-full mt-1 rounded shadow-lg max-h-60 overflow-y-auto">
            {searchResults.map((event) => (
              <li
                key={event.event_id}
                className="p-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => handleSelectEvent(event)}
              >
                {event.event_name}
              </li>
            ))}
          </ul>
        )}

        {loading && <div className="absolute bg-white p-2">Loading...</div>}
      </div>

      <div className="auth-container">
        {userProfile ? (
          <div>
            <p>Welcome, {userProfile.username || userProfile.email}</p>
            {userProfile.user_type === "admin" || userProfile.user_type === "staff" ? (
              <button className="create-event-button" onClick={() => navigate("/create-event")}>
                Create Event
              </button>
            ) : null}
            <button className="auth-button" onClick={signOut}>Sign Out</button>
          </div>
        ) : (
          <button className="auth-button" onClick={signInWithGoogle}>
            Sign in with Google
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
