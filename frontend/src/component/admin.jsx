import React, { useState } from "react";
import "./css/admin.css";
import "./css/style.css";

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: integrate backend login (API call)
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  const showSection = (sectionId) => {
    setActiveSection(sectionId);
  };

  return (
    <div>
      {/* ✅ Header */}
      <header className="main-header">
        <div className="nav-container">
          <div className="logo">
            <a href="/admin-dashboard" className="logo">
              <img src="./image/bus.png" alt="Logo" style={{ height: "40px" }} />
              <span>The Smart Bus</span>
            </a>
          </div>

          <div className="menu-toggle">☰</div>

          <nav className="nav-links" id="navLinks">
            <a href="/">Home</a>
            <a href="/about">About Us</a>
            <a href="/contact">Contact Us</a>
          </nav>
        </div>
      </header>

      <br />
      <br />
      <br />
      <br />
      <br />

      {/* 🔐 Admin Login */}
      {!isLoggedIn ? (
        <div className="loginForm">
          <h2>🔐 Admin Login</h2>
          <form onSubmit={handleLogin}>
            <input type="email" placeholder="Email" required />
            <br />
            <input type="password" placeholder="Password" required />
            <br />
            <button type="submit">Login</button>
          </form>
          <div id="error" style={{ color: "red" }}></div>
        </div>
      ) : (
        <>
          {/* 🛠 Admin Panel */}
          <div id="panel" style={{ textAlign: "initial" }}>
            <h2>
              🛠 Admin Dashboard{" "}
              <button className="logout-btn" onClick={logout}>
                Logout
              </button>
            </h2>

            <div className="show">
              <button onClick={() => showSection("adminSection")}>
                👮 Manage Admins
              </button>
              <button onClick={() => showSection("coordinaterSection")}>
                👮 Manage Co Admins
              </button>
              <button onClick={() => showSection("studentsSection")}>
                👨‍🎓 Students
              </button>
              <button onClick={() => showSection("busSection")}>🚌 Buses</button>
              <button onClick={() => showSection("centerSection")}>
                🏫 Exam Centers
              </button>
              <button onClick={() => showSection("pickupSection")}>
                📍 Pickup Points
              </button>
              <button onClick={() => showSection("bookingsSection")}>
                📦 Bookings
              </button>
              <button onClick={() => showSection("downloadSection")}>
                📥 Export Excel
              </button>
              <button onClick={() => showSection("qrcodeupload")}>
                📥 Qr Code Adding
              </button>
            </div>

            {/* 👮 Manage Coordinators */}
            {activeSection === "coordinaterSection" && (
              <div className="section">
                <h2>👮 Manage Coordinators</h2>
                <form>
                  <input type="text" placeholder="Name" required />
                  <input type="email" placeholder="Email" required />
                  <input type="password" placeholder="Password" required />
                  <button type="submit">➕ Add Coordinator</button>
                </form>
              </div>
            )}

            {/* 📤 QR Upload */}
            {activeSection === "qrcodeupload" && (
              <div className="section">
                <h2>📤 Upload QR Code & Assign Coordinator</h2>
                <div className="form-group">
                  <label>Upload QR Code (Image)</label>
                  <input type="file" accept="image/*" />
                </div>
                <div className="form-group">
                  <label>Enter QR ID / UPI ID</label>
                  <input type="text" placeholder="e.g. vaibhav@upi" />
                </div>
                <div className="form-group">
                  <label>Assign Coordinator</label>
                  <select>
                    <option value="">-- Select Coordinator --</option>
                  </select>
                </div>
                <button>🚀 Upload & Assign</button>
              </div>
            )}

            {/* 👥 Admin Management */}
            {activeSection === "adminSection" && (
              <div className="section">
                <h3>👥 Add Admin</h3>
                <input type="text" placeholder="Full Name" required />
                <input type="tel" placeholder="Mobile Number" required />
                <input type="email" placeholder="Email" required />
                <input type="password" placeholder="Password" required />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  required
                />
                <button>➕ Add Account</button>
              </div>
            )}

            {/* 👨‍🎓 Students */}
            {activeSection === "studentsSection" && (
              <div className="section">
                <h3>👨‍🎓 Registered Students</h3>
                <input
                  type="text"
                  placeholder="Search by name or mobile"
                  onInput={() => {}}
                />
                <input type="file" />
                <button>Upload Students Excel</button>
              </div>
            )}

            {/* 🚌 Bus Management */}
            {activeSection === "busSection" && (
              <div className="section">
                <h3>🚌 Add Bus</h3>
                <input type="text" placeholder="Bus Name" />
                <input type="number" placeholder="Seat Count" />
                <input type="date" />
                <label>🚏 Pickup Points</label>
                <div id="pickupCheckboxes"></div>
                <label>🏫 Exam Center</label>
                <select>
                  <option value="">-- Select Center --</option>
                </select>
                <select>
                  <option value="">Select Timing</option>
                  <option value="Forenoon">Forenoon</option>
                  <option value="Afternoon">Afternoon</option>
                </select>
                <input type="number" placeholder="Price ₹" />
                <button>➕ Add Bus</button>
              </div>
            )}

            {/* 🏫 Centers */}
            {activeSection === "centerSection" && (
              <div className="section">
                <h3>🏫 Exam Centers</h3>
                <input type="text" placeholder="Center Name" />
                <button>Add Center</button>
              </div>
            )}

            {/* 📍 Pickup Points */}
            {activeSection === "pickupSection" && (
              <div className="section">
                <h3>📍 Pickup Points</h3>
                <input type="text" placeholder="Pickup Name" />
                <button>Add Pickup</button>
              </div>
            )}

            {/* 📦 Bookings */}
            {activeSection === "bookingsSection" && (
              <div className="section">
                <h3>📦 All Bookings</h3>
                <ul id="bookingsList"></ul>
              </div>
            )}

            {/* 📥 Export Section */}
            {activeSection === "downloadSection" && (
              <div className="section">
                <h3>📥 Export Data</h3>
                <button>Download Students Excel</button>
                <button>Download Bookings Excel</button>
                <button>📊 Bus-wise Booking Details</button>
                <button>🧾 Students Booking Status</button>
              </div>
            )}
          </div>
        </>
      )}

      <br />
      <br />
      <br />
      <br />
      <br />
      <br />

      {/* ✅ Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-col">
            <img src="./image/bus.png" alt="Logo" className="footer-logo" />
            <h3>Thesmartbus.in</h3>
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
    </div>
  );
};

export default Admin;
