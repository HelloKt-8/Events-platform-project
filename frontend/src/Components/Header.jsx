import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom"; // If you use React Router
import { useAuth } from "../AuthContext";
import { supabase } from "../supabaseClient";
import { useEffect } from "react";

const Header = () => {
  const { user, loading } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  useEffect(() => {
    if (user) {
      console.log('User is logged in:', user);
    } else {
      console.log('No user is logged in');
    }
  }, [user]);

  return (
    <>
      <div className="topnav">
        <a className="active" href="/">
          LondonLife
        </a>
        <div className="clickables">
          {/* Use Link for React Router or standard anchor for basic redirects */}
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign up</Link>
          <Link to="/events">Events Calendar</Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
        <div className="search-container">
          <form action="/action_page.php">
            <input type="text" placeholder="Search event" name="search" />
            <button type="submit">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </form>
        </div>
        if (loading) return <p>Loading...</p>;
      </div>
    </>
  );
};

export default Header;
