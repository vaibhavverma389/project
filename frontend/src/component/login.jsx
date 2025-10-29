import React, { useState } from "react";

const StudentLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  // Handle input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle login (static for now)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please enter both email and password.");
    } else {
      setError("");
      alert("Static login successful (backend connect baad me karenge)");
    }
  };

  return (
    <div>
      {/* ✅ NAVBAR */}
      <header className="main-header">
        <div className="nav-container">
          <div className="logo">
            <a href="/" className="logo">
              <img src="/image/bus.png" alt="Logo" style={{ height: "40px" }} />
              <span>The Smart Bus</span>
            </a>
          </div>

          <div className="menu-toggle">☰</div>

          <nav className="nav-links" id="navLinks">
            <a href="/">Home</a>
            <a href="/booking">Ticket Booking</a>
            <a href="/ticket">My Tickets</a>
            <a href="/about">About Us</a>
            <a href="/contact">Contact Us</a>
          </nav>
        </div>
      </header>

      {/* ✅ MAIN LOGIN FORM */}
      <main style={{ marginTop: "80px" }}>
        <div className="login-container">
          <h2>🎓 Student Login</h2>

          <form id="studentLoginForm" onSubmit={handleSubmit}>
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {error && (
              <div style={{ color: "red", fontWeight: "bold" }}>{error}</div>
            )}
            <button type="submit">Login</button>
          </form>

          <div className="links">
            <p>
              <a href="/forgot-password">Forgot Password (OTP)?</a>
            </p>
            <p>
              Don't have an account? <a href="/register">Signup here</a>
            </p>
          </div>
        </div>
      </main>

      {/* ✅ FOOTER */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-col">
            <img src="/image/bus.png" alt="Logo" className="footer-logo" />
            <h3>Thesmartbus.in</h3>
            <p>
              The leading student bus ticket booking platform, making travel
              easier and more affordable.
            </p>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/about">About Us</a>
              </li>
              <li>
                <a href="/contact">Contact Us</a>
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
                <a href="/booking" style={{ color: "green" }}>
                  Ticket Booking
                </a>
              </li>
              <li>
                <a href="/ticket">My Tickets</a>
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
          <p>© 2025 Thesmartbus.in. All rights reserved.</p>
          <p>SINCE 2025</p>
        </div>
      </footer>
    </div>
  );
};

export default StudentLogin;
