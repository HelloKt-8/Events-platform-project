import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { supabase } from "../supabaseClient";

const Header = () => {
  const { user } = useAuth(); // Get user from AuthContext
  const navigate = useNavigate(); // Initialize useNavigate

  // Handle Google sign-in
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
    try {
      await supabase.auth.signOut(); // Perform logout
      navigate("/"); // Redirect to the homepage after logout
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="topnav">
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

      {/* Navigation Links */}
      <a className="active" href="/">
        LondonLife
      </a>
      <div className="clickables">
        <a href="/events">Events Calendar</a>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <form action="/action_page.php">
          <input type="text" placeholder="Search event" name="search" />
          <button type="submit">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Header;
