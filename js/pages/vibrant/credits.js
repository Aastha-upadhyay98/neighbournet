/* ============================================
   NeighborNet — Credits / Karma Page
   ============================================ */

function renderCreditsPage() {
  const user = Store.getCurrentUser();
  const leaderboard = Store.getLeaderboard();
  const log = Store.getCreditLog(user.id);
  const topUser = leaderboard[0];

  return `
    ${renderNavbar()}
    <div class="page-content page-enter">
      <div class="container">
        <h2 class="section-title">⭐ ${t('communityKarma')}</h2>

        <!-- Stats Row -->
        <div class="grid-3" style="margin-bottom:var(--space-2xl);">
          <div class="stat-card">
            <div class="stat-value">${user.credits || 0}</div>
            <div class="stat-label">${t('yourCredits')}</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${log.filter(l => l.amount > 0).reduce((s, l) => s + l.amount, 0)}</div>
            <div class="stat-label">Total ${t('earned')}</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${Math.abs(log.filter(l => l.amount < 0).reduce((s, l) => s + l.amount, 0))}</div>
            <div class="stat-label">Total ${t('spent')}</div>
          </div>
        </div>

        <div class="dashboard-layout">
          <!-- Leaderboard -->
          <div>
            ${topUser ? `
              <div class="card" style="margin-bottom:var(--space-xl);text-align:center;background:var(--gradient-card);border-color:rgba(253,203,110,0.3);">
                <h3 style="margin-bottom:var(--space-md);">${t('neighborOfMonth')}</h3>
                ${avatarHTML(topUser, 'avatar-xl')}
                <h2 style="margin-top:var(--space-md);">${topUser.name}</h2>
                <p style="color:var(--text-muted);">🏠 ${topUser.apartment}</p>
                <div class="stat-value" style="margin-top:var(--space-md);">${topUser.credits}⭐</div>
              </div>
            ` : ''}

            <div class="card">
              <h3 style="margin-bottom:var(--space-lg);">🏆 ${t('leaderboard')}</h3>
              ${leaderboard.map((u, i) => `
                <div class="leaderboard-item" style="${u.id === user.id ? 'background:rgba(108,92,231,0.1);border-radius:var(--radius-md);' : ''}">
                  <span class="leaderboard-rank ${i < 3 ? 'rank-' + (i + 1) : ''}" style="${i >= 3 ? 'background:var(--bg-input);color:var(--text-muted);' : ''}">
                    ${i + 1}
                  </span>
                  ${avatarHTML(u, 'avatar-sm')}
                  <div style="flex:1;">
                    <div style="font-weight:var(--font-weight-medium);">${u.name} ${u.id === user.id ? '(You)' : ''}</div>
                    <div style="font-size:var(--font-size-xs);color:var(--text-muted);">🏠 ${u.apartment} · ${u.type === 'senior' ? '🧓' : '🧑'}</div>
                  </div>
                  <span class="leaderboard-credits">${u.credits}⭐</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Credit History -->
          <div>
            <div class="card">
              <h3 style="margin-bottom:var(--space-lg);">📜 ${t('creditHistory')}</h3>
              ${log.length === 0 ? `
                <p style="color:var(--text-muted);text-align:center;padding:var(--space-xl);">${t('noCredits')}</p>
              ` : log.slice(0, 20).map(entry => `
                <div class="flex items-center gap-md" style="padding:var(--space-sm) 0;border-bottom:1px solid var(--border);">
                  <span style="font-size:20px;">${entry.amount > 0 ? '📈' : '📉'}</span>
                  <div style="flex:1;">
                    <div style="font-size:var(--font-size-sm);">${entry.reason || 'Community activity'}</div>
                    <div style="font-size:var(--font-size-xs);color:var(--text-muted);">${timeAgo(entry.date)}</div>
                  </div>
                  <span style="font-weight:var(--font-weight-bold);color:${entry.amount > 0 ? 'var(--success)' : 'var(--danger-light)'};">
                    ${entry.amount > 0 ? '+' : ''}${entry.amount}
                  </span>
                </div>
              `).join('')}
            </div>

            <!-- Earn Credits Info -->
            <div class="card" style="margin-top:var(--space-lg);">
              <h3 style="margin-bottom:var(--space-md);">💡 How to earn credits</h3>
              <div style="display:flex;flex-direction:column;gap:var(--space-sm);color:var(--text-secondary);font-size:var(--font-size-sm);">
                <div>✅ Help a neighbor with a request: <strong style="color:var(--success);">+10 credits</strong></div>
                <div>✅ Lend an item from marketplace: <strong style="color:var(--success);">+5 credits</strong></div>
                <div>✅ Share a skill with someone: <strong style="color:var(--success);">+15 credits</strong></div>
                <div>✅ Respond to an emergency: <strong style="color:var(--success);">+25 credits</strong></div>
                <div>✅ Post helpful announcements: <strong style="color:var(--success);">+3 credits</strong></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      ${renderSOSButton()}
    </div>
    <div class="modal-overlay" id="modal-overlay"></div>`;
}
