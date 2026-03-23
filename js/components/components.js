/* ============================================
   NeighbourNet — Shared Components
   ============================================ */

// ── Navbar (Vibrant) ──
function renderNavbar() {
  const user = Store.getCurrentUser();
  const initial = user ? user.name.charAt(0) : '?';
  const themeIcon = getTheme() === 'dark' ? '🌙' : '☀️';
  return `
    <nav class="navbar">
      <a href="#/" class="navbar-brand">
        <span class="logo-icon">🏘️</span>
        <span>${t('appName')}</span>
      </a>
      <div class="navbar-links">
        <a href="#/vibrant" class="nav-link" data-page="vibrant">🏠 <span>${t('home')}</span></a>
        <a href="#/vibrant/notices" class="nav-link" data-page="notices">📋 <span>${t('notices')}</span></a>
        <a href="#/vibrant/credits" class="nav-link" data-page="credits">⭐ <span>${t('credits')}</span></a>
        <a href="#/vibrant/market" class="nav-link" data-page="market">🛒 <span>${t('market')}</span></a>
        <a href="#/vibrant/skills" class="nav-link" data-page="skills">🤝 <span>${t('skills')}</span></a>
        <a href="#/vibrant/chat" class="nav-link" data-page="chat">💬 <span>${t('chat')}</span></a>
        <a href="#/vibrant/events" class="nav-link" data-page="events">📅 <span>${t('events')}</span></a>
        <div class="lang-selector">
          <button class="lang-btn ${I18n.currentLang==='en'?'active':''}" onclick="switchLang('en')">EN</button>
          <button class="lang-btn ${I18n.currentLang==='hi'?'active':''}" onclick="switchLang('hi')">हि</button>
          <button class="lang-btn ${I18n.currentLang==='mr'?'active':''}" onclick="switchLang('mr')">म</button>
        </div>
        <button class="theme-toggle" id="theme-toggle-btn" onclick="toggleTheme()" title="${t('toggleTheme')}">
          ${themeIcon}
        </button>
        <button class="btn-icon btn-secondary" onclick="handleLogout()" title="${t('logout')}" style="border:1px solid var(--border);">
          <div class="avatar avatar-sm" style="background:${user?.color || '#6C5CE7'};width:32px;height:32px;font-size:14px;">${initial}</div>
        </button>
      </div>
    </nav>`;
}

// ── Silver Bottom Nav ──
function renderSilverNav() {
  const themeIcon = getTheme() === 'dark' ? '🌙' : '☀️';
  return `
    <nav class="silver-nav">
      <button class="silver-nav-item" onclick="navigateTo('#/silver')">
        <span class="nav-icon">🏠</span>
        <span class="nav-label">${t('home')}</span>
      </button>
      <button class="silver-nav-item" onclick="navigateTo('#/silver/notices')">
        <span class="nav-icon">📋</span>
        <span class="nav-label">${t('notices')}</span>
      </button>
      <button class="silver-nav-item" onclick="navigateTo('#/silver/messages')">
        <span class="nav-icon">💬</span>
        <span class="nav-label">${t('messages')}</span>
      </button>
      <button class="silver-nav-item" onclick="navigateTo('#/silver/help')">
        <span class="nav-icon">📞</span>
        <span class="nav-label">${t('callNeighbor')}</span>
      </button>
      <button class="silver-nav-item" onclick="toggleTheme()" title="${t('toggleTheme')}">
        <span class="nav-icon">${themeIcon}</span>
        <span class="nav-label">${t('theme')}</span>
      </button>
    </nav>`;
}

// ── SOS Floating Button ──
function renderSOSButton() {
  return `<button class="sos-floating" onclick="showSOSModal()" title="Emergency SOS">SOS</button>`;
}

// ── SOS Modal ──
function showSOSModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay.innerHTML = `
    <div class="modal-content" style="text-align:center;">
      <div class="modal-header">
        <h2 class="modal-title">${t('sosTitle')}</h2>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <p style="color:var(--text-secondary);margin-bottom:var(--space-xl);font-size:var(--font-size-lg);">
        ${t('sosConfirm')}
      </p>
      <div style="display:flex;gap:var(--space-md);justify-content:center;flex-wrap:wrap;">
        <button class="btn btn-danger btn-lg" onclick="triggerSOS()" style="min-width:180px;">
          🚨 ${t('sos')} — ${t('sendAlert')}
        </button>
        <button class="btn btn-secondary" onclick="closeModal()">
          ${t('cancel')}
        </button>
      </div>
      <div style="margin-top:var(--space-xl);padding-top:var(--space-lg);border-top:1px solid var(--border);">
        <h3 style="margin-bottom:var(--space-md);font-size:var(--font-size-lg);">${t('minorEmergency')}</h3>
        <p style="color:var(--text-muted);margin-bottom:var(--space-md);font-size:var(--font-size-sm);">${t('minorEmergencyDesc')}</p>
        <div style="display:flex;gap:var(--space-sm);justify-content:center;flex-wrap:wrap;">
          <button class="btn btn-sm" style="background:var(--bg-card);color:var(--warning);" onclick="sendMinorAlert('${t('feelingDizzy')}')">😵 ${t('feelingDizzy')}</button>
          <button class="btn btn-sm" style="background:var(--bg-card);color:var(--info);" onclick="sendMinorAlert('${t('waterLeak')}')">💧 ${t('waterLeak')}</button>
          <button class="btn btn-sm" style="background:var(--bg-card);color:var(--accent);" onclick="sendMinorAlert('${t('powerIssue')}')">⚡ ${t('powerIssue')}</button>
        </div>
      </div>
    </div>`;
  overlay.classList.add('active');
}

function triggerSOS() {
  const user = Store.getCurrentUser();
  Store.addEmergency({
    type: 'sos',
    userId: user.id,
    userName: user.name,
    apartment: user.apartment,
    message: 'SOS EMERGENCY ALERT'
  });
  document.getElementById('modal-overlay').innerHTML = `
    <div class="modal-content" style="text-align:center;">
      <div style="font-size:64px;margin-bottom:var(--space-lg);">🚨</div>
      <h2 style="color:var(--danger-light);margin-bottom:var(--space-md);font-size:var(--font-size-2xl);">${t('sosActivated')}</h2>
      <p style="color:var(--text-secondary);font-size:var(--font-size-lg);">${t('sosDesc')}</p>
      <p style="color:var(--text-muted);margin-top:var(--space-md);">🔔 Security desk notified<br>📱 Emergency contacts alerted<br>🏠 Nearest 5 neighbors notified</p>
      <button class="btn btn-secondary" style="margin-top:var(--space-xl);" onclick="closeModal()">OK</button>
    </div>`;
}

function sendMinorAlert(type) {
  const user = Store.getCurrentUser();
  Store.addEmergency({
    type: 'minor',
    userId: user.id,
    userName: user.name,
    apartment: user.apartment,
    message: type
  });
  closeModal();
  showToast(`Alert sent: ${type}`);
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('active');
}

// ── Toast Notification ──
function showToast(message, duration = 3000) {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.cssText = 'position:fixed;top:80px;right:20px;z-index:10000;display:flex;flex-direction:column;gap:8px;';
    document.body.appendChild(toastContainer);
  }
  const toast = document.createElement('div');
  toast.style.cssText = `
    background:var(--bg-card);border:1px solid var(--border-light);color:var(--text-primary);
    padding:14px 24px;border-radius:var(--radius-md);box-shadow:var(--shadow-lg);
    font-size:var(--font-size-md);animation:pageIn 0.3s ease;max-width:320px;
    backdrop-filter:blur(12px);
  `;
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ── Avatar Helper ──
function avatarHTML(user, sizeClass = '') {
  const initial = user.name?.charAt(0) || '?';
  return `<div class="avatar ${sizeClass}" style="background:${user.color || '#6C5CE7'}">${initial}</div>`;
}

// ── Time Helpers ──
function timeAgo(dateStr) {
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// ── Voice Input (Web Speech API) ──
let voiceRecognition = null;

function startVoiceInput(targetId, onResult) {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    showToast(t('voiceNotSupported'));
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (voiceRecognition) {
    voiceRecognition.stop();
    voiceRecognition = null;
    return;
  }

  voiceRecognition = new SpeechRecognition();
  voiceRecognition.continuous = false;
  voiceRecognition.interimResults = true;
  voiceRecognition.lang = I18n.currentLang === 'hi' ? 'hi-IN' : I18n.currentLang === 'mr' ? 'mr-IN' : 'en-IN';

  const btn = document.getElementById(`voice-btn-${targetId}`);
  if (btn) btn.classList.add('listening');

  const statusEl = document.getElementById('voice-status');
  if (statusEl) statusEl.textContent = t('voiceListening');

  voiceRecognition.onresult = function(event) {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    if (onResult) {
      onResult(transcript, event.results[event.resultIndex].isFinal);
    }
    const target = document.getElementById(targetId);
    if (target) target.value = transcript;
  };

  voiceRecognition.onerror = function(event) {
    showToast(t('voiceError'));
    stopVoice(targetId);
  };

  voiceRecognition.onend = function() {
    stopVoice(targetId);
  };

  voiceRecognition.start();
}

function stopVoice(targetId) {
  const btn = document.getElementById(`voice-btn-${targetId}`);
  if (btn) btn.classList.remove('listening');
  const statusEl = document.getElementById('voice-status');
  if (statusEl) statusEl.textContent = t('voiceTapToSpeak');
  voiceRecognition = null;
}

// ── Voice Command Handler (Silver Dashboard) ──
function startVoiceCommand() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    showToast(t('voiceNotSupported'));
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = I18n.currentLang === 'hi' ? 'hi-IN' : I18n.currentLang === 'mr' ? 'mr-IN' : 'en-IN';

  const btn = document.getElementById('voice-command-btn');
  const status = document.getElementById('voice-status');
  if (btn) btn.classList.add('listening');
  if (status) status.textContent = t('voiceListening');

  recognition.onresult = function(event) {
    const command = event.results[0][0].transcript.toLowerCase();
    if (status) status.textContent = `"${command}"`;

    setTimeout(() => {
      // Process voice commands
      if (command.includes('help') || command.includes('मदद') || command.includes('मदत')) {
        showSilverHelpModal();
      } else if (command.includes('medicine') || command.includes('दवाई') || command.includes('औषध')) {
        showSilverHelpModal('medicine');
      } else if (command.includes('grocery') || command.includes('किराना') || command.includes('किराणा')) {
        showSilverHelpModal('grocery');
      } else if (command.includes('emergency') || command.includes('आपातकाल') || command.includes('आणीबाणी')) {
        navigateTo('#/emergency');
      } else if (command.includes('notice') || command.includes('सूचना') || command.includes('सूचना')) {
        navigateTo('#/silver/notices');
      } else if (command.includes('message') || command.includes('संदेश') || command.includes('संदेश')) {
        navigateTo('#/silver/messages');
      } else {
        showToast(`${t('voiceHeard')}: "${command}"`);
      }
    }, 800);
  };

  recognition.onerror = function() {
    if (btn) btn.classList.remove('listening');
    if (status) status.textContent = t('voiceError');
    setTimeout(() => {
      if (status) status.textContent = t('voiceTapToSpeak');
    }, 2000);
  };

  recognition.onend = function() {
    if (btn) btn.classList.remove('listening');
    setTimeout(() => {
      if (status) status.textContent = t('voiceTapToSpeak');
    }, 2000);
  };

  recognition.start();
}
