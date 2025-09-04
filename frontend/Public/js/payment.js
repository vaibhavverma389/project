document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('studentToken');

  // 🔐 Redirect if not logged in
  if (!token) {
    alert('Please log in first.');
    window.location.href = 'login.html';
    return;
  }

  // 📦 Get booking details
  const bookingDetails = JSON.parse(localStorage.getItem('bookingDetails'));
  if (!bookingDetails) {
    alert('Please book a ticket before proceeding to payment.');
    window.location.href = 'booking.html';
    return;
  }

  // 📋 Display booking summary
  const paymentDetails = document.getElementById('paymentDetails');
  paymentDetails.innerHTML = `
    <p><strong>Date:</strong> ${bookingDetails.date}</p>
    <p><strong>Pickup:</strong> ${bookingDetails.pickup}</p>
    <p><strong>Exam Center:</strong> ${bookingDetails.center}</p>
    <p><strong>Time:</strong> ${bookingDetails.time}</p>
    <p><strong>Bus:</strong> ${bookingDetails.busName}</p>
    <p><strong>Amount:</strong> ₹${bookingDetails.price}</p>
  `;

  // 🧾 QR Display
  const qrContainer = document.getElementById('qrContainer') || createQRContainer();
  let selectedQRId = null;

  try {
    const res = await fetch('/api/qrcodes');
    const qrs = await res.json();

    if (!Array.isArray(qrs) || qrs.length === 0) {
      qrContainer.innerHTML = "<p style='color:red;'>No QR codes available. Try again later.</p>";
      return;
    }

    // Render QR cards
    qrs.forEach(qr => {
      const wrapper = document.createElement('div');
      wrapper.style = 'display: inline-block; text-align: center; margin: 10px;';

      const img = document.createElement('img');
      img.src = qr.url;
      img.alt = qr.name || 'QR';
      img.style = 'width: 160px; height: auto; border: 2px solid #ccc; cursor: pointer; border-radius: 10px;';

      img.onclick = () => {
        selectedQRId = qr._id;
        document.querySelectorAll('#qrContainer img').forEach(i => {
          i.style.border = '2px solid #ccc';
        });
        img.style.border = '3px solid green';
      };

      const label = document.createElement('p');
      label.textContent = qr.name || 'QR';

      wrapper.appendChild(img);
      wrapper.appendChild(label);
      qrContainer.appendChild(wrapper);
    });
  } catch (err) {
    console.error('❌ Failed to load QR codes:', err);
    qrContainer.innerHTML = "<p style='color:red;'>Error loading QR codes.</p>";
  }

  // 📤 Submit payment proof
  document.getElementById('submitProof').addEventListener('click', async () => {
    const utr = document.getElementById('utrNumber').value.trim();
    const fileInput = document.getElementById('screenshot');
    const file = fileInput.files[0];

    if (!utr || !file && !selectedQRId) {
      alert('Please fill UTR, select a QR code, and upload screenshot.');
      return;
    }

    // 📸 Upload screenshot
    let screenshotUrl;
    try {
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.message || 'Upload failed');
      screenshotUrl = uploadData.url;
    } catch (err) {
      console.error('❌ Screenshot upload failed:', err);
      alert('Screenshot upload failed. Try again.');
      return;
    }

    // 🧾 Send booking with payment details
    const bookingPayload = {
      ...bookingDetails,
      utr,
      qrId: selectedQRId,
      screenshot: screenshotUrl
    };

    try {
      const res = await fetch('/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingPayload)
      });

      const result = await res.json();

      if (res.ok) {
        alert('✅ Booking submitted successfully. Awaiting admin confirmation.');
        localStorage.removeItem('bookingDetails');
        window.location.href = 'ticket.html';
      } else {
        alert(result.message || 'Booking failed.');
      }
    } catch (err) {
      console.error('❌ Final booking error:', err);
      alert('Something went wrong. Please try again.');
    }
  });

  // 👇 Add QR container to DOM if missing
  function createQRContainer() {
    const container = document.createElement('div');
    container.id = 'qrContainer';
    container.style = 'margin-top: 30px;';
    document.querySelector('.payment-container').appendChild(container);
    return container;
  }
});
