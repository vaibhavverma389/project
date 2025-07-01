// Login JS
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('studentLoginForm');
  const errorDiv = document.getElementById('error');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    try {
      const response = await fetch('/student/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('studentToken', result.token);
        alert('✅ Login successful!');
        window.location.href = 'booking.html';
      } else {
        errorDiv.textContent = result.error || result.message || 'Login failed. Check credentials.';
      }
    } catch (err) {
      console.error('Login error:', err);
      errorDiv.textContent = 'Something went wrong. Try again later.';
    }
  });
});

// 🔐 Google OAuth login
function googleLogin() {
  window.location.href = "https://851e-2409-40d2-64-c9b4-f5cb-811e-1011-5837.ngrok-free.app/api/student/google";
}
