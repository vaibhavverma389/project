import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/navbar.css";
import "../css/index.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function Index() {
  // Navbar toggle state
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
            <Link to="/" className="logo">
              <img src="/image/bus.png" alt="Logo" style={{ height: "40px" }} />
              <span>The Smart Bus</span>
            </Link>
          </div>

          {/* Hamburger Toggle */}
          <div className="menu-toggle" onClick={toggleMenu}>
            ☰
          </div>

          {/* Navigation Links */}
          <nav className={`nav-links ${menuOpen ? "active" : ""}`}>
            <Link to="/">Home</Link>
            <Link to="/booking">Ticket Booking</Link>
            <Link to="/ticket">My Tickets</Link>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact Us</Link>
          </nav>
        </div>
      </header>

      {/* ✅ MAIN CONTENT */}
      <main style={{ padding: "40px", textAlign: "center" }}>
        <div style={{ height: "250px" }}>
          <h1>Welcome to The Smart Bus Booking</h1>
          <p>Your one-stop solution for student-friendly bus seat booking.</p>
        </div>

        <div className="choice-bus">
          <h2>Why Choose Us?</h2>
        </div>

        <div className="choose">
          <div className="card">
            <img src="/image/user.png" alt="#" />
            <h2>User-Friendly Interface</h2>
            <p>
              Our user-friendly interface ensures smooth navigation, easy seat
              selection, and quick bookings, making your travel experience simple
              and stress-free.
            </p>
          </div>

          <div className="card">
            <img src="/image/secure-payment.png" alt="#" />
            <h2>Secure Online Payments</h2>
            <p>
              Make payments confidently with our secure gateway, ensuring your
              transaction is safe, fast, and protected with the latest encryption
              technology.
            </p>
          </div>

          <div className="card">
            <img src="/image/tickets.png" alt="#" />
            <h2>Instant Ticket & Email Confirmation</h2>
            <p>
              Receive your bus ticket instantly after booking, along with an
              automatic email confirmation for a smooth and worry-free travel
              experience.
            </p>
          </div>
        </div>

        <div className="booking-continer">
          <div className="booking-card">
            <img src="/image/search.png" alt="#" />
            <h2>Search</h2>
            <p>
              Enter your origin, destination, and travel date to explore available
              buses in seconds.
            </p>
          </div>
          <div className="booking-card">
            <img src="/image/selection.png" alt="#" />
            <h2>Select</h2>
            <p>
              Compare timings, prices, and seating charts. Pick your ideal bus and
              favorite seat with ease.
            </p>
          </div>
          <div className="booking-card">
            <img src="/image/event.png" alt="#" />
            <h2>Book</h2>
            <p>
              Confirm your seat with our fast, secure, and seamless payment system
              — no hidden charges.
            </p>
          </div>
          <div className="booking-card">
            <img src="/image/plane-ticket.png" alt="#" />
            <h2>Travel</h2>
            <p>
              Get your e-ticket instantly. Arrive on time, board easily, and
              travel in comfort and peace.
            </p>
          </div>
        </div>

        <div className="ticket">
          <Link to="/login">
            <button className="final">Book My Ticket</button>
          </Link>
        </div>
      </main>

      {/* ✅ FOOTER */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-col">
            <img src="/image/bus.png" alt="Logo" className="footer-logo" />
            <h3>TheSmartBus.in</h3>
            <p style={{ fontWeight: 500 }}>
              The leading student bus ticket booking platform, making travel
              easier and more affordable.
            </p>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/contact">Contact Us</Link>
              </li>
              <li>
                <a href="#">Terms & Conditions</a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Services</h4>
            <ul>
              <li>
                <Link to="/booking" style={{ color: "green" }}>
                  Ticket Booking
                </Link>
              </li>
              <li>
                <Link to="/ticket">My Tickets</Link>
              </li>
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
          <p>© 2025 TheSmartBus.in. All rights reserved.</p>
          <p>SINCE 2025</p>
        </div>
      </footer>
    </>
  );
}

export default Index;
