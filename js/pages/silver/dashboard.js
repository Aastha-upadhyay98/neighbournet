/* ============================================
   NeighbourNet — Silver Dashboard (Seniors)
   ============================================ */

function renderSilverDashboard() {
  const user = Store.getCurrentUser();

  return `
    <div class="page-content page-enter" style="padding-top:var(--space-xl);">
      <div class="container">
        <!-- Greeting -->
        <div class="text-center" style="margin-bottom:var(--space-2xl);">
          <div class="lang-selector" style="justify-content:center;display:inline-flex;margin-bottom:var(--space-lg);">
            <button class="lang-btn ${I18n.currentLang==='en'?'active':''}" onclick="switchLang('en')">English</button>
            <button class="lang-btn ${I18n.currentLang==='hi'?'active':''}" onclick="switchLang('hi')">हिंदी</button>
            <button class="lang-btn ${I18n.currentLang==='mr'?'active':''}" onclick="switchLang('mr')">मराठी</button>
          </div>
          <h1 style="font-size:1.8rem;margin-bottom:var(--space-sm);">
            ${t('greeting')}, ${user.name} 🙏
          </h1>
          <p style="color:var(--text-secondary);font-size:1.1rem;">🏠 ${user.apartment}</p>
        </div>

        <!-- Voice Command Card -->
        <div class="voice-command-card">
          <button class="voice-main-btn" id="voice-command-btn" onclick="startVoiceCommand()">
            🎤
          </button>
          <div class="voice-status" id="voice-status">${t('voiceTapToSpeak')}</div>
          <div class="voice-hint">${t('voiceHint')}</div>
        </div>

        <!-- Call a Neighbor — Primary Action -->
        <div style="max-width:600px;margin:0 auto var(--space-2xl);">
          <button class="call-neighbor-btn" onclick="showSilverHelpModal()">
            📞 ${t('callNeighbor')}
          </button>
          <p style="text-align:center;color:var(--text-muted);margin-top:var(--space-sm);font-size:0.95rem;">
            ${t('callNeighborDesc')}
          </p>
        </div>

        <!-- Action Grid -->
        <div class="silver-grid">
          <div class="silver-action-card" onclick="navigateTo('#/silver/notices')">
            <span class="action-icon">📋</span>
            <span class="action-label">${t('notices')}</span>
          </div>
          <div class="silver-action-card" onclick="navigateTo('#/silver/messages')">
            <span class="action-icon">💬</span>
            <span class="action-label">${t('messages')}</span>
          </div>
          <div class="silver-action-card" onclick="showSilverHelpModal('medicine')">
            <span class="action-icon">💊</span>
            <span class="action-label">${t('medicine')}</span>
          </div>
          <div class="silver-action-card" onclick="showSilverHelpModal('grocery')">
            <span class="action-icon">🛒</span>
            <span class="action-label">${t('grocery')}</span>
          </div>
          <div class="silver-action-card" onclick="navigateTo('#/emergency')">
            <span class="action-icon">🏥</span>
            <span class="action-label">${t('localLifeline')}</span>
          </div>
          <div class="silver-action-card" onclick="handleLogout()">
            <span class="action-icon">🚪</span>
            <span class="action-label">${t('logout')}</span>
          </div>
        </div>
      </div>

      ${renderSOSButton()}
      ${renderSilverNav()}
    </div>
    <div class="modal-overlay" id="modal-overlay"></div>`;
}

function showSilverHelpModal(preset) {
  const presetText = {
    'medicine': `💊 ${t('medicine')} — I need help getting my medicine`,
    'grocery': `🛒 ${t('grocery')} — I need help with grocery shopping`,
  };

  const overlay = document.getElementById('modal-overlay');
  overlay.innerHTML = `
    <div class="modal-content" style="text-align:center;">
      <div class="modal-header">
        <h2 class="modal-title">📞 ${t('callNeighbor')}</h2>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <p style="color:var(--text-secondary);margin-bottom:var(--space-xl);font-size:1.1rem;">
        ${t('whatHelp')}
      </p>
      <div style="position:relative;">
        <textarea id="help-text" class="input-field" rows="3"
          style="width:100%;margin-bottom:var(--space-md);font-size:1.1rem;"
          placeholder="${t('whatHelp')}">${preset ? presetText[preset] || '' : ''}</textarea>
        <button class="voice-btn voice-btn-sm" id="voice-btn-help-text"
          onclick="startVoiceInput('help-text')"
          style="position:absolute;right:8px;bottom:24px;"
          title="${t('voiceDictate')}">🎤</button>
      </div>
      <button class="btn btn-primary btn-lg" style="width:100%;min-height:64px;font-size:1.2rem;" onclick="sendSilverHelp()">
        📞 ${t('sendAlert')}
      </button>
      <button class="btn btn-secondary" style="width:100%;margin-top:var(--space-md);" onclick="closeModal()">
        ${t('cancel')}
      </button>
    </div>`;
  overlay.classList.add('active');
}

function sendSilverHelp() {
  const user = Store.getCurrentUser();
  const text = document.getElementById('help-text').value.trim() || 'General help needed';
  Store.addHelpRequest({
    userId: user.id,
    userName: user.name,
    apartment: user.apartment,
    message: text
  });
  document.getElementById('modal-overlay').innerHTML = `
    <div class="modal-content" style="text-align:center;">
      <div style="font-size:72px;margin-bottom:var(--space-lg);animation:pageIn 0.5s ease;">✅</div>
      <h2 style="margin-bottom:var(--space-md);font-size:1.4rem;">${t('helpSent')}</h2>
      <p style="color:var(--text-secondary);font-size:1.1rem;">${t('helpSentDesc')}</p>
      <button class="btn btn-primary btn-lg" style="width:100%;margin-top:var(--space-xl);" onclick="closeModal()">OK</button>
    </div>`;
}
