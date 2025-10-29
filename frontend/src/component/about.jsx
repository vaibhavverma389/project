import React, { useState } from "react";
import "./css/navbar.css";

const About = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      {/* ✅ NAVBAR START */}
      <header className="main-header">
        <div className="nav-container">
          <div className="logo">
            <a href="/" className="logo">
              <img src="./image/bus.png" alt="Logo" style={{ height: "40px" }} />
              <span>The Smart Bus</span>
            </a>
          </div>

          {/* Hamburger Toggle */}
          <div className="menu-toggle" onClick={toggleMenu}>
            ☰
          </div>

          {/* Navigation Links */}
          <nav className={`nav-links ${menuOpen ? "active" : ""}`} id="navLinks">
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

      {/* ✅ MAIN CONTENT */}
      <main style={{ padding: "40px", textAlign: "center" }}>
        <div style={{ height: "250px" }}>
          <h1>About The SmartBus Booking</h1>
          <p>
            Welcome to <strong>The SmartBus Booking System</strong> — your reliable, student-friendly platform for easy and affordable bus seat booking.
          </p>
          <p>
            We are dedicated to making travel simpler, safer, and more convenient for students. Our goal is to combine technology with accessibility, 
            providing a seamless booking experience.
          </p>
        </div>
      </main>

      {/* ✅ FOOTER START */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-col">
            <img src="./image/bus.png" alt="Logo" className="footer-logo" />
            <h3>Thesmartbus.in</h3>
            <p>
              The leading student bus ticket booking platform, making travel easier and more affordable.
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
              <li><a href="/booking" style={{ color: "green" }}>Ticket Booking</a></li>
              <li><a href="/ticket">My Tickets</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Connect With Us</h4>
            <div className="footer-icons">
              <a href="https://www.linkedin.com/in/vaibhavverma389/">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="https://www.instagram.com/vaibhavverma389/">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#">
                <i className="fab fa-twitter"></i>
              </a>
            </div>
            <p>Email: contact@thesmartbus.in</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 Thesmartbus.in. All rights reserved.</p>
          <p>SINCE 2025</p>
        </div>
      </footer>
    </>
  );
};

export default About;
