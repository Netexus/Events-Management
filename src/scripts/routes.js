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
  // 'home': { component: './src/components/Home/Home.html', title: 'Events Management - Home' },
  '': { component: './src/components/login/Login.html', script: './src/scripts/login.js', title: 'Events Management - Login' },
  'register': { component: './src/components/register/Register.html', script: './src/scripts/register.js', title: 'Events Management - Register' },

  // 'contact': { component: './src/components/Contact/Contact.html', title: 'Events Management - Contact' },
  // 'terms': { component: './src/components/Terms/Terms.html', title: 'Events Management - Terms' },
  // 'about': { component: './src/components/About/About.html', title: 'Events Management - About' },
  'notes': { component: './src/components/Notes/Notes.html', script: './src/scripts/notes.js', title: 'Events Management - Eventos' },
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

      // Ejecutar el código JavaScript del componente cargado
      const scripts = appContainer.getElementsByTagName('script');
      Array.from(scripts).forEach(script => {
        const newScript = document.createElement('script');
        if (script.src) {
          newScript.src = script.src;
          newScript.async = false; // Asegurarse de que el script se ejecute en orden
        } else {
          newScript.textContent = script.textContent;
        }
        script.type = script.type || 'module'; // Asegurarse de que sea un módulo
        script.parentNode.replaceChild(newScript, script);
      });
    }

    // Cargar un archivo JS externo definido en routeData.script (si existe)
    if (routeData.script) {
      const existingScript = document.querySelector(`script[src="${routeData.script}"]`);
      if (!existingScript) {
        const externalScript = document.createElement('script');
        externalScript.src = routeData.script;
        externalScript.type = 'module'; // Asegurarse de que sea un módulo
        externalScript.async = false;
        document.body.appendChild(externalScript);
      }
    }
  } catch (error) {
    console.error('Error loading component:', error);
    // Si hay un error, cargar la página de error 404
    loadComponent('404');
  }
}

// Manejador de enrutamiento
export function router() {
  console.log('Router ejecutándose');
  console.log('Hash actual:', window.location.hash);

  // Obtener el hash de la URL (sin el #), o '' si está vacío
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
