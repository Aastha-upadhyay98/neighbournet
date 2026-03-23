/* ============================================
   NeighborNet — Silver Notices (Senior View)
   ============================================ */

function renderSilverNoticesPage() {
  const notices = Store.getNotices();

  return `
    <div class="page-content page-enter" style="padding-top:var(--space-xl);">
      <div class="container" style="max-width:700px;">
        <button class="btn btn-secondary" onclick="navigateTo('#/silver')" style="margin-bottom:var(--space-lg);">
          ← ${t('back')}
        </button>

        <h1 class="section-title" style="font-size:1.6rem;">📋 ${t('noticeBoard')}</h1>

        ${notices.map(notice => `
          <div class="card" style="margin-bottom:var(--space-lg);border-left:4px solid ${notice.priority === 'high' ? 'var(--danger)' : 'var(--primary)'};">
            <div class="flex justify-between items-center" style="margin-bottom:var(--space-md);">
              <h2 style="font-size:1.3rem;">${notice.title}</h2>
              ${notice.priority === 'high' ? `<span class="badge badge-danger" style="font-size:0.9rem;padding:6px 12px;">🔴 ${t('high')}</span>` : ''}
            </div>
            <p style="color:var(--text-secondary);font-size:1.1rem;line-height:1.8;margin-bottom:var(--space-md);">${notice.content}</p>
            <div style="font-size:0.9rem;color:var(--text-muted);">
              📝 ${notice.author}
            </div>
          </div>
        `).join('')}

        ${notices.length === 0 ? `
          <div class="card text-center" style="padding:var(--space-3xl);">
            <div style="font-size:48px;margin-bottom:var(--space-lg);">📋</div>
            <p style="font-size:1.1rem;color:var(--text-muted);">No notices at this time.</p>
          </div>
        ` : ''}
      </div>

      ${renderSOSButton()}
      ${renderSilverNav()}
    </div>
    <div class="modal-overlay" id="modal-overlay"></div>`;
}
