// logic for the booking by student
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('studentToken');

  // 🚫 Redirect if not logged in
  if (!token) {
    alert("Please log in to book your ticket.");
    window.location.href = "login.html";
    return;
  }

  const pickupSelect = document.getElementById('pickup');
  const centerSelect = document.getElementById('examCenter');
  const searchBtn = document.getElementById('searchBtn');
  const proceedBtn = document.getElementById('proceedBtn');
  const busResult = document.getElementById('busResult');

  const busNameDisplay = document.getElementById('busName');
  const busTypeDisplay = document.getElementById('busType');
  const seatInfo = document.getElementById('seatInfo');
  const priceInfo = document.getElementById('priceInfo');

  // 🔄 Load pickup points
  fetch('/api/pickups')
    .then(res => res.json())
    .then(data => {
      data.forEach(pickup => {
        const option = document.createElement('option');
        option.value = pickup.name;
        option.textContent = pickup.name;
        pickupSelect.appendChild(option);
      });
    })
    .catch(err => console.error('Error loading pickup points:', err));

  // 🔄 Load exam centers
  fetch('/api/centers')
    .then(res => res.json())
    .then(data => {
      data.forEach(center => {
        const option = document.createElement('option');
        option.value = center.name;
        option.textContent = center.name;
        centerSelect.appendChild(option);
      });
    })
    .catch(err => console.error('Error loading centers:', err));

  // 🔍 Search Bus
  searchBtn.addEventListener('click', async () => {
    const date = document.getElementById('date').value;
    const pickup = pickupSelect.value;
    const center = centerSelect.value;
    const time = document.getElementById('time').value;

    if (!date || !pickup || !center || !time) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const response = await fetch('/api/buses/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, pickup, center, time })
      });

      const result = await response.json();

      if (response.ok && result.bus) {
        const bus = result.bus;

        // Show bus info
        busResult.style.display = 'block';
        busNameDisplay.textContent = `Bus Name: ${bus.busName}`;
        busTypeDisplay.textContent = `Type: ${bus.type}`;
        seatInfo.textContent = `Seats Available: ${bus.seatsAvailable}`;
        priceInfo.textContent = `Price: ₹${bus.price}`;

        // Save info to localStorage for payment
        localStorage.setItem('bookingDetails', JSON.stringify({
          date,
          pickup,
          center,
          time,
          busName: bus.busName,
          price: bus.price
        }));
      } else {
        alert(result.message || "No bus available for this route.");
        busResult.style.display = 'none';
      }
    } catch (err) {
      console.error('Bus search failed:', err);
      alert("Error checking bus availability.");
    }
  });

  // ✅ Proceed to payment
  proceedBtn.addEventListener('click', () => {
    window.location.href = 'payment.html';
  });
});



