// event.js - Logic for the user events view and event registration
// This script handles rendering the list of events for normal users (non-admin),
// allows users to register for events, and updates the UI accordingly.
// All logic is robust to dynamic HTML loading in a SPA context.

const API_EVENTS = "http://localhost:3000/events";
const API_REGISTRATIONS = "http://localhost:3000/registrations";
const API_USERS = "http://localhost:3000/users";

// Wait for the events table to exist in the DOM before rendering
function waitForUserEventsTableAndInit() {
  // Attempts to initialize the event logic once the table and message are present in the DOM.
  const tryInit = () => {
    const userEventsTableBody = document.querySelector('#userEventsTable tbody');
    const eventMessage = document.getElementById('eventMessage');
    // If both table body and message container exist, initialize event rendering.
    if (userEventsTableBody && eventMessage) {
      fetchAndRenderUserEvents();
      return true;
    }
    return false;
  };
  // If the table is not present yet, observe the DOM until it appears.
  if (!tryInit()) {
    const observer = new MutationObserver(() => {
      if (tryInit()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
}

// Listen for navigation to the #event route and initialize rendering as needed.
window.addEventListener('hashchange', () => {
  if (window.location.hash === '#event') {
    waitForUserEventsTableAndInit();
  }
});
// Also run on direct page load if already on event
if (window.location.hash === '#event') {
  waitForUserEventsTableAndInit();
}

// References to the table body and message container (updated dynamically in case HTML is reloaded)
let userEventsTableBody = null;
let eventMessage = null;

// Fetches all events and user registrations, then renders the events table for users.
// Shows registration button, status, or seat availability as appropriate.
async function fetchAndRenderUserEvents() {
  // Always get the latest references in case HTML was reloaded
  userEventsTableBody = document.querySelector('#userEventsTable tbody');
  eventMessage = document.getElementById('eventMessage');
  if (!userEventsTableBody || !eventMessage) return;
  // Clear any previous messages
  eventMessage.textContent = '';
  let loggedUser = null;
  try {
    loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
  } catch {}
  try {
    const [eventsRes, registrationsRes] = await Promise.all([
      fetch(API_EVENTS),
      fetch(API_REGISTRATIONS)
    ]);
    const events = await eventsRes.json();
    const registrations = await registrationsRes.json();
    const myRegs = loggedUser ? registrations.filter(r => r.userId === loggedUser.id) : [];
    userEventsTableBody.innerHTML = events.map(event => {
      const alreadyRegistered = myRegs.some(r => r.eventId === event.id);
      const seats = event.availableSeats;
      let actionBtn = '';
      if (!loggedUser) {
        actionBtn = '<span class="text-muted">Please log in</span>';
      } else if (alreadyRegistered) {
        actionBtn = '<span class="badge bg-success">Registered</span>';
      } else if (seats > 0) {
        actionBtn = `<button class="btn btn-primary btn-sm register-event-btn" data-id="${event.id}">Register</button>`;
      } else {
        actionBtn = '<span class="badge bg-secondary">No seats</span>';
      }
      return `
        <tr data-id="${event.id}">
          <td>${event.title}</td>
          <td>${event.description}</td>
          <td>${event.availableSeats}</td>
          <td>${event.date}</td>
          <td>${event.location}</td>
          <td>${actionBtn}</td>
        </tr>
      `;
    }).join('');
  } catch {
    userEventsTableBody.innerHTML = '<tr><td colspan="6">Error loading events</td></tr>';
  }
}
fetchAndRenderUserEvents();
// Events to register
document.addEventListener('click', async (e) => {
  if (e.target.classList.contains('register-event-btn')) {
    const row = e.target.closest('tr');
    const eventId = parseInt(row.getAttribute('data-id'), 10);
    let loggedUser = null;
    try {
      loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    } catch {}
    if (!loggedUser) {
      eventMessage.textContent = 'You need to be logged-in.';
      return;
    }
    // Check if it is already logged-in
    const regRes = await fetch(`${API_REGISTRATIONS}?userId=${loggedUser.id}&eventId=${eventId}`);
    const regs = await regRes.json();
    if (regs.length > 0) {
      eventMessage.textContent = 'You are alreade logged-in.';
      return;
    }
    // Update seats
    const eventRes = await fetch(`${API_EVENTS}/${eventId}`);
    const event = await eventRes.json();
    if (event.availableSeats <= 0) {
      eventMessage.textContent = 'There are no available seats for this event.';
      fetchAndRenderUserEvents();
      return;
    }
    // Register event
    await fetch(API_REGISTRATIONS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: loggedUser.id, eventId })
    });
    // Substract seat
    await fetch(`${API_EVENTS}/${eventId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ availableSeats: event.availableSeats - 1 })
    });
    eventMessage.textContent = '¡Successful registration!';
    fetchAndRenderUserEvents();
  }
});
