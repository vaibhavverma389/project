document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('studentToken');

  if (!token) {
    alert("Please log in to access your profile.");
    window.location.href = "login.html";
    return;
  }

  const nameField = document.getElementById('name');
  const mobileField = document.getElementById('mobile');
  const emailField = document.getElementById('email');
  const genderField = document.getElementById('gender');
  const rollField = document.getElementById('roll');

  // 🔄 Load student info
  fetch('/api/student/profile', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      nameField.value = data.name || '';
      mobileField.value = data.mobile || '';
      emailField.value = data.email || '';
      genderField.value = data.gender || '';
      rollField.value = data.roll || '';
    })
    .catch(err => {
      console.error('Error loading profile:', err);
      alert("Failed to load profile.");
    });

  // ✅ Handle Basic Info Update
  document.getElementById('basicForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const updatedData = {
      name: nameField.value.trim(),
      mobile: mobileField.value.trim(),
      email: emailField.value.trim(),
      gender: genderField.value,
      roll: rollField.value.trim()
    };

    try {
      const response = await fetch('/api/student/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });

      const result = await response.json();

      if (response.ok) {
        alert("Profile updated successfully!");
      } else {
        alert(result.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error('Update error:', err);
      alert("Something went wrong while updating profile.");
    }
  });

  // 🔐 Handle Password Change
  document.getElementById('passwordForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch('/api/student/update-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password: newPassword })
      });

      const result = await response.json();

      if (response.ok) {
        alert("Password changed successfully!");
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
      } else {
        alert(result.message || "Failed to update password.");
      }
    } catch (err) {
      console.error('Password update error:', err);
      alert("Something went wrong while changing password.");
    }
  });
});
