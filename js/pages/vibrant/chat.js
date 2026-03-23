/* ============================================
   NeighborNet — Chat Hub
   ============================================ */

function renderChatPage() {
  const user = Store.getCurrentUser();
  const neighbors = Store.getUsers().filter(u => u.id !== user.id);

  return `
    ${renderNavbar()}
    <div class="page-content" style="padding-bottom:0;">
      <div class="chat-container page-enter">
        <!-- Chat Sidebar -->
        <div class="chat-sidebar" id="chat-sidebar">
          <div style="padding:var(--space-md);border-bottom:1px solid var(--border);">
            <h3>💬 ${t('chatHub')}</h3>
          </div>
          <div style="padding:var(--space-sm);">
            ${neighbors.map(n => `
              <button class="chat-contact" onclick="openChat('${n.id}')" id="contact-${n.id}">
                ${avatarHTML(n, 'avatar-sm')}
                <div style="flex:1;text-align:left;">
                  <div style="font-weight:var(--font-weight-medium);font-size:var(--font-size-sm);">${n.name}</div>
                  <div style="font-size:var(--font-size-xs);color:var(--text-muted);">🏠 ${n.apartment}</div>
                </div>
                <span style="font-size:var(--font-size-xs);color:var(--text-muted);">${n.type === 'senior' ? '🧓' : '🧑'}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Chat Main -->
        <div class="chat-main" id="chat-main">
          <div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-muted);">
            <div class="text-center">
              <div style="font-size:64px;margin-bottom:var(--space-lg);">💬</div>
              <p style="font-size:var(--font-size-lg);">${t('selectChat')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-overlay" id="modal-overlay"></div>

    <style>
      .chat-contact {
        display: flex;
        align-items: center;
        gap: var(--space-sm);
        padding: 10px 12px;
        border-radius: var(--radius-md);
        width: 100%;
        background: none;
        border: none;
        color: var(--text-primary);
        cursor: pointer;
        transition: background var(--transition-fast);
        font-family: inherit;
      }
      .chat-contact:hover, .chat-contact.active {
        background: rgba(108,92,231,0.1);
      }
      @media (max-width: 768px) {
        .chat-container { flex-direction: column; height: auto; }
        #chat-sidebar { width: 100%; border-right: none; border-bottom: 1px solid var(--border); max-height: 200px; overflow-y: auto; }
      }
    </style>`;
}

let activeChatUser = null;

function openChat(userId) {
  const user = Store.getCurrentUser();
  const neighbor = Store.getUserById(userId);
  if (!neighbor) return;
  activeChatUser = neighbor;

  // Highlight contact
  document.querySelectorAll('.chat-contact').forEach(c => c.classList.remove('active'));
  document.getElementById(`contact-${userId}`)?.classList.add('active');

  const convo = Store.getOrCreateConversation(user.id, userId);
  const messages = Store.getMessages(convo.id);

  const chatMain = document.getElementById('chat-main');
  chatMain.innerHTML = `
    <div style="padding:var(--space-md);border-bottom:1px solid var(--border);display:flex;align-items:center;gap:var(--space-md);">
      ${avatarHTML(neighbor)}
      <div>
        <h3 style="font-size:var(--font-size-md);">${neighbor.name}</h3>
        <span style="font-size:var(--font-size-xs);color:var(--text-muted);">🏠 ${neighbor.apartment}</span>
      </div>
    </div>
    <div class="chat-messages" id="chat-messages">
      ${messages.length === 0 ? `
        <div class="text-center" style="color:var(--text-muted);padding:var(--space-2xl);">
          <p>${t('noMessages')}</p>
        </div>
      ` : messages.map(m => `
        <div class="chat-bubble ${m.senderId === user.id ? 'sent' : 'received'}">
          ${m.text}
          <div style="font-size:10px;color:rgba(255,255,255,0.5);margin-top:4px;">${timeAgo(m.sentAt)}</div>
        </div>
      `).join('')}
    </div>
    <div class="chat-input-bar">
      <input type="text" id="chat-input" placeholder="${t('sendMessage')}" onkeydown="if(event.key==='Enter')sendChatMessage()">
      <button class="btn btn-primary btn-icon" onclick="sendChatMessage()">➤</button>
    </div>`;

  // Scroll to bottom
  const messagesDiv = document.getElementById('chat-messages');
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function sendChatMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text || !activeChatUser) return;

  const user = Store.getCurrentUser();
  const convo = Store.getOrCreateConversation(user.id, activeChatUser.id);
  Store.sendMessage(convo.id, { senderId: user.id, text });

  // Re-render chat
  openChat(activeChatUser.id);
  setTimeout(() => {
    document.getElementById('chat-input')?.focus();
  }, 50);
}
