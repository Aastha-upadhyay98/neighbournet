/* ============================================
   NeighbourNet — Community Events Page
   ============================================ */

function renderEventsPage() {
  const user = Store.getCurrentUser();
  const events = Store.getEvents().sort((a, b) => new Date(a.date) - new Date(b.date));

  return `
    ${renderNavbar()}
    <div class="page-content page-enter">
      <div class="container">
        <div class="flex justify-between items-center" style="margin-bottom:var(--space-xl);">
          <h2 class="section-title" style="margin-bottom:0;">📅 ${t('communityEvents')}</h2>
          <button class="btn btn-primary btn-sm" onclick="showAddEventModal()">+ ${t('addEvent')}</button>
        </div>

        <div style="display:flex;flex-direction:column;gap:var(--space-lg);">
          ${events.length === 0 ? `
            <div class="text-center" style="padding:var(--space-3xl);color:var(--text-muted);">
              <div style="font-size:64px;margin-bottom:var(--space-lg);">📅</div>
              <p style="font-size:var(--font-size-lg);">${t('noEvents')}</p>
            </div>
          ` : events.map(event => {
            const organizer = Store.getUserById(event.organizerId);
            const date = new Date(event.date);
            const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            const day = date.getDate();
            const month = months[date.getMonth()];
            const hasRSVP = event.attendees?.includes(user.id);

            return `
              <div class="event-card">
                <div class="event-date-badge">
                  <span class="day">${day}</span>
                  <span class="month">${month}</span>
                </div>
                <div style="flex:1;">
                  <h3 style="margin-bottom:var(--space-xs);">${event.title}</h3>
                  <p style="color:var(--text-secondary);font-size:var(--font-size-sm);margin-bottom:var(--space-sm);">
                    ${event.description}
                  </p>
                  <div style="display:flex;gap:var(--space-lg);flex-wrap:wrap;font-size:var(--font-size-sm);color:var(--text-muted);">
                    <span>🕐 ${event.time}</span>
                    <span>📍 ${event.location}</span>
                    <span>👥 ${event.attendees?.length || 0} ${t('attendees')}</span>
                    ${organizer ? `<span>🙋 ${organizer.name}</span>` : ''}
                  </div>
                  <div style="margin-top:var(--space-md);">
                    <button class="btn btn-sm ${hasRSVP ? 'btn-accent' : 'btn-secondary'}"
                      onclick="rsvpToEvent('${event.id}')">
                      ${hasRSVP ? t('rsvpd') : t('rsvp')}
                    </button>
                  </div>
                </div>
              </div>`;
          }).join('')}
        </div>
      </div>
      ${renderSOSButton()}
    </div>
    <div class="modal-overlay" id="modal-overlay"></div>`;
}

function showAddEventModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">📅 ${t('addEvent')}</h2>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <form onsubmit="addNewEvent(event)" style="display:flex;flex-direction:column;gap:var(--space-lg);">
        <div class="input-group">
          <label>${t('eventTitle')}</label>
          <input type="text" id="event-title" class="input-field" placeholder="e.g. Diwali Celebration" required>
        </div>
        <div class="grid-2">
          <div class="input-group">
            <label>${t('eventDate')}</label>
            <input type="date" id="event-date" class="input-field" required>
          </div>
          <div class="input-group">
            <label>${t('eventTime')}</label>
            <input type="time" id="event-time" class="input-field" required>
          </div>
        </div>
        <div class="input-group">
          <label>${t('eventLocation')}</label>
          <input type="text" id="event-location" class="input-field" placeholder="e.g. Society Courtyard" required>
        </div>
        <div class="input-group">
          <label>${t('description')}</label>
          <textarea id="event-desc" class="input-field" rows="3" placeholder="Tell neighbors about this event..." required></textarea>
        </div>
        <button type="submit" class="btn btn-primary">${t('addEvent')}</button>
      </form>
    </div>`;
  overlay.classList.add('active');
}

function addNewEvent(e) {
  e.preventDefault();
  const user = Store.getCurrentUser();
  Store.addEvent({
    title: document.getElementById('event-title').value,
    date: document.getElementById('event-date').value,
    time: document.getElementById('event-time').value,
    location: document.getElementById('event-location').value,
    description: document.getElementById('event-desc').value,
    organizerId: user.id,
    attendees: [user.id]
  });
  closeModal();
  Store.addCredits(user.id, 5, 'Created community event');
  showToast('Event created! +5 credits 🎉');
  navigateTo('#/vibrant/events');
}

function rsvpToEvent(eventId) {
  const user = Store.getCurrentUser();
  Store.rsvpEvent(eventId, user.id);
  navigateTo('#/vibrant/events');
}
