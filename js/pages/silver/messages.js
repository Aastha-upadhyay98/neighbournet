/* ============================================
   NeighbourNet — Silver Messages (Senior View)
   ============================================ */

function renderSilverMessagesPage() {
  const user = Store.getCurrentUser();
  const neighbors = Store.getUsers().filter(u => u.id !== user.id);

  return `
    <div class="page-content page-enter" style="padding-top:var(--space-xl);">
      <div class="container" style="max-width:700px;">
        <button class="btn btn-secondary" onclick="navigateTo('#/silver')" style="margin-bottom:var(--space-lg);">
          ← ${t('back')}
        </button>

        <h1 class="section-title" style="font-size:1.6rem;">💬 ${t('messages')}</h1>

        <div id="silver-chat-area">
          <!-- Neighbor List -->
          <div id="silver-neighbor-list">
            ${neighbors.map(n => `
              <button class="silver-contact-btn" onclick="openSilverChat('${n.id}')">
                ${avatarHTML(n, 'avatar-lg')}
                <div style="flex:1;text-align:left;">
                  <div style="font-size:1.1rem;font-weight:var(--font-weight-semibold);">${n.name}</div>
                  <div style="font-size:0.9rem;color:var(--text-muted);">🏠 ${n.apartment}</div>
                </div>
                <span style="font-size:24px;">→</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>

      ${renderSOSButton()}
      ${renderSilverNav()}
    </div>
    <div class="modal-overlay" id="modal-overlay"></div>

    <style>
      .silver-contact-btn {
        display: flex;
        align-items: center;
        gap: var(--space-md);
        width: 100%;
        padding: var(--space-lg);
        background: var(--bg-card);
        border: 2px solid var(--border);
        border-radius: var(--radius-lg);
        color: var(--text-primary);
        cursor: pointer;
        margin-bottom: var(--space-md);
        transition: all var(--transition-fast);
        font-family: inherit;
      }
      .silver-contact-btn:hover {
        border-color: var(--primary-light);
        background: var(--bg-card-hover);
      }
    </style>`;
}

function openSilverChat(userId) {
  const user = Store.getCurrentUser();
  const neighbor = Store.getUserById(userId);
  if (!neighbor) return;

  const convo = Store.getOrCreateConversation(user.id, userId);
  const messages = Store.getMessages(convo.id);

  const area = document.getElementById('silver-chat-area');
  area.innerHTML = `
    <button class="btn btn-secondary" onclick="navigateTo('#/silver/messages')" style="margin-bottom:var(--space-lg);">
      ← ${t('back')}
    </button>

    <div class="card" style="margin-bottom:var(--space-md);">
      <div class="flex items-center gap-md">
        ${avatarHTML(neighbor, 'avatar-lg')}
        <div>
          <h2 style="font-size:1.3rem;">${neighbor.name}</h2>
          <p style="color:var(--text-muted);">🏠 ${neighbor.apartment}</p>
        </div>
      </div>
    </div>

    <div style="background:var(--bg-card);border-radius:var(--radius-lg);border:2px solid var(--border);margin-bottom:var(--space-lg);padding:var(--space-lg);max-height:400px;overflow-y:auto;" id="silver-messages">
      ${messages.length === 0 ? `
        <div class="text-center" style="padding:var(--space-2xl);color:var(--text-muted);">
          <p style="font-size:1.1rem;">${t('noMessages')}</p>
        </div>
      ` : messages.map(m => `
        <div class="chat-bubble ${m.senderId === user.id ? 'sent' : 'received'}" style="margin-bottom:var(--space-md);">
          ${m.text}
        </div>
      `).join('')}
    </div>

    <div style="display:flex;gap:var(--space-sm);align-items:center;">
      <input type="text" id="silver-chat-input" class="input-field" style="flex:1;font-size:1.1rem;padding:16px 20px;"
        placeholder="${t('sendMessage')}" onkeydown="if(event.key==='Enter')sendSilverMessage('${userId}')">
      <button class="voice-btn voice-btn-sm" id="voice-btn-silver-chat-input"
        onclick="startVoiceInput('silver-chat-input')"
        title="${t('voiceDictate')}">🎤</button>
      <button class="btn btn-primary btn-lg" onclick="sendSilverMessage('${userId}')">
        ${t('send')} ➤
      </button>
    </div>`;

  const msgsDiv = document.getElementById('silver-messages');
  msgsDiv.scrollTop = msgsDiv.scrollHeight;
}

function sendSilverMessage(userId) {
  const input = document.getElementById('silver-chat-input');
  const text = input.value.trim();
  if (!text) return;

  const user = Store.getCurrentUser();
  const convo = Store.getOrCreateConversation(user.id, userId);
  Store.sendMessage(convo.id, { senderId: user.id, text });
  openSilverChat(userId);
}
