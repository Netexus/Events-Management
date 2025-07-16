// dashboard.js - Lógica CRUD de eventos para el panel de administración

const API_URL = "http://localhost:3000/events";

// Elementos del DOM
const showEventFormBtn = document.getElementById('showEventFormBtn');
const eventFormSection = document.getElementById('eventFormSection');
const eventForm = document.getElementById('eventForm');
const cancelEventBtn = document.getElementById('cancelEventBtn');
const eventsTableBody = document.querySelector('#eventsTable tbody');
const eventFormTitle = document.getElementById('eventFormTitle');

const today = new Date().toISOString().split('T')[0]; // Set a variable with the current day.
document.getElementById('eventDate').setAttribute('min', today); // Take the date attribute and set it as minimun the current day 

// Estado de edición
let editingEventId = null;

// Mostrar/ocultar formulario
showEventFormBtn.addEventListener('click', () => {
  eventFormSection.style.display = 'block';
  eventForm.reset();
  editingEventId = null;
  eventFormTitle.textContent = 'New event';
});

cancelEventBtn.addEventListener('click', () => {
  eventFormSection.style.display = 'none';
  eventForm.reset();
  editingEventId = null;
});

// Wait for the events table to exist in the DOM before rendering
function waitForEventsTableAndInit() {
  // Try to initialize the dashboard logic once the table exists
  const tryInit = () => {
    const table = document.querySelector('#eventsTable tbody');
    if (table) {
      fetchAndRenderEvents(); // Load all events into the table
      eventFormSection.style.display = 'none';
      eventForm.reset();
      editingEventId = null;
      return true;
    }
    return false;
  };

  // If the table is not present yet, observe the DOM until it appears
  if (!tryInit()) {
    const observer = new MutationObserver(() => {
      if (tryInit()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
}

// Run initialization when navigating to the dashboard route
window.addEventListener('hashchange', () => {
  if (window.location.hash === '#dashboard') {
    waitForEventsTableAndInit();
  }
});

// Also run on direct page load if already on dashboard
if (window.location.hash === '#dashboard') {
  waitForEventsTableAndInit();
}


async function fetchAndRenderEvents() {
  try {
    const res = await fetch(API_URL);
    const events = await res.json();
    renderEvents(events);
  } catch (err) {
    eventsTableBody.innerHTML = '<tr><td colspan="6">Error loading events</td></tr>';
  }
}

function renderEvents(events) {
  if (!events.length) {
    eventsTableBody.innerHTML = '<tr><td colspan="6">No events</td></tr>';
    return;
  }
  eventsTableBody.innerHTML = events.map(event => `
    <tr data-id="${event.id}">
      <td>${event.title}</td>
      <td>${event.description}</td>
      <td>${event.availableSeats}</td>
      <td>${event.date}</td>
      <td>${event.location}</td>
      <td>
        <button class="btn btn-sm btn-warning me-2 edit-event-btn">Edit</button>
        <button class="btn btn-sm btn-danger delete-event-btn">Deleter</button>
      </td>
    </tr>
  `).join('');
}

// Edit/Delete buttons
eventsTableBody.addEventListener('click', async (e) => {
  const row = e.target.closest('tr');
  if (!row) return;
  const eventId = row.getAttribute('data-id');
  if (e.target.classList.contains('edit-event-btn')) {
    // Editar evento
    try {
      const res = await fetch(`${API_URL}/${eventId}`);
      const event = await res.json();
      eventFormSection.style.display = 'block';
      eventForm.eventTitle.value = event.title;
      eventForm.eventDescription.value = event.description;
      eventForm.eventDate.value = event.date;
      eventForm.eventLocation.value = event.location;
      eventForm.eventSeats.value = event.availableSeats;
      editingEventId = eventId;
      eventFormTitle.textContent = 'Editar event';
    } catch (err) {
      alert('Error loading events');
    }
  } else if (e.target.classList.contains('delete-event-btn')) {
    // Eliminar evento
    if (!confirm('Are you sure you want to delet this event?')) return;
    try {
      await fetch(`${API_URL}/${eventId}`, { method: 'DELETE' });
      fetchAndRenderEvents();
    } catch (err) {
      alert('Error deleting event');
    }
  }
});

// Create or edit event
eventForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const newEvent = {
    title: eventForm.eventTitle.value,
    description: eventForm.eventDescription.value,
    date: eventForm.eventDate.value,
    location: eventForm.eventLocation.value,
    availableSeats: parseInt(eventForm.eventSeats.value, 10)
  };
  try {
    if (editingEventId) {
      await fetch(`${API_URL}/${editingEventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent)
      });
    } else {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent)
      });
    }
    fetchAndRenderEvents();
    eventFormSection.style.display = 'none';
    eventForm.reset();
    editingEventId = null;
  } catch (err) {
    alert('Error guardando evento');
  }
});

// Edit event
window.editEvent = async function(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    const event = await res.json();
    eventFormSection.style.display = 'block';
    eventForm.eventTitle.value = event.title;
    eventForm.eventDescription.value = event.description;
    eventForm.eventDate.value = event.date;
    eventForm.eventLocation.value = event.location;
    eventForm.eventSeats.value = event.availableSeats;
    editingEventId = id;
    eventFormTitle.textContent = 'Editar Evento';
  } catch (err) {
    alert('Error cargando evento');
  }
}

// Delet event
window.deleteEvent = async function(id) {
  if (!confirm('¿Seguro que deseas eliminar este evento?')) return;
  try {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchAndRenderEvents();
  } catch (err) {
    alert('Error eliminando evento');
  }
}
