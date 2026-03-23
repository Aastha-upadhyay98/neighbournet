/* ============================================
   NeighborNet — Notices & Voting Page
   ============================================ */

function renderNoticesPage() {
  const user = Store.getCurrentUser();
  const notices = Store.getNotices();
  const polls = Store.getPolls();

  return `
    ${renderNavbar()}
    <div class="page-content page-enter">
      <div class="container">
        <h2 class="section-title">📋 ${t('noticeBoard')}</h2>
        <p class="section-subtitle">${t('officialNotices')}</p>

        <div class="dashboard-layout">
          <!-- Notices -->
          <div>
            ${notices.map(notice => `
              <div class="card" style="margin-bottom:var(--space-md);border-left:4px solid ${notice.priority === 'high' ? 'var(--danger)' : 'var(--primary)'};">
                <div class="flex justify-between items-center" style="margin-bottom:var(--space-sm);">
                  <h3>${notice.title}</h3>
                  <span class="badge ${notice.priority === 'high' ? 'badge-danger' : 'badge-primary'}">
                    ${notice.priority === 'high' ? '🔴 ' + t('high') : t('normal')}
                  </span>
                </div>
                <p style="color:var(--text-secondary);margin-bottom:var(--space-md);">${notice.content}</p>
                <div style="font-size:var(--font-size-xs);color:var(--text-muted);">
                  📝 ${notice.author} · ${timeAgo(notice.createdAt)}
                </div>
              </div>
            `).join('')}

            ${notices.length === 0 ? `
              <div class="card text-center" style="padding:var(--space-3xl);color:var(--text-muted);">
                <p>No notices yet.</p>
              </div>
            ` : ''}
          </div>

          <!-- Voting / Polls -->
          <div>
            <h3 class="section-title" style="font-size:var(--font-size-xl);">🗳️ ${t('digitalVoting')}</h3>
            ${polls.map(poll => `
              <div class="card" style="margin-bottom:var(--space-lg);">
                <h3 style="margin-bottom:var(--space-lg);">${poll.question}</h3>
                ${poll.options.map((opt, i) => {
                  const totalVotes = poll.options.reduce((s, o) => s + (o.votes || 0), 0);
                  const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                  const hasVoted = poll.voters?.includes(user.id);
                  return `
                    <div class="poll-option" style="margin-bottom:var(--space-sm);">
                      <button class="poll-btn ${hasVoted ? 'voted' : ''}"
                        onclick="${hasVoted ? '' : `castVote('${poll.id}', ${i})`}"
                        ${hasVoted ? 'disabled' : ''}>
                        <span>${opt.text}</span>
                        <span class="poll-pct">${pct}% (${opt.votes || 0} ${t('votes')})</span>
                      </button>
                      <div class="poll-bar">
                        <div class="poll-bar-fill" style="width:${pct}%"></div>
                      </div>
                    </div>`;
                }).join('')}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      ${renderSOSButton()}
    </div>
    <div class="modal-overlay" id="modal-overlay"></div>

    <style>
      .poll-btn {
        display: flex;
        justify-content: space-between;
        width: 100%;
        padding: 10px 14px;
        background: var(--bg-input);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        color: var(--text-primary);
        cursor: pointer;
        transition: all var(--transition-fast);
        font-family: inherit;
        font-size: var(--font-size-sm);
      }
      .poll-btn:hover:not(.voted) {
        border-color: var(--primary);
        background: rgba(108,92,231,0.1);
      }
      .poll-btn.voted {
        border-color: var(--success);
        cursor: default;
      }
      .poll-pct { color: var(--text-muted); font-size: var(--font-size-xs); }
      .poll-bar {
        height: 4px;
        background: var(--bg-input);
        border-radius: 2px;
        margin-top: 4px;
        overflow: hidden;
      }
      .poll-bar-fill {
        height: 100%;
        background: var(--gradient-primary);
        border-radius: 2px;
        transition: width 0.6s ease;
      }
    </style>`;
}

function castVote(pollId, optionIndex) {
  const user = Store.getCurrentUser();
  Store.votePoll(pollId, optionIndex, user.id);
  showToast(`${t('voted')} 🗳️`);
  navigateTo('#/vibrant/notices');
}
