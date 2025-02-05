import React, { useContext, useState, useEffect } from "react";
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
        console.error("search error:", error);
        setSearchResults([]);
      }
      setLoading(false);
    };

    const debounce = setTimeout(fetchEvents, 300); 
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleSelectEvent = (event) => {
    setSearchQuery(event.event_name);
    setSearchResults([]); 
    navigate(`/events/${event.event_id}`);
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { queryParams: { prompt: "select_account" } },
    });

    if (error) console.error(error);
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error(error);
    else setUserProfile(null); 
  };

  return (
    <div className="topnav">
      <a className="logo" href="/">
        LONDONLIFE
      </a>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search event"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />

        {searchResults.length > 0 && (
          <ul className="dropdown">
            {searchResults.map((event) => (
              <li
                key={event.event_id}
                className="dropdown-item"
                onClick={() => handleSelectEvent(event)}
              >
                {event.event_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="auth-container">
        {userProfile ? (
          <div>
             <div className="welcome-text">
              Welcome, {userProfile.username || userProfile.email}
            </div>
            {userProfile.user_type === "admin" ||
            userProfile.user_type === "staff" ? (
              <button
                className="create-event-button"
                onClick={() => navigate("/create-event")}
              >
                Create Event
              </button>
            ) : null}
            <button className="auth-button" onClick={signOut}>
              Sign Out
            </button>
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
