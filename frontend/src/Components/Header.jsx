import React, { useContext, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { getEventTypes } from "../api calls/fetchingEventTypes";
import supabase from "../supabaseClient";
import { UserContext } from "../context/UserContext"; 

const Header = () => {
  const navigate = useNavigate();
  const { user, userProfile, setUserProfile } = useContext(UserContext);

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
    else {
      setUserProfile(null); // Reset user profile on logout
    }
  };

  useEffect(() => {
    console.log("User:", user);
    console.log("UserProfile:", userProfile);
  }, [user, userProfile]);

  return (
    <div className="topnav">
      <a className="active" href="/">LondonLife</a>

      <div className="search-container">
        <input type="text" placeholder="Search event" />
        <button type="submit">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </div>

      <div className="auth-container">
        {userProfile ? (
          <div>
            <p>Welcome, {userProfile.username || userProfile.email}</p>

            {(userProfile.user_type === "admin" || userProfile.user_type === "staff") && (
              <button onClick={() => navigate("/create-event")}>Create Event</button>
            )}

            <button onClick={signOut}>Sign Out</button>
          </div>
        ) : (
          <button onClick={signInWithGoogle}>Sign in with Google</button>
        )}
      </div>
    </div>
  );
};

export default Header;
