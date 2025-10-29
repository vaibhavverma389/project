document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm');

  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // get input values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const mobile = document.getElementById('mobile').value.trim();
    const roll = document.getElementById('roll').value.trim();
    const gender = document.getElementById('gender').value.trim();
    const pmobile = document.getElementById('pmobile').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // simple validation
    if (!name || !email || !mobile || !roll || !gender || !pmobile || !password) {
      alert("⚠️ Please fill all the fields!");
      return;
    }

    if (password !== confirmPassword) {
      alert("❌ Passwords do not match!");
      return;
    }

    // prepare data
    const studentData = {
      name,
      email,
      mobile,
      gender,
      pmobile,
      roll,
      password
    };

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(studentData)
      });

      const result = await response.json();

      if (response.ok) {
        alert('✅ Account created successfully! Redirecting to login...');
        // optionally save token
        localStorage.setItem('token', result.token);
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
