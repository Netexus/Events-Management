import { logout } from './guard.js';

async function renderNavbar() {
  const container = document.getElementById('navbar-container');
  const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
  let navbarPath = '';
  if (!loggedUser) {
    navbarPath = './src/components/Navbar/NavbarLoggedOut.html';
  } else if (loggedUser.role === 'admin') {
    navbarPath = './src/components/Navbar/NavbarAdmin.html';
  } else {
    navbarPath = './src/components/Navbar/NavbarLoggedIn.html';
  }
  try {
    const response = await fetch(navbarPath);
    let html = await response.text();
    container.innerHTML = html;
    // Assign name
    if (loggedUser && container.querySelector('#navbarUserName')) {
      container.querySelector('#navbarUserName').textContent = loggedUser.name;
    }
    // Assign role
    if (loggedUser && container.querySelector('#navbarRole')) {
      container.querySelector('#navbarRole').textContent = loggedUser.role;
    }
    // Event logout
    const logoutBtn = container.querySelector('#logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', logout);
    }
  } catch (e) {
    container.innerHTML = '<div class="alert alert-danger">Error loading navbar.</div>';
  }
}

// Initial render
renderNavbar();
// Re-render after login/logout
window.addEventListener('storage', renderNavbar);
window.addEventListener('hashchange', () => {
  // In case the user navigates and the state changes
  setTimeout(renderNavbar, 100);
});
