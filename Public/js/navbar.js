// Public/js/navbar.js
document.addEventListener("DOMContentLoaded", () => {
  const navRight = document.getElementById("navbar-right");
  const token = localStorage.getItem("studentToken");
  const name = localStorage.getItem("studentName") || "U";

  if (token) {
    navRight.innerHTML = `
      <div class="user-dropdown">
        <button class="user-circle" onclick="toggleDropdown()">${name.charAt(0).toUpperCase()}</button>
        <div id="dropdown" class="dropdown-content">
          <p><strong>${name}</strong><br><small>Logged in</small></p>
          <a href="ticket.html">🎟 My Tickets</a>
          <a href="profile.html">👤 Update Profile</a>
          <a href="whatsapp.html">🟢 WhatsApp Groups</a>
          <a href="#" onclick="logout()">🚪 Sign Out</a>
        </div>
      </div>
    `;
  } else {
    navRight.innerHTML = `
      <a href="login.html"><button class="nav-btn">Login</button></a>
      <a href="register.html"><button class="nav-btn">Register</button></a>
    `;
  }
});

function toggleDropdown() {
  document.getElementById("dropdown")?.classList.toggle("show");
}

function toggleMenu() {
  const nav = document.getElementById("navLinks");
  nav.classList.toggle("show");
}

function logout() {
  localStorage.clear();
  location.href = "index.html";
}

window.onclick = function (e) {
  if (!e.target.matches('.user-circle')) {
    document.querySelectorAll('.dropdown-content').forEach(drop => drop.classList.remove('show'));
  }
};
