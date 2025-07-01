// admin.js

const API = '/api';
const token = localStorage.getItem('adminToken');
const role = localStorage.getItem('adminRole');

// 🔐 Login
const loginForm = document.getElementById('loginForm');
loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const res = await fetch('/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (data.token) {
    localStorage.setItem('adminToken', data.token);
    localStorage.setItem('adminRole', data.role);
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('panel').style.display = 'block';
    restrictUI(data.role);
    loadAdmins();
  } else {
    document.getElementById('loginError').innerText = data.message;
  }
});

// 🔐 Role-Based Restriction
function restrictUI(role) {
  if (role === 'co-admin') {
    document.getElementById('adminSection')?.remove();
  }
}

// 🚪 Logout
function logout() {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminRole');
  location.reload();
}

// 👁 Show Section
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}

// 👮 Add Admin/Co-Admin
async function addAdmin() {
  const name = document.getElementById("adminName").value;
  const mobile = document.getElementById("adminMobile").value;
  const email = document.getElementById("adminEmail").value;
  const password = document.getElementById("adminPassword").value;
  const confirmPassword = document.getElementById("adminConfirmPassword").value;
  const role = document.getElementById("adminRole").value;

  if (!name || !mobile || !email || !password || !confirmPassword || !role) return alert("Fill all fields.");
  if (password !== confirmPassword) return alert("Passwords do not match.");

  const res = await fetch(`/admin/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': token },
    body: JSON.stringify({ name, mobile, email, password, role })
  });
  const data = await res.json();
  alert(data.message);
  loadAdmins();
}

// 📋 Load Admins
async function loadAdmins() {
  const res = await fetch(`/admin/all`, {
    headers: { 'Authorization': token }
  });
  const data = await res.json();
  const list = document.getElementById('adminList');
  list.innerHTML = '';
  data.forEach(admin => {
    const li = document.createElement('li');
    li.innerHTML = `<b>${admin.name}</b> (${admin.role}) - ${admin.email} - ${admin.mobile}
      ${admin.role !== 'admin' ? `<button onclick="deleteAdmin('${admin._id}')">🗑 Delete</button>` : ''}`;
    list.appendChild(li);
  });
}

// ❌ Delete Admin
async function deleteAdmin(id) {
  if (!confirm("Are you sure to delete?")) return;
  const res = await fetch(`/admin/delete/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': token }
  });
  const data = await res.json();
  alert(data.message);
  loadAdmins();
}

// 👨‍🎓 Load Students
async function loadStudents() {
  const res = await fetch(`/admin/students`, { headers: { Authorization: token } });
  const data = await res.json();
  const list = document.getElementById('studentsList');
  list.innerHTML = '';
  data.forEach((s, i) => {
    const li = document.createElement('li');
    li.innerText = `${i + 1}. ${s.name} - ${s.email} - ${s.universityRoll}`;
    list.appendChild(li);
  });
}

// 🚌 Add Bus
async function addBus() {
  const busName = document.getElementById('busName').value;
  const seatCount = document.getElementById('seatCount').value;
  const travelDate = document.getElementById('travelDate').value;
  const timing = document.getElementById('busTiming').value;
  const price = document.getElementById('price').value;

  if (!busName || !seatCount || !travelDate || !timing || !price) return alert("Fill all fields.");

  const res = await fetch(`/admin/bus`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: token },
    body: JSON.stringify({ busName, seatCount, travelDate, timing, price })
  });
  const data = await res.json();
  alert(data.message);
  loadBuses();
}

// 🚌 Load Buses
async function loadBuses() {
  const res = await fetch(`/admin/buses`, { headers: { Authorization: token } });
  const data = await res.json();
  const list = document.getElementById('busList');
  list.innerHTML = '';
  data.forEach((b, i) => {
    const li = document.createElement('li');
    li.innerText = `${i + 1}. ${b.busName} - ${b.travelDate} - ${b.timing} - ₹${b.price}`;
    list.appendChild(li);
  });
}

// 🏫 Add Center
async function addCenter() {
  const center = document.getElementById('centerInput').value;
  if (!center) return;
  const res = await fetch(`/admin/center`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: token },
    body: JSON.stringify({ name: center })
  });
  const data = await res.json();
  alert(data.message);
  loadCenters();
}

async function loadCenters() {
  const res = await fetch(`/admin/centers`, { headers: { Authorization: token } });
  const data = await res.json();
  const list = document.getElementById('centerList');
  list.innerHTML = '';
  data.forEach(c => {
    const li = document.createElement('li');
    li.innerText = c.name;
    list.appendChild(li);
  });
}

// 📍 Add Pickup
async function addPickup() {
  const pickup = document.getElementById('pickupInput').value;
  if (!pickup) return;
  const res = await fetch(`/admin/pickup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: token },
    body: JSON.stringify({ name: pickup })
  });
  const data = await res.json();
  alert(data.message);
  loadPickups();
}

async function loadPickups() {
  const res = await fetch(`/admin/pickups`, { headers: { Authorization: token } });
  const data = await res.json();
  const list = document.getElementById('pickupList');
  list.innerHTML = '';
  data.forEach(p => {
    const li = document.createElement('li');
    li.innerText = p.name;
    list.appendChild(li);
  });
}

// 📥 Download Excel
function downloadStudents() {
  window.open(`/admin/export/students?token=${token}`);
}
function downloadBookings() {
  window.open(`/admin/export/bookings?token=${token}`);
}
function downloadBusBookings() {
  window.open(`/admin/export/bus-wise?token=${token}`);
}

// ⏱ Auto-login
window.onload = () => {
  if (token && role) {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('panel').style.display = 'block';
    restrictUI(role);
    loadAdmins();
    loadStudents();
    loadCenters();
    loadPickups();
    loadBuses();
  }
};
