import React from "react";
import "./css/navbar.css";
import "./css/profile.css";

const SignupPage = () => {
  return (
    <>
      {/* ✅ NAVBAR START */}
      <header className="main-header">
        <div className="nav-container">
          <div className="logo">
            <a href="index.html" className="logo">
              <img src="./image/bus.png" alt="Logo" style={{ height: "40px" }} />
              <span>The Smart Bus</span>
            </a>
          </div>

          <div className="menu-toggle" onClick={() => toggleMenu()}>
            ☰
          </div>

          <nav className="nav-links" id="navLinks">
            <a href="index.html">Home</a>
            <a href="booking.html">Ticket Booking</a>
            <a href="ticket.html">My Tickets</a>
            <a href="about.html">About Us</a>
            <a href="contact.html">Contact Us</a>
            <div id="navbar-right"></div>
          </nav>
        </div>
      </header>
      {/* ✅ NAVBAR END */}

      {/* ✅ SIGNUP FORM */}
      <main className="profile-container">
        <h2>Student Sign Up</h2>
        <form id="signupForm">
          <label htmlFor="name">Full Name:</label>
          <input type="text" id="name" required />

          <label htmlFor="email">Email ID:</label>
          <input type="email" id="email" required />

          <label htmlFor="mobile">Mobile Number:</label>
          <input type="tel" id="mobile" pattern="[0-9]{10}" required />

          <label htmlFor="pmobile">Parent Mobile Number:</label>
          <input type="text" id="pmobile" placeholder="Parent Mobile" />

          <label htmlFor="roll">University Roll Number:</label>
          <input type="text" id="roll" required />

          <label htmlFor="gender">Gender:</label>
          <select id="gender" required>
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <label htmlFor="password">Password:</label>
          <input type="password" id="password" minLength="6" required />

          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input type="password" id="confirmPassword" required />

          <button type="submit">Create Account</button>
        </form>
      </main>

      {/* ✅ FOOTER */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-col">
            <img src="./image/bus.png" alt="Logo" className="footer-logo" />
            <h3>thesmartbus.in</h3>
            <p style={{ fontWeight: 500 }}>
              The leading student bus ticket booking platform, making travel
              easier and more affordable.
            </p>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="index.html">Home</a></li>
              <li><a href="about.html">About Us</a></li>
              <li><a href="contact.html">Contact Us</a></li>
              <li><a href="#">Terms & Conditions</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Services</h4>
            <ul>
              <li>
                <a href="booking.html" style={{ color: "green" }}>
                  Ticket Booking
                </a>
              </li>
              <li><a href="ticket.html">My Tickets</a></li>
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
              <a href="#"><i className="fab fa-twitter"></i></a>
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

// ✅ Navbar toggle function
const toggleMenu = () => {
  const navLinks = document.getElementById("navLinks");
  if (navLinks) {
    navLinks.classList.toggle("active");
  }
};

export default SignupPage;
