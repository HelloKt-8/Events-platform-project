import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { useAuth } from "../AuthContext"; // Path to your AuthContext
import { supabase } from "../supabaseClient";

const Header = () => {
  const { user } = useAuth(); // Get user from AuthContext
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut(); // Perform logout
      navigate("/login"); // Redirect to the login page
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="topnav">
      <a className="active" href="/">
        LondonLife
      </a>
      <div className="clickables">
        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign up</Link>
          </>
        ) : (
          <button onClick={handleLogout}>Logout</button>
        )}
        <Link to="/events">Events Calendar</Link>
      </div>
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
