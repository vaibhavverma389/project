import React from "react";
import "./css/navbar.css";
import "./css/payment.css";

const PaymentPage = () => {
  return (
    <>
      {/* ✅ NAVBAR START */}
      <header className="main-header">
        <div className="nav-container">
          <div className="logo">
            <a href="index.html" className="logo">
              <img src="./image/bus.png" alt="Logo" style={{ height: "40px" }} />
              <span>THE SMART BUS</span>
            </a>
          </div>
          <div className="menu-toggle" onClick={() => toggleMenu()}>☰</div>
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

      <main style={{ padding: "40px", textAlign: "center" }} className="payment-container">
        <h2>🧾 Upload Payment Proof</h2>
        <div id="paymentDetails"></div>
        <div id="qrContainer" style={{ marginTop: "20px" }}></div>

        <label>🧾 UTR Number:</label>
        <input type="text" id="utrNumber" placeholder="Enter UTR number" required />

        <label>📤 Upload Screenshot:</label>
        <input type="file" id="screenshot" accept="image/*" required />
        <br />
        <button id="submitProof">Submit Payment</button>
      </main>

      {/* ✅ FOOTER */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-col">
            <img src="./image/bus.png" alt="Logo" className="footer-logo" />
            <h3>thesmartbus.in</h3>
            <p>
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
              <li><a href="booking.html" style={{ color: "green" }}>Ticket Booking</a></li>
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

// Temporary function to handle menu toggle (React-safe version)
const toggleMenu = () => {
  const navLinks = document.getElementById("navLinks");
  if (navLinks) {
    navLinks.classList.toggle("active");
  }
};

export default PaymentPage;
