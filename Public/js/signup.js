document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm');

  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const mobile = document.getElementById('mobile').value.trim();
    const roll = document.getElementById('roll').value.trim(); // university
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const studentData = {
      name,
      email,
      mobile,
      parentmobile: mobile,
      university: roll,
      password
    };

    try {
      const response = await fetch('/student/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(studentData)
      });

      const result = await response.json();

      if (response.ok) {
        alert('✅ Account created successfully! Redirecting to login...');
        window.location.href = 'login.html';
      } else {
        alert(result.error || result.message || '❌ Sign-up failed. Please try again.');
      }
    } catch (err) {
      console.error('Signup Error:', err);
      alert('❌ An error occurred during sign-up. Try again later.');
    }
  });
});
