import React from "react";
import "./navbar.css"; // same CSS file
import { FaLinkedinIn, FaInstagram, FaTwitter } from "react-icons/fa";

const Contact = () => {
  const toggleMenu = () => {
    const navLinks = document.getElementById("navLinks");
    navLinks.classList.toggle("active");
  };

  return (
    <>
      {/* ✅ NAVBAR START */}
      <header className="main-header">
        <div className="nav-container">
          <div className="logo">
            <a href="/" className="logo">
              <img src="/image/bus.png" alt="Logo" style={{ height: "40px" }} />
              <span>The Smart Bus</span>
            </a>
          </div>

          {/* Hamburger Toggle */}
          <div className="menu-toggle" onClick={toggleMenu}>
            ☰
          </div>

          {/* Navigation Links */}
          <nav className="nav-links" id="navLinks">
            <a href="/">Home</a>
            <a href="/booking">Ticket Booking</a>
            <a href="/ticket">My Tickets</a>
            <a href="/about">About Us</a>
            <a href="/contact">Contact Us</a>
            <div id="navbar-right"></div>
          </nav>
        </div>
      </header>
      {/* ✅ NAVBAR END */}

      {/* ✅ MAIN SECTION */}
      <main style={{ padding: "40px", textAlign: "center" }}>
        <div style={{ height: "250px" }}>
          <h1>Welcome to Smart Bus Booking</h1>
          <p>Your one-stop solution for student-friendly bus seat booking.</p>
        </div>
      </main>

      {/* ✅ FOOTER */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-col">
            <img src="/image/bus.png" alt="Logo" className="footer-logo" />
            <h3>smartbus.in</h3>
            <p>
              The leading student bus ticket booking platform, making travel
              easier and more affordable.
            </p>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact Us</a></li>
              <li><a href="#">Terms & Conditions</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Services</h4>
            <ul>
              <li>
                <a href="/booking" style={{ color: "green" }}>
                  Ticket Booking
                </a>
              </li>
              <li><a href="/ticket">My Tickets</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Connect With Us</h4>
            <div className="footer-icons">
              <a href="https://www.linkedin.com/in/vaibhavverma389/">
                <FaLinkedinIn />
              </a>
              <a href="https://www.instagram.com/vaibhavverma389/">
                <FaInstagram />
              </a>
              <a href="#"><FaTwitter /></a>
            </div>
            <p>Email: contact@smartbus.in</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 Smartbus.in. All rights reserved.</p>
          <p>SINCE 2025</p>
        </div>
      </footer>
    </>
  );
};

export default Contact;
