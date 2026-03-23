/* ============================================
   NeighborNet — Marketplace Page
   ============================================ */

function renderMarketplacePage() {
  const user = Store.getCurrentUser();
  const items = Store.getMarketItems();

  return `
    ${renderNavbar()}
    <div class="page-content page-enter">
      <div class="container">
        <div class="flex justify-between items-center" style="margin-bottom:var(--space-xl);">
          <h2 class="section-title" style="margin-bottom:0;">🛒 ${t('resourceSharing')}</h2>
          <button class="btn btn-primary btn-sm" onclick="showAddItemModal()">+ ${t('addItem')}</button>
        </div>

        <!-- Filter Tabs -->
        <div class="tabs">
          <button class="tab active" onclick="filterMarket(this,'all')">All</button>
          <button class="tab" onclick="filterMarket(this,'lend')">🔧 ${t('lend')}</button>
          <button class="tab" onclick="filterMarket(this,'share')">📦 ${t('share')}</button>
          <button class="tab" onclick="filterMarket(this,'carpool')">🚗 ${t('carpool')}</button>
        </div>

        <!-- Items Grid -->
        <div class="grid-3" id="market-grid">
          ${items.map(item => {
            const owner = Store.getUserById(item.userId);
            const typeIcons = { lend: '🔧', share: '📦', carpool: '🚗', borrow: '🤲' };
            return `
              <div class="card market-card" data-type="${item.type}">
                <div class="flex justify-between items-center" style="margin-bottom:var(--space-md);">
                  <span class="badge badge-primary">${typeIcons[item.type] || '📦'} ${item.type}</span>
                  <span class="badge ${item.available ? 'badge-success' : 'badge-warning'}">${item.available ? t('available') : t('borrowed')}</span>
                </div>
                <h3 style="margin-bottom:var(--space-sm);">${item.title}</h3>
                <p style="color:var(--text-secondary);font-size:var(--font-size-sm);margin-bottom:var(--space-md);">${item.description}</p>
                <div class="flex items-center gap-sm" style="margin-bottom:var(--space-md);">
                  ${owner ? avatarHTML(owner, 'avatar-sm') : ''}
                  <span style="font-size:var(--font-size-sm);color:var(--text-muted);">${owner?.name || 'Unknown'} · ${owner?.apartment || ''}</span>
                </div>
                ${item.available && owner?.id !== user.id ? `
                  <button class="btn btn-secondary btn-sm" style="width:100%;" onclick="requestMarketItem('${item.id}')">
                    🤝 ${t('requestItem')}
                  </button>
                ` : ''}
              </div>`;
          }).join('')}
        </div>

        ${items.length === 0 ? `
          <div class="text-center" style="padding:var(--space-3xl);color:var(--text-muted);">
            <div style="font-size:64px;margin-bottom:var(--space-lg);">🛒</div>
            <p>No items yet. Be the first to share!</p>
          </div>
        ` : ''}
      </div>
      ${renderSOSButton()}
    </div>
    <div class="modal-overlay" id="modal-overlay"></div>`;
}

function showAddItemModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">${t('addItem')}</h2>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <form onsubmit="addMarketItem(event)" style="display:flex;flex-direction:column;gap:var(--space-lg);">
        <div class="input-group">
          <label>${t('itemTitle')}</label>
          <input type="text" id="item-title" class="input-field" placeholder="e.g. Electric Drill" required>
        </div>
        <div class="input-group">
          <label>Type</label>
          <select id="item-type" class="input-field">
            <option value="lend">🔧 ${t('lend')}</option>
            <option value="share">📦 ${t('share')}</option>
            <option value="carpool">🚗 ${t('carpool')}</option>
          </select>
        </div>
        <div class="input-group">
          <label>${t('description')}</label>
          <textarea id="item-desc" class="input-field" rows="3" placeholder="Describe the item..." required></textarea>
        </div>
        <button type="submit" class="btn btn-primary">${t('addItem')}</button>
      </form>
    </div>`;
  overlay.classList.add('active');
}

function addMarketItem(e) {
  e.preventDefault();
  const user = Store.getCurrentUser();
  Store.addMarketItem({
    userId: user.id,
    title: document.getElementById('item-title').value,
    type: document.getElementById('item-type').value,
    description: document.getElementById('item-desc').value
  });
  closeModal();
  Store.addCredits(user.id, 5, 'Listed item on marketplace');
  showToast('Item added! +5 credits 🎉');
  navigateTo('#/vibrant/market');
}

function requestMarketItem(itemId) {
  showToast('Request sent to owner! 📩');
}

function filterMarket(tab, type) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  document.querySelectorAll('.market-card').forEach(card => {
    if (type === 'all' || card.dataset.type === type) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}
