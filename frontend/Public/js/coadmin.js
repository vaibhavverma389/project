const token = localStorage.getItem('adminToken');

// 🔐 Secure Fetch
async function fetchWithAuth(url, options = {}) {
  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`
  };
  return fetch(url, { ...options, headers });
}

// 🔓 Logout
function logout() {
  localStorage.removeItem('adminToken');
  location.reload();
}

// 📂 Navigation
function showSection(id) {
  document.querySelectorAll('.section').forEach(sec => sec.style.display = 'none');
  const section = document.getElementById(id);
  if (section) section.style.display = 'block';
}

// ✅ Login Handler
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    const res = await fetch('/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');

    localStorage.setItem('adminToken', data.token);
    document.querySelector('.loginForm').style.display = 'none';
    document.getElementById('panel').style.display = 'block';
    showSection('pending');
    loadPendingPayments();
  } catch (err) {
    document.getElementById('error').innerText = err.message;
  }
});

// ✅ Load Pending Payments
async function loadPendingPayments() {
  const res = await fetchWithAuth('/admin/co/pending');
  const data = await res.json();

  const list = document.getElementById('pendingList');
  if (!res.ok || !Array.isArray(data) || data.length === 0) {
    list.innerHTML = '<li>No pending payments found.</li>';
    return;
  }

  list.innerHTML = data.map(p => `
    <li style="margin-bottom: 20px; padding: 10px; border: 1px solid #ccc;">
      <strong>🎓 ${p.student?.name || 'Unknown Student'}</strong> (${p.student?.email || 'N/A'})<br>
      💰 Amount: ₹${p.amount || 'N/A'}<br>
      🧾 UTR: ${p.utr || 'N/A'}<br>
      📸 Screenshot:<br>
      <a href="${p.screenshot}" target="_blank">
        <img src="${p.screenshot}" alt="screenshot" style="width:120px; border:1px solid #ccc; margin-top:5px;" />
      </a><br><br>
      <button onclick="verifyPayment('${p._id}')">✅ Verify Payment</button>
    </li>
  `).join('');
}

// ✅ Verify Payment Handler
async function verifyPayment(paymentId) {
  if (!confirm("Mark this payment as verified?")) return;

  const res = await fetchWithAuth(`/admin/co/verify/${paymentId}`, {
    method: 'PUT'
  });

  const result = await res.json();
  if (res.ok) {
    alert('✅ Payment verified successfully!');
    loadPendingPayments();
  } else {
    alert('❌ ' + (result.message || 'Verification failed'));
  }
}

// ✅ Auto-load if already logged in
window.addEventListener('DOMContentLoaded', () => {
  if (token) {
    document.querySelector('.loginForm').style.display = 'none';
    document.getElementById('panel').style.display = 'block';
    showSection('pending');
    loadPendingPayments();
  }
});
