# eventsManagement

eventsManagement is a single-page application (SPA) for event management, developed with JavaScript, HTML, and CSS (Bootstrap). It allows administrators to manage events (CRUD), and visitors to view and register for events. It includes user authentication, roles, protected routes, session persistence, and synchronization with a simulated database using `json-server`.

## Main features

- **Robust dashboard event rendering:** The admin dashboard uses a MutationObserver to ensure the events table is always populated, even when HTML is loaded dynamically. This guarantees a reliable experience when navigating or reloading the dashboard route.
- **Robust user events rendering:** The user events view also uses a MutationObserver, ensuring the events list always appears correctly, even with dynamic HTML loading. This makes the user experience more reliable.

- **User Authentication:** Registration and login with roles (admin/user), session persistence in Local Storage.
- **Event Management (CRUD):** The administrator can create, view, edit, and delete events from the dashboard.
- **Event Registration:** Users can view and register for available events.
- **Protected Routes and Roles:** Only administrators can access the management panel; visitors can only view and register for events.
- **SPA Routing:** Navigation without reloading the page, using URL hashes and dynamic component loading.
- **Synchronization with json-server:** All CRUD operations are reflected in a mock database (`db.json`).
- **Responsive and Modular UI:** HTML components and scripts organized for easy maintenance.
- **Error Handling:** Friendly pages for 404s and access denied.

## Project structure

```
eventsManagement/
├── index.html
├── global.css
├── README.md
├── src/
│   ├── assets/
│   │   └── favicon.png
│   ├── database/
│   │   └── db.json          # Users and notes data (mock backend)
│   ├── components/
│   │   ├── AccessDenied/AccessDenied.html
│   │   ├── dashboard/dashboard.html
│   │   ├── Events/Events.html
│   │   ├── login/Login.html
│   │   ├── Navbar/
│   │   ├── AccessDenied/
│   │   ├── NotFound/
│   │   └── Navbar/
│   │       ├── NavbarAdmin.html
│   │       ├── NavbarLoggedIn.html
│   │       └── NavbarLoggedOut.html
│   ├── scripts/
│   │   ├── dashboard.js
│   │   ├── events.js
│   │   ├── guard.js
│   │   └── login.js
│   │   ├── navbar.js
│   │   └── register.js
│   │   └── routes.js

```

## Mock backend (`db.json`)

`src/database/db.json` has:

---

## Recommendations & Next Steps

This project is a robust SPA for event management with role-based access, persistent sessions, and a mock backend. Here are suggestions for further improvements:

### Recommended Features

- **Allow users to cancel event registration** and automatically update available seats.
- **Show users a list of their registered events** on their profile or events page.
- **Let admins view the list of attendees for each event** directly in the dashboard.
- **Add pagination, search, or filtering** for events if the dataset grows.
- **Internationalization (i18n):** Support both English and Spanish UIs.

### UI/UX Improvements

- Use modals for event creation/editing instead of inline forms.
- Add toast notifications for actions (success, error, etc).
- Improve form validation (e.g., prevent past dates, duplicate titles, etc).
- Show loading spinners while fetching data.

### Security Improvements

- Hash passwords before saving them (even in mock backend).
- Implement session expiration and auto-logout after inactivity.
- Hide sensitive information from the frontend.

### Code Quality & Refactoring

- Move API calls to a dedicated service layer for better separation of concerns.
- Modularize code further and improve reusability.
- Add even more descriptive comments and JSDoc for all functions (see codebase: all JS files are fully commented in English).

### Testing

- Add unit tests for critical logic (registration, authentication, CRUD).
- Add integration tests for end-to-end flows.

---

If you resume this project, these recommendations will help you scale, secure, and professionalize your app!

---

**Note:** All JavaScript code is fully commented in English for easier maintenance and collaboration.

- **users:** Usuarios (admin y usuarios normales) con campos: `id`, `name`, `email`, `username`, `password`, `role`.
- **events:** Eventos con campos: `id`, `title`, `description`, `date`, `location`, `availableSeats`.
- **registrations:** Registros de asistencia con campos: `id`, `userId`, `eventId`.

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Netexus/JavaScriptTest
   cd eventsManagement
   ```
2. **Install Json-server server**:
   ```bash
   npm install -g json-server
   json-server --watch src/database/db.json --port 3000
   ```
3. **Open** Or use [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) in VSCode.

## Usage

- Register a new account or login with an existing user (see `db.json` for mock users).
- Admin credentials:
  - Email: `robinson.cortes@riwi.io`
  - Password: `robinson123`
- After login, the navbar and available routes will update according to your role.
- Only admins can access the dashboard; other users will be redirected to the Access Denied page.

## License

This project is for educational purposes. Feel free to use and adapt it for your own needs.
