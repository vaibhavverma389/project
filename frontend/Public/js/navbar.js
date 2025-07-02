
document.addEventListener("DOMContentLoaded", async () => {
  const navRight = document.getElementById("navbar-right");
  const token = localStorage.getItem("studentToken");

  if (token) {
    let name = localStorage.getItem("name");
    let email = localStorage.getItem("email");

    // 🔄 Fetch only if data is missing
    if (!name || !email) {
      try {
        const res = await fetch('/api/student/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        name = data.name || "vaibhav";
        email = data.email || "unknown@example.com";

        localStorage.setItem("name", name);
        localStorage.setItem("email", email);
      } catch (err) {
        console.error("Failed to fetch student info", err);
        name = "Vaibhav";
        email = "unknown@example.com";
      }
    }

    // 🔽 Build navbar dropdown
    navRight.innerHTML = `
      <div class="user-dropdown">
        <button class="user-circle" onclick="toggleDropdown()">${name.charAt(0).toUpperCase()}</button>
        <div id="dropdown" class="dropdown-content">
          <p><strong>${name}</strong><br><small>${email}</small></p>
          <a href="ticket.html">🎟 My Tickets</a>
          <a href="profile.html">👤 Update Profile</a>

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


