/*
 * SPA Routing System for Events Management
 *
 * To use the routing in other JavaScript files:
 *
 * 1. Import the necessary functions:
 *    import { router } from "./routes";
 *
 * 2. To redirect to a route:
 *    window.location.hash = "route-name";
 *    router();
 *
 * 3. To navigate to a specific route:
 *    // Example: Navigate to dashboard
 *    window.location.hash = "dashboard";
 *    router();
 *
 * Important notes:
 * - Routes are defined in the 'routes' object at the beginning of the file
 * - Components must be at the path specified in 'component'
 * - Page titles are updated automatically according to the route
 * - Error handling is implemented with the 404 page
 */

// Definition of routes and their corresponding components
const routes = {
  '': { component: './src/components/login/Login.html', script: './src/scripts/login.js', title: 'Events Management - Login' },
  'register': { component: './src/components/register/Register.html', script: './src/scripts/register.js', title: 'Events Management - Register' },
  'events': { component: './src/components/Events/Events.html', script: './src/scripts/events.js', title: 'Events Management - Eventos' },
  'dashboard': { component: './src/components/dashboard/Dashboard.html', script: './src/scripts/dashboard.js', title: 'Events Management - Dashboard' },
  'access-denied': { component: './src/components/AccessDenied/AccessDenied.html', title: 'Events Management - Access Denied Denegado' },
  '404': { component: './src/components/NotFound/NotFound.html', title: 'Events Management - Page Not Found' }
};

// Function that loads the component and updates the page title
export async function loadComponent(route) {
  // Role validation for dashboard
  if (route === 'dashboard') {
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    if (!loggedUser || loggedUser.role !== 'admin') {
      // Redirect to access denied
      window.location.hash = 'access-denied';
      route = 'access-denied';
    }
  }
  try {
    const routeData = routes[route] || routes['404'];

    // Update the page title
    document.title = routeData.title;

    // Load the component
    const response = await fetch(routeData.component);
    if (!response.ok) {
      throw new Error('Failed to load component');
    }

    const html = await response.text();

    // Update the content
    const appContainer = document.getElementById('app');
    if (appContainer) {
      appContainer.innerHTML = html;

      // Run the JavaScript from the loaded component.
      const scripts = appContainer.getElementsByTagName('script');
      Array.from(scripts).forEach(script => {
        const newScript = document.createElement('script');
        if (script.src) {
          newScript.src = script.src;
          newScript.async = false; // Make sure the script is executed in order
        } else {
          newScript.textContent = script.textContent;
        }
        script.type = script.type || 'module'; // Make sure it is a module
        script.parentNode.replaceChild(newScript, script);
      });
    }

    // Load an external JavaScript defined in routeData.script (if it exists)
    if (routeData.script) {
      const existingScript = document.querySelector(`script[src="${routeData.script}"]`);
      if (!existingScript) {
        const externalScript = document.createElement('script');
        externalScript.src = routeData.script;
        externalScript.type = 'module';
        externalScript.async = false;
        document.body.appendChild(externalScript);
      }
    }
  } catch (error) {
    console.error('Error loading component:', error);
    loadComponent('404');
  }
}

// Routing management
export function router() {
  console.log('Router ejecutándose');
  console.log('Hash actual:', window.location.hash);

  // Get the hash from the URL with no # or '' if it is empty
  const hash = window.location.hash.slice(1) || '';

  // Load the corresponding component
  loadComponent(hash);
}

// Prevent default behavior of anchor links
export function preventDefaultLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const hash = e.currentTarget.getAttribute('href').slice(1);
      window.location.hash = hash;
      router();
    });
  });
}

// Initialize routing
export function initRouter() {
  // Handle hash changes
  window.addEventListener('hashchange', router);

  // Handle link clicks
  preventDefaultLinks();

  // Load the initial component
  router();
}

// Start the router when the DOM is ready
document.addEventListener('DOMContentLoaded', initRouter);
