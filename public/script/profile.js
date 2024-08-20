
async function fetchProfile() {
  try {
    const response = await fetch('/profile');
    if (!response.ok) throw new Error('Network response was not ok.');
    
    const result = await response.json();
    const user = result.user;
    
    document.getElementById('userId').value = user._id;
    document.getElementById('firstname').value = user.firstname || '';
    document.getElementById('lastname').value = user.lastname || '';
    document.getElementById('email').value = user.email || '';
    document.getElementById('country').value = user.country || '';
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while fetching the profile.');
  }
}

async function updateProfile(event) {
  event.preventDefault();
  
  const userId = document.getElementById('userId').value;
  if (!userId) return alert('User ID is missing');
  
  const profileData = {
    firstname: document.getElementById('firstname').value,
    lastname: document.getElementById('lastname').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
    country: document.getElementById('country').value,
    userId
  };
  
  try {
    const response = await fetch('/update-profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });
    
    if (response.ok) {
      alert('Profile updated successfully');
    } else {
      const result = await response.json();
      alert('Error updating profile: ' + result.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while updating the profile.');
  }
}

document.addEventListener('DOMContentLoaded', fetchProfile);
document.getElementById('updateProfileForm').addEventListener('submit', updateProfile);
