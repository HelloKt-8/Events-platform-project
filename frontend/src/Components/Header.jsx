import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom"; // If you use React Router

const Header = () => {
  return (
    <>
      <div className="topnav">
        <a className="active" href="#home">
          LondonLife
        </a>
        <div className="clickables">
          {/* Use Link for React Router or standard anchor for basic redirects */}
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign up</Link>
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
    </>
  );
};

export default Header;
