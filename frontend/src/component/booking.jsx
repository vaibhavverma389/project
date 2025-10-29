import React, { useState } from "react";
import "./css/navbar.css";
import "./css/booking.css";

const Booking = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [busFound, setBusFound] = useState(false);
  const [info, setInfo] = useState("");
  const [busData, setBusData] = useState({
    name: "--",
    type: "--",
    seats: "--",
    price: "--",
  });

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleSearch = () => {
    // 👇 Dummy logic (replace with backend API later)
    setInfo("Checking for available buses...");
    setTimeout(() => {
      setBusData({
        name: "Campus Express",
        type: "AC Seater",
        seats: "28",
        price: "120",
      });
      setBusFound(true);
      setInfo("Bus found successfully!");
    }, 1500);
  };

  const handleProceed = () => {
    alert("Proceeding to payment page...");
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

          <div className="menu-toggle" onClick={toggleMenu}>
            ☰
          </div>

          <nav className={`nav-links ${menuOpen ? "active" : ""}`} id="navLinks">
            <a href="/">Home</a>
            <a href="/booking" style={{ color: "green" }}>
              Ticket Booking
            </a>
            <a href="/ticket">My Tickets</a>
            <a href="/about">About Us</a>
            <a href="/contact">Contact Us</a>
          </nav>
        </div>
      </header>
      {/* ✅ NAVBAR END */}

      {/* ✅ MAIN SECTION */}
      <main style={{ paddingTop: "80px", textAlign: "center" }}>
        <div style={{ height: "250px" }}>
          <h1>Search Your Trip</h1>
          <h3>Plan your journey with ease!</h3>
          <p>
            Start by selecting your travel date, pickup point, exam center, and bus timing.
            Our system will instantly check availability and show you the best options
            tailored to your route.
          </p>
        </div>

        <form className="booking-form">
          <div className="book">
            <label htmlFor="date">Select Date:</label>
            <br />
            <input type="date" id="date" name="date" required />
          </div>

          <div className="book">
            <label htmlFor="pickup">Pickup Point:</label>
            <br />
            <select id="pickup" name="pickup" required>
              <option value="">Select Pickup Point</option>
              <option value="Gate No. 1">Gate No. 1</option>
              <option value="Campus Circle">Campus Circle</option>
              <option value="Hostel Main Road">Hostel Main Road</option>
            </select>
          </div>

          <div className="book">
            <label htmlFor="examCenter">Exam Center:</label>
            <br />
            <select id="examCenter" name="examCenter" required>
              <option value="">Select Exam Center</option>
              <option value="Building A">Building A</option>
              <option value="Building B">Building B</option>
              <option value="Building C">Building C</option>
            </select>
          </div>

          <div className="book">
            <label htmlFor="time">Select Time:</label>
            <br />
            <select id="time" name="time" required>
              <option value="">Select Time</option>
              <option value="forenoon">Forenoon</option>
              <option value="afternoon">Afternoon</option>
            </select>
          </div>

          <div className="button">
            <button type="button" onClick={handleSearch}>
              🔍 Search Bus
            </button>
          </div>

          {/* ✅ Info Message */}
          {info && (
            <div id="info" style={{ margin: "15px 0", fontWeight: "bold" }}>
              {info}
            </div>
          )}

          {/* ✅ Bus Result */}
          {busFound && (
            <div
              id="busResult"
              style={{
                marginTop: "20px",
                border: "1px solid #ccc",
                padding: "15px",
                borderRadius: "10px",
              }}
            >
              <h3>🚌 Bus Found</h3>
              <p>Bus Name: {busData.name}</p>
              <p>Type: {busData.type}</p>
              <p>Seats Available: {busData.seats}</p>
              <p>Price: ₹{busData.price}</p>
              <button
                type="button"
                onClick={handleProceed}
                style={{ marginTop: "10px" }}
              >
                🚍 Proceed to Payment
              </button>
            </div>
          )}
        </form>

        <br />
        <br />
      </main>

      {/* ✅ FOOTER */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-col">
            <img src="./image/bus.png" alt="Logo" className="footer-logo" />
            <h3>thesmartbus.in</h3>
            <p>
              The leading student bus ticket booking platform, making travel easier and
              more affordable.
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

export default Booking;
