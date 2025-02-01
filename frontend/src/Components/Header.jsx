import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { supabase } from "../supabaseClient";
import { gapi } from "gapi-script"; // Ensure gapi is imported

const Header = () => {
  const { user } = useAuth(); // Get user from AuthContext
  const navigate = useNavigate(); // Initialize useNavigate

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
      console.error("Error during logout:", error); // Log unexpected errors
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
