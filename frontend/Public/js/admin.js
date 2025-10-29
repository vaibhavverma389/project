
let token = localStorage.getItem('adminToken') || null;
let buses = [], pickups = [], centers = [], students = [], bookings = [];
let editingBusId = null;

window.addEventListener('DOMContentLoaded', async () => {
  if (token) {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('panel').style.display = 'block';
    await loadPickups();
    await loadCenters();
    await loadBuses();
    await loadStudents();
    await loadBookings();
    await loadAdmins();
    await loadCoordinators();
    showSection('studentsSection');
  }
});

// Admin Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      token = data.token;
      localStorage.setItem('adminToken', token);
      location.reload();
    } catch (err) {
      document.getElementById('error').innerText = err.message;
    }
  });
}

function logout() {
  localStorage.removeItem('adminToken');
  location.reload();
}

function showSection(id) {
  document.querySelectorAll('.section').forEach(sec => sec.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}

// Admin CRUD
async function loadAdmins() {
  const res = await fetch('/api/admin/admin', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const admins = await res.json();
  const list = document.getElementById('adminList');
  list.innerHTML = admins.map(a =>
    `<li>${a.email} <button onclick="deleteAdmin('${a._id}')">❌</button></li>`
  ).join('');
}

async function addAdmin() {
  const name = document.getElementById('adminName').value.trim();
  const mobile = document.getElementById('adminMobile').value.trim();
  const email = document.getElementById('adminEmail').value.trim();
  const password = document.getElementById('adminPassword').value.trim();
  const confirmPassword = document.getElementById('adminConfirmPassword').value.trim();

  if (!name || !mobile || !email || !password || password !== confirmPassword)
    return alert('Please fill all fields correctly.');

  const res = await fetch('/api/admin/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ name, mobile, email, password, role: 'admin' })
  });
  const data = await res.json();
  if (!res.ok) return alert(data.error);
  alert('Admin created');
  await loadAdmins();
}

async function deleteAdmin(id) {
  if (!confirm('Delete admin?')) return;
  const res = await fetch(`/api/admin/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) return alert(data.error);
  alert('Admin deleted');
  await loadAdmins();
}

// Coordinators
async function loadCoordinators() {
  const res = await fetch('/api/admin/coordinators', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  const tbody = document.querySelector('#coordinatorTable tbody');
  tbody.innerHTML = '';
  data.coordinators.forEach(c => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${c.name}</td>
      <td>${c.email}</td>
      <td>
        <button onclick="editCoordinator('${c._id}', '${c.name}', '${c.email}')">Edit</button>
        <button onclick="deleteCoordinator('${c._id}')">Delete</button>
      </td>`;
    tbody.appendChild(tr);
  });
  populateCoadminDropdown(data.coordinators);
}

function populateCoadminDropdown(data) {
  const select = document.getElementById('coadmin');
  if (!select) return;
  select.innerHTML = `<option value="">--Select--</option>`;
  data.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c._id;
    opt.textContent = c.name;
    select.appendChild(opt);
  });
}

document.getElementById('coordinatorForm').addEventListener('submit', async e => {
  e.preventDefault();
  const id = document.getElementById('coordinatorId').value;
  const name = document.getElementById('coordName').value;
  const email = document.getElementById('coordEmail').value;
  const password = document.getElementById('coordPassword').value;

  const method = id ? 'PUT' : 'POST';
  const url = id ? `/api/admin/coordinator/${id}` : '/api/admin/coordinator/register';

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ name, email, password })
  });
  const data = await res.json();
  alert(data.message);
  document.getElementById('coordinatorForm').reset();
  loadCoordinators();
});

function editCoordinator(id, name, email) {
  document.getElementById('coordinatorId').value = id;
  document.getElementById('coordName').value = name;
  document.getElementById('coordEmail').value = email;
  document.getElementById('coordSubmitBtn').innerText = 'Update';
}

async function deleteCoordinator(id) {
  if (!confirm('Delete coordinator?')) return;
  const res = await fetch(`/api/admin/coordinator/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  alert(data.message);
  await loadCoordinators();
}

// More sections like pickup, centers, buses, students, bookings should follow...
// Let me know if you want them included here too.
function downloadStudents() {
  fetch('/api/export/students', {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'students.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
}

function downloadBookings() {
  fetch('/api/export/bookings', {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'bookings.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
}


async function cancelBookingAsAdmin(bookingId) {
  try {
    const res = await fetch(`/api/admin/bookings/${bookingId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (res.ok) {
      alert("✅ Booking cancelled successfully");
      await loadBookings();
    } else {
      alert(`❌ ${data.error || data.message || "Error cancelling booking"}`);
    }
  } catch (err) {
    alert("❌ " + err.message);
  }
}


async function loadBookings() {
  try {
    const res = await fetch('/api/admin/bookings', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to load bookings');
    bookings = await res.json();
    renderBookings();
  } catch (err) {
    alert(err.message);
  }
}



function renderBookings() {
  const list = document.getElementById('bookingsList');
  if (!list) return;
  if (bookings.length === 0) {
    list.innerHTML = '<li>No bookings found.</li>';
  } else {
    list.innerHTML = bookings.map(b => {
      const studentName = b.studentId?.name || 'Unknown Student';
      const studentEmail = b.studentId?.email || '';
      const studentMobile = b.studentId?.mobile || '';
      const busName = b.busId?.name || 'Unknown Bus';
      const date = b.date?.split('T')[0] || 'N/A';
      const pickup = b.pickupPoint || '';
      const center = b.examCenter || '';
      const price = b.price || '';
      const time = b.time || '';
      const bookingId = b._id;

      return `
        <li>
          <strong>${studentName}</strong> - ${studentEmail} (${studentMobile})<br>
          Booked <strong>${busName}</strong> on ${date}<br>
          Pickup: ${pickup}, Center: ${center}, Time: ${time}, ₹${price}
          <br>
          <button onclick="cancelBookingAsAdmin('${bookingId}')">❌ Cancel</button>
        </li>`;
    }).join('');
  }
}




async function loadStudents() {
  try {
    const res = await fetch('/api/admin/students', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to load students');
    students = await res.json();
    renderStudents();
  } catch (err) {
    alert(err.message);
  }
}

function renderStudents() {
  const list = document.getElementById('studentsList');
  if (!list) return;
  if (students.length === 0) {
    list.innerHTML = '<li>No students registered yet.</li>';
  } else {
    list.innerHTML = students.map(s => `
      <li>
        <strong>${s.name}</strong><br>
        Roll: ${s.roll}<br>
        Email: ${s.email}<br>
        Mobile: ${s.mobile}<br>
        Parent: ${s.pmobile}
      </li>`).join('');
  }
}




//////////////////////////////////////////////
async function addBus() {
  const name = document.getElementById('busName').value.trim();
  const seatCount = document.getElementById('seatCount').value.trim();
  const date = document.getElementById('travelDate').value;
  const timing = document.getElementById('busTiming').value;
  const examCenter = document.getElementById('examCenter').value;
  const price = document.getElementById('price').value.trim();

  const pickupPoints = Array.from(document.querySelectorAll('#pickupCheckboxes input:checked')).map(cb => cb.value);

  if (!name || !seatCount || !date || !timing || !examCenter || pickupPoints.length === 0 || !price) {
    return alert("Please fill all bus fields.");
  }

  try {
    const res = await fetch('/api/bus', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  },
  body: JSON.stringify({
    busName: name,
    seatCount: seatCount,
    travelDate: date,
    timing,
    pickup: pickupPoints,
    center: examCenter,
    price
  })
});


    if (!res.ok) throw new Error('Failed to add bus');
    await loadBuses();

    // Clear form
    document.getElementById('busName').value = '';
    document.getElementById('seatCount').value = '';
    document.getElementById('travelDate').value = '';
    document.getElementById('busTiming').value = '';
    document.getElementById('examCenter').value = '';
    document.getElementById('price').value = '';
    document.querySelectorAll('#pickupCheckboxes input:checked').forEach(cb => cb.checked = false);
  } catch (err) {
    alert(err.message);
  }
}

function renderBuses() {
  const list = document.getElementById('busList');
  if (!list) return;

  if (buses.length === 0) {
    list.innerHTML = '<li>No buses available yet.</li>';
  } else {
    list.innerHTML = buses.map(bus => `
      <li>
        <strong>${bus.name}</strong><br>
        Date: ${bus.travelDate}<br>
        Center: ${bus.examCenter}<br>
        Price: ₹${bus.price}<br>
        Timing: ${bus.timing}<br>
        <button onclick="editBus('${bus._id}')">✏️ Update</button>
        <button onclick="deleteBus('${bus._id}')">🗑️ Delete</button>
      </li>
    `).join('');
  }
}
///
async function editBus(id) {
  const bus = buses.find(b => b._id === id);
  if (!bus) return alert("Bus not found");

  document.getElementById('busName').value = bus.name;
  document.getElementById('seatCount').value = bus.seatCount;
  document.getElementById('travelDate').value = bus.travelDate;
  document.getElementById('busTiming').value = bus.timing;
  document.getElementById('examCenter').value = bus.examCenter;
  document.getElementById('price').value = bus.price;

  // Check pickup checkboxes
  document.querySelectorAll('#pickupCheckboxes input').forEach(cb => {
  if (Array.isArray(bus.pickup)) {
    cb.checked = bus.pickup.includes(cb.value);
  } else {
    cb.checked = false; // or leave as-is
  }
});


  editingBusId = id;
  document.getElementById('addBusBtn').innerText = 'Update Bus';
}
async function addBus() {
  const name = document.getElementById('busName').value.trim();
  const seatCount = document.getElementById('seatCount').value.trim();
  const date = document.getElementById('travelDate').value;
  const timing = document.getElementById('busTiming').value;
  const examCenter = document.getElementById('examCenter').value;
  const price = document.getElementById('price').value.trim();
  const pickupPoints = Array.from(document.querySelectorAll('#pickupCheckboxes input:checked')).map(cb => cb.value);

  if (!name || !seatCount || !date || !timing || !examCenter || pickupPoints.length === 0 || !price) {
    return alert("Please fill all bus fields.");
  }

  const busData = {
    busName: name,
    seatCount,
    travelDate: date,
    timing,
    pickup: pickupPoints,
    center: examCenter,
    price
  };

  try {
    const method = editingBusId ? 'PUT' : 'POST';
    const url = editingBusId 
      ? `/api/buses/${editingBusId}`
      : '/api/buses';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(busData)
    });

    if (!res.ok) throw new Error(editingBusId ? 'Failed to update bus' : 'Failed to add bus');

    alert(editingBusId ? '✅ Bus updated' : '✅ Bus added');
    editingBusId = null;
    document.getElementById('addBusBtn').innerText = 'Add Bus';
    await loadBuses();

    // Clear form
    document.getElementById('busName').value = '';
    document.getElementById('seatCount').value = '';
    document.getElementById('travelDate').value = '';
    document.getElementById('busTiming').value = '';
    document.getElementById('examCenter').value = '';
    document.getElementById('price').value = '';
    document.querySelectorAll('#pickupCheckboxes input:checked').forEach(cb => cb.checked = false);
  } catch (err) {
    alert(err.message);
  }
}
async function deleteBus(id) {
  if (!confirm('⚠️ Are you sure you want to delete this bus?')) return;

  try {
    const res = await fetch(`/api/buses/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error('Failed to delete bus');

    alert('✅ Bus deleted');
    await loadBuses();
  } catch (err) {
    alert(err.message);
  }
}
async function loadBuses() {
  try {
    const ses= await fetch('/api/buses',{
      headers: {Authorization: `Bearer ${token}`}
    });
    if (!ses.ok) throw new error("Failed to load Bus");
    buses =await ses.json();
    renderBuses();
  } catch (err) {
    alert(err.message);
  }
  
}

// ---------------------- Centers ----------------------
async function loadCenters() {
  const res = await fetch('/api/centers');
  centers = await res.json();
  renderCenters();
  loadCentersSelect();
}

function renderCenters() {
  const list = document.getElementById('centerList');
  list.innerHTML = centers.map(c => `<li>${c.name} <button onclick="removeCenter('${c._id}')">❌</button></li>`).join('');
}

function loadCentersSelect() {
  const select = document.getElementById('examCenter');
  select.innerHTML = `<option value="">--Select--</option>` + centers.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
}

async function addCenter() {
  const name = document.getElementById('centerInput').value.trim();
  if (!name) return alert('Enter center name');
  try {
    const res = await fetch('/api/centers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name })
    });
    if (!res.ok) return alert((await res.json()).error || 'Failed to add center');
    document.getElementById('centerInput').value = '';
    await loadCenters();
  } catch (err) {
    alert(err.message);
  }
}

async function removeCenter(id) {
  if (!confirm('Delete this center?')) return;
  try {
    const res = await fetch(`/api/centers/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to delete center');
    await loadCenters();
  } catch (err) {
    alert(err.message);
  }
}


// ---------------------- Pickups ----------------------
async function loadPickups() {
  const res = await fetch('/api/pickup', {
    headers: { Authorization: `Bearer ${token}` }
  });
  pickups = await res.json();
  renderPickups();
  loadPickupCheckboxes();
}

function renderPickups() {
  const list = document.getElementById('pickupList');
  list.innerHTML = pickups.map(p => `<li>${p.name} <button onclick="removePickup('${p._id}')">❌</button></li>`).join('');
}

function loadPickupCheckboxes() {
  const div = document.getElementById('pickupCheckboxes');
  div.innerHTML = pickups.map(p => `<label><input type="checkbox" value="${p.name}">${p.name}</label><br>`).join('');
}

async function addPickup() {
  const name = document.getElementById('pickupInput').value.trim();
  if (!name) return alert('Enter pickup name');
  try {
    const res = await fetch('/api/pickup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name })
    });
    if (!res.ok) return alert((await res.json()).error || 'Failed to add pickup');
    document.getElementById('pickupInput').value = '';
    await loadPickups();
  } catch (err) {
    alert(err.message);
  }
}

async function removePickup(id) {
  if (!confirm('Delete this pickup?')) return;
  try {
    const res = await fetch(`/api/pickup/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to delete pickup');
    await loadPickups();
  } catch (err) {
    alert(err.message);
  }
}