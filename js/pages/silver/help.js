/* ============================================
   NeighbourNet — Silver Help (Call a Neighbor)
   ============================================ */

function renderSilverHelpPage() {
  const user = Store.getCurrentUser();
  const helpRequests = Store.getHelpRequests().filter(r => r.userId === user.id);

  return `
    <div class="page-content page-enter" style="padding-top:var(--space-xl);">
      <div class="container" style="max-width:700px;">
        <button class="btn btn-secondary" onclick="navigateTo('#/silver')" style="margin-bottom:var(--space-lg);">
          ← ${t('back')}
        </button>

        <h1 class="section-title" style="font-size:1.6rem;">📞 ${t('callNeighbor')}</h1>

        <!-- Main Help Button -->
        <button class="call-neighbor-btn" onclick="showSilverHelpModal()" style="margin-bottom:var(--space-2xl);">
          📞 ${t('callNeighbor')}
        </button>

        <!-- Voice Command -->
        <div class="voice-command-card" style="margin-bottom:var(--space-2xl);">
          <button class="voice-main-btn" id="voice-command-btn" onclick="startVoiceCommand()" style="width:72px;height:72px;font-size:32px;">
            🎤
          </button>
          <div class="voice-status" id="voice-status">${t('voiceTapToSpeak')}</div>
          <div class="voice-hint">${t('voiceHint')}</div>
        </div>

        <!-- Quick Needs -->
        <h2 style="font-size:1.2rem;margin-bottom:var(--space-lg);">Quick Needs</h2>
        <div class="silver-grid" style="margin-bottom:var(--space-2xl);">
          <div class="silver-action-card" onclick="showSilverHelpModal('medicine')">
            <span class="action-icon">💊</span>
            <span class="action-label">${t('medicine')}</span>
          </div>
          <div class="silver-action-card" onclick="showSilverHelpModal('grocery')">
            <span class="action-icon">🛒</span>
            <span class="action-label">${t('grocery')}</span>
          </div>
        </div>

        <!-- Past Requests -->
        ${helpRequests.length > 0 ? `
          <h2 style="font-size:1.2rem;margin-bottom:var(--space-lg);">Your Requests</h2>
          ${helpRequests.slice(0, 5).map(req => `
            <div class="card" style="margin-bottom:var(--space-md);">
              <div class="flex justify-between items-center">
                <p style="font-size:1.05rem;">${req.message}</p>
                <span class="badge badge-success">${req.status}</span>
              </div>
              <div style="font-size:0.85rem;color:var(--text-muted);margin-top:var(--space-sm);">
                ${timeAgo(req.createdAt)}
              </div>
            </div>
          `).join('')}
        ` : ''}
      </div>

      ${renderSOSButton()}
      ${renderSilverNav()}
    </div>
    <div class="modal-overlay" id="modal-overlay"></div>`;
}
