document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    if (response.ok) {
        localStorage.setItem('loggedIn', 'true');
        window.location.href = 'home.html'; // Redirect to home page after login
    } else {
        alert('Login failed');
    }
});
