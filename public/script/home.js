// Function to check login status
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    if (isLoggedIn) {
        document.getElementById('profile-link').style.display = 'inline';
        document.getElementById('logout-button').style.display = 'inline';
        document.getElementById('register-button').style.display = 'none';
        document.getElementById('login-button').style.display = 'none';
    } else {
        document.getElementById('profile-link').style.display = 'none';
        document.getElementById('logout-button').style.display = 'none';
        document.getElementById('register-button').style.display = 'inline';
        document.getElementById('login-button').style.display = 'inline';
    }
}
checkLoginStatus();
// Function to handle logout
function logout() {
    localStorage.removeItem('loggedIn');
    location.reload(); // Refresh the page to update button visibility
}

// Initialize
checkLoginStatus();


