// Routes and their components
const routes = {
    'login': {
        component: './src/components/login/login.html',
        title: 'Events Management | Login'
    },
    'register': {
        component: './src/components/register/register.html',
        title: 'Events Management | Register'
    },
    '404': {
        component: './src/Components/NotFound/NotFound.html',
        title: 'Events Management | Page Not Found'
    }
}

export async function loadComponent(route) {
    const routeData = routes[route] || routes['404'];

    // Update the page title
    document.title = routeData.title;

    // Load the component
    const response = await fetch(routeData.component);
    if (!response.ok) {
        throw new Error('Failed to load component');
    }

    const html = await response.text();

    // Update content
    const appContainer = document.getElementById('app');
    if (appContainer) {
        appContainer.innerHTML = html
    }

}

// Routing management
export function router() {
  console.log('Router ejecutándose');
  console.log('Hash actual:', window.location.hash);

  // Get the hash from the URL (without #), or '' if empty
  const hash = window.location.hash.slice(1) || '';

  // Load the corresponding component
  loadComponent(hash);
}

// Initialize routing
export function initRouter() {
  // Handle hash changes
  window.addEventListener('hashchange', router);

  // Handle link clicks
//   preventDefaultLinks();

  // Load the initial component
  router();
}

// Start the router when the DOM is ready
document.addEventListener('DOMContentLoaded', initRouter);