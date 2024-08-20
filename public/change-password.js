document.getElementById('changePasswordForm').addEventListener('submit', async function(event) {
    event.preventDefault();
  
    const userId = document.getElementById('userId').value;
    const currentPassword = document.querySelector('input[name="currentPassword"]').value;
    const newPassword = document.querySelector('input[name="newPassword"]').value;
    const confirmNewPassword = document.querySelector('input[name="confirmNewPassword"]').value;
  
    if (newPassword !== confirmNewPassword) {
      alert('New passwords do not match');
      return;
    }
  
    try {
      const response = await fetch('/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, currentPassword, newPassword, confirmNewPassword })
      });
  
      // Check if the response is HTML (e.g., error page) instead of JSON
      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.includes('text/html')) {
        const text = await response.text();
        throw new Error(`Unexpected HTML response: ${text}`);
      }
  
      const result = await response.json();
  
      if (response.ok) {
        alert('Password updated successfully');
      } else {
        alert('Error changing password: ' + result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An unexpected error occurred: ' + error.message);
    }
  });
  