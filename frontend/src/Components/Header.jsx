import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  return (
    <>
      <div class="topnav">
        <a class="active" href="#home">
          LondonLife
        </a>
        <div class='clickables'>
        <a href="#login">Login</a>
        <a href="#signup">Sign up</a>
        <a href="#events">Find Events</a>
        </div>
        <div class="search-container">
          <form action="/action_page.php">
            <input type="text" placeholder="Search event" name="search"></input>
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
