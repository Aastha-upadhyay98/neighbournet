/* ============================================
   NeighborNet — Skills Swap Page
   ============================================ */

function renderSkillsPage() {
  const user = Store.getCurrentUser();
  const skills = Store.getSkills();

  return `
    ${renderNavbar()}
    <div class="page-content page-enter">
      <div class="container">
        <div class="flex justify-between items-center" style="margin-bottom:var(--space-xl);">
          <h2 class="section-title" style="margin-bottom:0;">🤝 ${t('skillSwap')}</h2>
          <button class="btn btn-primary btn-sm" onclick="showAddSkillModal()">+ ${t('addSkill')}</button>
        </div>

        <div class="tabs" style="margin-bottom:var(--space-xl);">
          <button class="tab active" onclick="filterSkills(this,'all')">All</button>
          <button class="tab" onclick="filterSkills(this,'offer')">🎓 ${t('offering')}</button>
          <button class="tab" onclick="filterSkills(this,'seek')">🔍 ${t('seeking')}</button>
        </div>

        <div class="grid-3" id="skills-grid">
          ${skills.map(skill => {
            const owner = Store.getUserById(skill.userId);
            return `
              <div class="skill-card" data-skilltype="${skill.type}">
                <div class="flex justify-between items-center">
                  <span class="badge ${skill.type === 'offer' ? 'badge-success' : 'badge-warning'}">
                    ${skill.type === 'offer' ? '🎓 ' + t('offering') : '🔍 ' + t('seeking')}
                  </span>
                </div>
                <h3>${skill.skill}</h3>
                <p style="color:var(--text-secondary);font-size:var(--font-size-sm);">${skill.description}</p>
                <div class="flex items-center gap-sm" style="margin-top:auto;padding-top:var(--space-md);border-top:1px solid var(--border);">
                  ${owner ? avatarHTML(owner, 'avatar-sm') : ''}
                  <div>
                    <div style="font-size:var(--font-size-sm);font-weight:var(--font-weight-medium);">${owner?.name || 'Unknown'}</div>
                    <div style="font-size:var(--font-size-xs);color:var(--text-muted);">🏠 ${owner?.apartment || ''}</div>
                  </div>
                  ${owner?.id !== user.id ? `
                    <button class="btn btn-sm btn-secondary" style="margin-left:auto;" onclick="showToast('Message sent to ${owner?.name}!')">💬</button>
                  ` : ''}
                </div>
              </div>`;
          }).join('')}
        </div>
      </div>
      ${renderSOSButton()}
    </div>
    <div class="modal-overlay" id="modal-overlay"></div>`;
}

function showAddSkillModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">${t('addSkill')}</h2>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <form onsubmit="addNewSkill(event)" style="display:flex;flex-direction:column;gap:var(--space-lg);">
        <div class="input-group">
          <label>Skill Name</label>
          <input type="text" id="skill-name" class="input-field" placeholder="e.g. Guitar Lessons" required>
        </div>
        <div class="input-group">
          <label>Type</label>
          <select id="skill-type" class="input-field">
            <option value="offer">${t('iCanTeach')}</option>
            <option value="seek">${t('iNeedHelp')}</option>
          </select>
        </div>
        <div class="input-group">
          <label>${t('description')}</label>
          <textarea id="skill-desc" class="input-field" rows="3" placeholder="Describe what you can offer or need..." required></textarea>
        </div>
        <button type="submit" class="btn btn-primary">${t('addSkill')}</button>
      </form>
    </div>`;
  overlay.classList.add('active');
}

function addNewSkill(e) {
  e.preventDefault();
  const user = Store.getCurrentUser();
  Store.addSkill({
    userId: user.id,
    skill: document.getElementById('skill-name').value,
    type: document.getElementById('skill-type').value,
    description: document.getElementById('skill-desc').value
  });
  closeModal();
  Store.addCredits(user.id, 3, 'Added skill to Skill Swap');
  showToast('Skill added! +3 credits 🎉');
  navigateTo('#/vibrant/skills');
}

function filterSkills(tab, type) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  document.querySelectorAll('.skill-card').forEach(card => {
    if (type === 'all' || card.dataset.skilltype === type) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}
