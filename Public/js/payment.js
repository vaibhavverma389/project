document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('studentToken');
  if (!token) {
    alert('Please log in first.');
    window.location.href = 'login.html';
    return;
  }

  const bookingDetails = JSON.parse(localStorage.getItem('bookingDetails'));
  if (!bookingDetails) {
    alert('Please book a ticket before proceeding to payment.');
    window.location.href = 'booking.html';
    return;
  }

  // Show booking summary
  const paymentDetails = document.getElementById('paymentDetails');
  paymentDetails.innerHTML = `
    <p><strong>Date:</strong> ${bookingDetails.date}</p>
    <p><strong>Pickup:</strong> ${bookingDetails.pickup}</p>
    <p><strong>Exam Center:</strong> ${bookingDetails.center}</p>
    <p><strong>Time:</strong> ${bookingDetails.time}</p>
    <p><strong>Bus:</strong> ${bookingDetails.busName}</p>
    <p><strong>Amount:</strong> ₹${bookingDetails.price}</p>
  `;

  // Load QR Codes
  const qrContainer = document.getElementById('qrContainer');
  let selectedQRId = null;

  try {
    const res = await fetch('/api/qrcodes');
    const qrs = await res.json();

    if (qrs.length === 0) {
      qrContainer.innerHTML = "<p style='color:red;'>No QR codes available. Try again later.</p>";
      return;
    }

    qrs.forEach(qr => {
      const img = document.createElement('img');
      img.src = qr.url;
      img.style = 'width: 160px; margin: 10px; border: 2px solid #ccc; cursor: pointer; border-radius: 10px;';
      img.onclick = () => {
        selectedQRId = qr._id;
        document.querySelectorAll('#qrContainer img').forEach(i => i.style.border = '2px solid #ccc');
        img.style.border = '2px solid green';
      };
      qrContainer.appendChild(img);
    });
  } catch (err) {
    console.error('Failed to load QR codes:', err);
    qrContainer.innerHTML = "<p style='color:red;'>Error loading QR codes.</p>";
  }

  // Submit Payment Proof
  document.getElementById('submitProof').addEventListener('click', async () => {
    const utr = document.getElementById('utrNumber').value.trim();
    const fileInput = document.getElementById('screenshot');
    const file = fileInput.files[0];

    if (!utr || !file || !selectedQRId) {
      alert('Please fill UTR, select a QR, and upload screenshot.');
      return;
    }

    // Upload Screenshot to Cloudinary via backend
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
      console.error('Upload error:', err);
      alert('Screenshot upload failed. Try again.');
      return;
    }

    // Final Booking Submission
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
        alert('Booking submitted successfully. Awaiting admin confirmation.');
        localStorage.removeItem('bookingDetails');
        window.location.href = 'ticket.html';
      } else {
        alert(result.message || 'Booking failed.');
      }
    } catch (err) {
      console.error('Booking error:', err);
      alert('An error occurred. Please try again.');
    }
  });
});
