// const API = '/api';
// const token = localStorage.getItem('adminToken');
// const role = localStorage.getItem('adminRole');

// // 🔐 Login
// const loginForm = document.getElementById('loginForm');
// loginForm?.addEventListener('submit', async (e) => {
//   e.preventDefault();
//   const email = document.getElementById('email').value;
//   const password = document.getElementById('password').value;

//   const res = await fetch('/admin/login', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ email, password })
//   });

//   const data = await res.json();
//   if (data.token) {
//     localStorage.setItem('adminToken', data.token);
//     localStorage.setItem('adminRole', data.role || 'co-admin');
//     document.getElementById('loginForm').style.display = 'none';
//     document.getElementById('panel').style.display = 'block';
//     restrictUI(data.role);
//     initLoad();
//   } else {
//     document.getElementById('loginError').innerText = data.message || "Login failed";
//   }
// });

// // 🔐 Restrict Co-Admin UI
// function restrictUI(role) {
//   if (role === 'co-admin') {
//     document.getElementById('adminSection')?.remove(); // Only full admins can access adminSection
//   }
// }

// function downloadBookings() {
//   const token = localStorage.getItem('adminToken');
//   window.open(`/admin/export/bookings?token=${token}`);
// }

// function downloadBusBookings() {
//   const token = localStorage.getItem('adminToken');
//   window.open(`/admin/export/bus-wise?token=${token}`);
// }

// function downloadStudentStatus() {
//   const token = localStorage.getItem('adminToken');
//   window.open(`/admin/export/students-status?token=${token}`);
// }


// // 🚪 Logout
// function logout() {
//   localStorage.removeItem('adminToken');
//   localStorage.removeItem('adminRole');
//   location.reload();
// }

// // 📁 Show Section
// function showSection(id) {
//   document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
//   document.getElementById(id).style.display = 'block';
// }

// // ✅ Add Admin or Co-Admin
// async function addAdmin() {
//   const name = document.getElementById("adminName").value;
//   const mobile = document.getElementById("adminMobile").value;
//   const email = document.getElementById("adminEmail").value;
//   const password = document.getElementById("adminPassword").value;
//   const confirmPassword = document.getElementById("adminConfirmPassword").value;
//   const role = document.getElementById("adminRole").value;

//   if (!name || !mobile || !email || !password || !confirmPassword || !role) return alert("Fill all fields.");
//   if (password !== confirmPassword) return alert("Passwords do not match.");

//   const res = await fetch(`/admin/add`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json', 'Authorization': token },
//     body: JSON.stringify({ name, mobile, email, password, role })
//   });
//   const data = await res.json();
//   alert(data.message);
//   loadAdmins();
//   loadCoAdmins();
// }

// // 👤 Load All Admins
// async function loadAdmins() {
//   const res = await fetch(`/admin/all`, { headers: { Authorization: token } });
//   const data = await res.json();
//   const list = document.getElementById('adminList');
//   list.innerHTML = '';
//   data.forEach(admin => {
//     const li = document.createElement('li');
//     li.innerHTML = `<b>${admin.name}</b> (${admin.role}) - ${admin.email} - ${admin.mobile}
//       ${admin.role !== 'admin' ? `<button onclick="deleteAdmin('${admin._id}')">🗑 Delete</button>` : ''}`;
//     list.appendChild(li);
//   });
// }

// // ❌ Delete Admin
// async function deleteAdmin(id) {
//   if (!confirm("Are you sure to delete?")) return;
//   const res = await fetch(`/admin/delete/${id}`, {
//     method: 'DELETE',
//     headers: { Authorization: token }
//   });
//   const data = await res.json();
//   alert(data.message);
//   loadAdmins();
//   loadCoAdmins();
// }

// // 👥 Load Co-Admins to Dropdown
// async function loadCoAdmins() {
//   const res = await fetch(`/admin/all`, { headers: { Authorization: token } });
//   const data = await res.json();
//   const dropdown = document.getElementById('qrAssignedTo');
//   if (!dropdown) return;
//   dropdown.innerHTML = '<option value="">Assign to Co-Admin</option>';
//   data.forEach(admin => {
//     if (admin.role === 'co-admin') {
//       const option = document.createElement('option');
//       option.value = admin._id;
//       option.text = `${admin.name} (${admin.email})`;
//       dropdown.appendChild(option);
//     }
//   });
// }

// // 📋 Load Students
// async function loadStudents() {
//   const res = await fetch(`/admin/students`, { headers: { Authorization: token } });
//   const data = await res.json();
//   const list = document.getElementById('studentsList');
//   list.innerHTML = '';
//   data.forEach((s, i) => {
//     const li = document.createElement('li');
//     li.innerText = `${i + 1}. ${s.name} - ${s.email} - ${s.university}`;
//     list.appendChild(li);
//   });
// }

// // 🚌 Add Bus
// async function addBus() {
//   const name = document.getElementById('busName').value;
//   const totalSeats = document.getElementById('seatCount').value;
//   const date = document.getElementById('travelDate').value;
//   const timing = document.getElementById('busTiming').value;
//   const price = document.getElementById('price').value;
//   const pickupPoints = document.getElementById('pickupInput').value;
//   const examCenter = document.getElementById('centerInput').value;

//   if (!name || !totalSeats || !date || !timing || !price || !pickupPoints || !examCenter) return alert("Fill all fields.");

//   const res = await fetch(`/api/buses`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json', Authorization: token },
//     body: JSON.stringify({ name, totalSeats, date, timing, price, pickupPoints, examCenter })
//   });
//   const data = await res.json();
//   alert(data.message || "Bus added");
//   loadBuses();
// }

// // 🚌 Load Buses
// async function loadBuses() {
//   const res = await fetch(`/api/buses`, { headers: { Authorization: token } });
//   const data = await res.json();
//   const list = document.getElementById('busList');
//   list.innerHTML = '';
//   data.forEach((b, i) => {
//     const li = document.createElement('li');
//     li.innerText = `${i + 1}. ${b.name} - ${b.date} - ${b.timing} - ₹${b.price}`;
//     list.appendChild(li);
//   });
// }

// // 📍 Add Pickup
// async function addPickup() {
//   const pickup = document.getElementById('pickupInput').value;
//   if (!pickup) return;
//   const res = await fetch(`/api/pickup`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json', Authorization: token },
//     body: JSON.stringify({ name: pickup })
//   });
//   const data = await res.json();
//   alert(data.message || "Added");
//   loadPickups();
// }

// async function loadPickups() {
//   const res = await fetch(`/api/pickup`, { headers: { Authorization: token } });
//   const data = await res.json();
//   const list = document.getElementById('pickupList');
//   list.innerHTML = '';
//   data.forEach(p => {
//     const li = document.createElement('li');
//     li.innerText = p.name;
//     list.appendChild(li);
//   });
// }

// // 🏫 Add Center
// async function addCenter() {
//   const center = document.getElementById('centerInput').value;
//   if (!center) return;
//   const res = await fetch(`/api/centers`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json', Authorization: token },
//     body: JSON.stringify({ name: center })
//   });
//   const data = await res.json();
//   alert(data.message || "Added");
//   loadCenters();
// }

// async function loadCenters() {
//   const res = await fetch(`/api/centers`, { headers: { Authorization: token } });
//   const data = await res.json();
//   const list = document.getElementById('centerList');
//   list.innerHTML = '';
//   data.forEach(c => {
//     const li = document.createElement('li');
//     li.innerText = c.name;
//     list.appendChild(li);
//   });
// }

// // 🧾 Load All Bookings
// async function loadBookings() {
//   const res = await fetch('/api/bookings', {
//     headers: { Authorization: token }
//   });
//   const bookings = await res.json();
//   const list = document.getElementById('bookingsList');
//   list.innerHTML = '';

//   bookings.forEach(b => {
//     const li = document.createElement('li');
//     li.innerHTML = `
//       <b>${b.studentId.name}</b> - ${b.busId.name} - ${b.date} - ₹${b.price} 
//       <br>Status: <span style="color:${b.status === 'confirmed' ? 'green' : 'orange'}">${b.status}</span>
//       ${b.status === 'pending' ? `<button onclick="confirmBooking('${b._id}')">✅ Confirm</button>` : ''}
//       ${b.confirmedBy ? `<br>Confirmed by: ${b.confirmedBy.name || 'Admin'} (${b.confirmedBy.role})` : ''}
//       <hr>
//     `;
//     list.appendChild(li);
//   });
// }

// async function confirmBooking(id) {
//   if (!confirm("Confirm this booking?")) return;
//   const res = await fetch(`/admin/bookings/confirm/${id}`, {
//     method: 'POST',
//     headers: { Authorization: token }
//   });
//   const data = await res.json();
//   alert(data.message || "Confirmed");
//   loadBookings();
// }

// // 📤 Upload QR Code
// async function addQRCode() {
//   const qrId = document.getElementById('qrId').value.trim();
//   const file = document.getElementById('qrImage').files[0];
//   const assignedTo = document.getElementById('qrAssignedTo').value;

//   if (!qrId || !file || !assignedTo) return alert("All fields are required!");

//   const formData = new FormData();
//   formData.append('qrImage', file);
//   formData.append('qrId', qrId);
//   formData.append('assignTo', assignedTo);

//   const res = await fetch('/admin/qr-upload', {
//     method: 'POST',
//     headers: { Authorization: token },
//     body: formData
//   });
//   const data = await res.json();
//   alert(data.message || 'QR Uploaded');
//   loadQRCodes();
// }
// function downloadStudentStatus() {
//   window.open(`/admin/export/students-status?token=${token}`);
// }


// // 🧾 Load All QR Codes
// async function loadQRCodes() {
//   const res = await fetch('/admin/qr-codes', { headers: { Authorization: token } });
//   const data = await res.json();
//   const list = document.getElementById('qrList');
//   list.innerHTML = '';
//   data.forEach(qr => {
//     const li = document.createElement('li');
//     li.innerHTML = `
//       <b>${qr.qrId}</b> - Assigned: ${qr.assignedTo?.name || 'N/A'}<br>
//       <img src="${qr.imageUrl}" width="100" />
//     `;
//     list.appendChild(li);
//   });
// }

// // ⏱ Initialize everything
// function initLoad() {
//   loadAdmins();
//   loadStudents();
//   loadCenters();
//   loadPickups();
//   loadBuses();
//   loadBookings();
//   loadCoAdmins();
//   loadQRCodes();
// }

// // 🌐 On Page Load
// window.onload = () => {
//   if (token && role) {
//     document.getElementById('loginForm').style.display = 'none';
//     document.getElementById('panel').style.display = 'block';
//     restrictUI(role);
//     initLoad();
//   }
// };
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
    localStorage.setItem('adminRole', data.role || 'co-admin');
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('panel').style.display = 'block';
    restrictUI(data.role);
    initLoad();
  } else {
    document.getElementById('loginError').innerText = data.message || "Login failed";
  }
});

// 🔐 Restrict Co-Admin UI
function restrictUI(role) {
  if (role === 'co-admin') {
    document.getElementById('adminSection')?.remove(); // Only full admins can access adminSection
  }
}

// 🚪 Logout
function logout() {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminRole');
  location.reload();
}

// 📁 Show Section
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}

// ✅ Add Admin or Co-Admin
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
  loadCoAdmins();
}

// 👤 Load All Admins
async function loadAdmins() {
  const res = await fetch(`/admin/all`, { headers: { Authorization: token } });
  const data = await res.json();
  const list = document.getElementById('adminList');
  if (!list) return;
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
    headers: { Authorization: token }
  });
  const data = await res.json();
  alert(data.message);
  loadAdmins();
  loadCoAdmins();
}

// 👥 Load Co-Admins to Dropdown
async function loadCoAdmins() {
  const res = await fetch(`/admin/all`, { headers: { Authorization: token } });
  const data = await res.json();
  const dropdown = document.getElementById('qrAssignedTo');
  if (!dropdown) return;
  dropdown.innerHTML = '<option value="">Assign to Co-Admin</option>';
  data.forEach(admin => {
    if (admin.role === 'co-admin') {
      const option = document.createElement('option');
      option.value = admin._id;
      option.text = `${admin.name} (${admin.email})`;
      dropdown.appendChild(option);
    }
  });
}

// 📋 Load Students
async function loadStudents() {
  const res = await fetch(`/admin/students`, { headers: { Authorization: token } });
  const data = await res.json();
  const list = document.getElementById('studentsList');
  if (!list) return;
  list.innerHTML = '';
  data.forEach((s, i) => {
    const li = document.createElement('li');
    li.innerText = `${i + 1}. ${s.name} - ${s.email} - ${s.university}`;
    list.appendChild(li);
  });
}

// 🚌 Add Bus
async function addBus() {
  const name = document.getElementById('busName').value;
  const totalSeats = document.getElementById('seatCount').value;
  const date = document.getElementById('travelDate').value;
  const timing = document.getElementById('busTiming').value;
  const price = document.getElementById('price').value;
  const pickupPoints = document.getElementById('pickupInput').value;
  const examCenter = document.getElementById('centerInput').value;

  if (!name || !totalSeats || !date || !timing || !price || !pickupPoints || !examCenter) return alert("Fill all fields.");

  const res = await fetch(`/api/buses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: token },
    body: JSON.stringify({ name, totalSeats, date, timing, price, pickupPoints, examCenter })
  });
  const data = await res.json();
  alert(data.message || "Bus added");
  loadBuses();
}

// 🚌 Load Buses
async function loadBuses() {
  const res = await fetch(`/api/buses`, { headers: { Authorization: token } });
  const data = await res.json();
  const list = document.getElementById('busList');
  if (!list) return;
  list.innerHTML = '';
  data.forEach((b, i) => {
    const li = document.createElement('li');
    li.innerText = `${i + 1}. ${b.name} - ${b.date} - ${b.timing} - ₹${b.price}`;
    list.appendChild(li);
  });
}

// 📍 Add Pickup
async function addPickup() {
  const pickup = document.getElementById('pickupInput').value;
  if (!pickup) return;
  const res = await fetch(`/api/pickup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: token },
    body: JSON.stringify({ name: pickup })
  });
  const data = await res.json();
  alert(data.message || "Added");
  loadPickups();
}

async function loadPickups() {
  const res = await fetch(`/api/pickup`, { headers: { Authorization: token } });
  const data = await res.json();
  const list = document.getElementById('pickupList');
  if (!list) return;
  list.innerHTML = '';
  data.forEach(p => {
    const li = document.createElement('li');
    li.innerText = p.name;
    list.appendChild(li);
  });
}

// 🏫 Add Center
async function addCenter() {
  const center = document.getElementById('centerInput').value;
  if (!center) return;
  const res = await fetch(`/api/centers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: token },
    body: JSON.stringify({ name: center })
  });
  const data = await res.json();
  alert(data.message || "Added");
  loadCenters();
}

async function loadCenters() {
  const res = await fetch(`/api/centers`, { headers: { Authorization: token } });
  const data = await res.json();
  const list = document.getElementById('centerList');
  if (!list) return;
  list.innerHTML = '';
  data.forEach(c => {
    const li = document.createElement('li');
    li.innerText = c.name;
    list.appendChild(li);
  });
}

// 🧾 Load All Bookings
async function loadBookings() {
  const res = await fetch('/api/bookings', {
    headers: { Authorization: token }
  });
  const bookings = await res.json();
  const list = document.getElementById('bookingsList');
  if (!list) return;
  list.innerHTML = '';

  bookings.forEach(b => {
    const li = document.createElement('li');
    li.innerHTML = `
      <b>${b.studentId.name}</b> - ${b.busId.name} - ${b.date} - ₹${b.price} 
      <br>Status: <span style="color:${b.status === 'confirmed' ? 'green' : 'orange'}">${b.status}</span>
      ${b.status === 'pending' ? `<button onclick="confirmBooking('${b._id}')">✅ Confirm</button>` : ''}
      ${b.confirmedBy ? `<br>Confirmed by: ${b.confirmedBy.name || 'Admin'} (${b.confirmedBy.role})` : ''}
      <hr>
    `;
    list.appendChild(li);
  });
}

async function confirmBooking(id) {
  if (!confirm("Confirm this booking?")) return;
  const res = await fetch(`/admin/bookings/confirm/${id}`, {
    method: 'POST',
    headers: { Authorization: token }
  });
  const data = await res.json();
  alert(data.message || "Confirmed");
  loadBookings();
}

// 📤 Upload QR Code
async function addQRCode() {
  const qrId = document.getElementById('qrId').value.trim();
  const file = document.getElementById('qrImage').files[0];
  const assignedTo = document.getElementById('qrAssignedTo').value;

  if (!qrId || !file || !assignedTo) return alert("All fields are required!");

  const formData = new FormData();
  formData.append('qrImage', file);
  formData.append('qrId', qrId);
  formData.append('assignTo', assignedTo);

  const res = await fetch('/admin/qr-upload', {
    method: 'POST',
    headers: { Authorization: token },
    body: formData
  });
  const data = await res.json();
  alert(data.message || 'QR Uploaded');
  loadQRCodes();
}

// 📥 Export Excel
function downloadStudents() {
  if (!token) return alert("Login required");
  window.open(`/admin/export/students?token=${token}`);
}

function downloadBookings() {
  if (!token) return alert("Login required");
  window.open(`/admin/export/bookings?token=${token}`);
}

function downloadBusBookings() {
  if (!token) return alert("Login required");
  window.open(`/admin/export/bus-wise?token=${token}`);
}

function downloadStudentStatus() {
  if (!token) return alert("Login required");
  window.open(`/admin/export/students-status?token=${token}`);
}

// 🧾 Load All QR Codes
async function loadQRCodes() {
  const res = await fetch('/admin/qr-codes', { headers: { Authorization: token } });
  const data = await res.json();
  const list = document.getElementById('qrList');
  if (!list) return;
  list.innerHTML = '';
  data.forEach(qr => {
    const li = document.createElement('li');
    li.innerHTML = `
      <b>${qr.qrId}</b> - Assigned: ${qr.assignedTo?.name || 'N/A'}<br>
      <img src="${qr.imageUrl}" width="100" />
    `;
    list.appendChild(li);
  });
}

// ⏱ Initialize everything
function initLoad() {
  loadAdmins();
  loadStudents();
  loadCenters();
  loadPickups();
  loadBuses();
  loadBookings();
  loadCoAdmins();
  loadQRCodes();
}

// 🌐 On Page Load
window.onload = () => {
  if (token && role) {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('panel').style.display = 'block';
    restrictUI(role);
    initLoad();
  }
};
