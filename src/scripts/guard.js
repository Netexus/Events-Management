// Function to log out
export function logout() {
  localStorage.removeItem('loggedUser');
  window.location.hash = 'login';
  window.location.reload();
}
