import React, { useState } from "react";
import "./navbarstyle.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav>
      <div className="logo">SigVault</div>
      <button className="hamburger" onClick={toggleMenu}>
        <span className={isOpen ? "hamburger-icon open" : "hamburger-icon"}></span>
      </button>
      <ul className={isOpen ? "nav-links open" : "nav-links"}>
        <li>
          <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>Home</Link>
        </li>
        <li>
          <Link to="/verification" className="nav-link" onClick={() => setIsOpen(false)}>Verification</Link>
        </li>
        {/* <li> */}
          {/* <a href="#" className="nav-link" onClick={() => setIsOpen(false)}>About Us</a> */}
        {/* </li> */}
        <li>
          <Link to="/login" className="nav-link" onClick={() => setIsOpen(false)}>Login</Link>
        </li>
        <li>
          <Link to="/signup" className="nav-link" onClick={() => setIsOpen(false)}>Signup</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;