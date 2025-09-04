// ✅ booking.js

document.addEventListener('DOMContentLoaded', () => {
  const pickupSelect = document.getElementById('pickup');
  const examCenterSelect = document.getElementById('examCenter');
  const timeSelect = document.getElementById('time');
  const dateInput = document.getElementById('date');
  const infoDiv = document.getElementById('info') || document.createElement('div'); // fallback
  const searchBtn = document.getElementById('searchBtn');
  const proceedBtn = document.getElementById('proceedBtn'); // ✅ consistent with HTML

  const token = localStorage.getItem('studentToken');
  if (!token) {
    alert('Please log in first to book your ticket.');
    window.location.href = 'login.html';
    return;
  }

  // Set today's date
  dateInput.value = new Date().toISOString().split('T')[0];

  const query = new URLSearchParams(window.location.search);
  const queryParams = {
    date: query.get("date"),
    pickup: query.get("pickup"),
    examCenter: query.get("examCenter"),
    time: query.get("time")
  };

  async function fetchOptions() {
    try {
      const [pickupRes, centerRes] = await Promise.all([
        fetch('/api/pickup'),
        fetch('/api/centers')
      ]);

      const pickups = await pickupRes.json();
      const centers = await centerRes.json();

      pickupSelect.innerHTML = '<option value="">Select Pickup Point</option>';
      examCenterSelect.innerHTML = '<option value="">Select Exam Center</option>';

      pickups.forEach(p => {
        const option = document.createElement('option');
        option.value = p.name;
        option.textContent = p.name;
        pickupSelect.appendChild(option);
      });

      centers.forEach(c => {
        const option = document.createElement('option');
        option.value = c.name;
        option.textContent = c.name;
        examCenterSelect.appendChild(option);
      });

    } catch (err) {
      console.error('❌ Failed to load options:', err);
      infoDiv.textContent = 'Error loading pickup points or exam centers.';
      infoDiv.style.color = 'red';
    }
  }

  async function autoTriggerSearchFromURL() {
    await fetchOptions();

    if (queryParams.date && queryParams.pickup && queryParams.examCenter && queryParams.time) {
      dateInput.value = queryParams.date;
      pickupSelect.value = queryParams.pickup;
      examCenterSelect.value = queryParams.examCenter;
      timeSelect.value = queryParams.time;

      searchBtn.click();
    }
  }

  autoTriggerSearchFromURL();
  proceedBtn.style.display = 'none';

  searchBtn.addEventListener('click', async () => {
    infoDiv.textContent = '';
    proceedBtn.style.display = 'none';

    const date = dateInput.value;
    const pickup = pickupSelect.value;
    const examCenter = examCenterSelect.value;
    const time = timeSelect.value;

    if (!date || !pickup || !examCenter || !time) {
      alert('Please fill all fields');
      return;
    }

    // Disable button while searching
    searchBtn.disabled = true;
    searchBtn.textContent = "Searching...";

    try {
      const res = await fetch('/api/buses/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          travelDate: date,
          pickup,
          center: examCenter,
          timing: time
        })
      });

      const result = await res.json();

      if (!result.success || !result.bus) {
        infoDiv.textContent = '❌ No bus found or all seats booked.';
        infoDiv.style.color = 'red';
        return;
      }

      const { name, price, seatsAvailable, time: busTime } = result.bus;

      // Fill in the result section
      document.getElementById('busResult').style.display = 'block';
      document.getElementById('busName').textContent = `Bus Name: ${name}`;
      document.getElementById('seatInfo').textContent = `Seats Available: ${seatsAvailable}`;
      document.getElementById('priceInfo').textContent = `Price: ₹${price}`;

      // Save details
      const bookingDetails = {
        date,
        pickup,
        examCenter,
        time,
        price,
        busName: name
      };
      localStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));
      proceedBtn.style.display = 'inline-block';

    } catch (err) {
      console.error('❌ Error checking bus:', err);
      infoDiv.textContent = '❌ Error checking bus availability.';
      infoDiv.style.color = 'red';
    }

    // Re-enable
    searchBtn.disabled = false;
    searchBtn.textContent = "🔍 Search Bus";
  });

  proceedBtn.addEventListener('click', () => {
    const temp = localStorage.getItem('bookingDetails');
    if (!temp) {
      alert('No booking info found');
      return;
    }

    window.location.href = 'payment.html';
  });
});
