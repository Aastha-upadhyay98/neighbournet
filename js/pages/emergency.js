/* ============================================
   NeighborNet — Emergency & Healthcare Module
   ============================================ */

function renderEmergencyPage() {
  const user = Store.getCurrentUser();
  const isSilver = user?.type === 'senior';

  // Demo local lifeline directory (Mumbai/Pune area)
  const hospitals = [
    { name: 'Lilavati Hospital', address: 'Bandra Reclamation, Mumbai', phone: '022-2675-1000', distance: '2.3 km' },
    { name: 'Kokilaben Hospital', address: 'Andheri West, Mumbai', phone: '022-3066-6666', distance: '4.1 km' },
    { name: 'Jupiter Hospital', address: 'Thane West', phone: '022-2172-5555', distance: '5.8 km' },
    { name: 'Fortis Hospital', address: 'Mulund, Mumbai', phone: '022-6848-4444', distance: '7.2 km' },
  ];

  const pharmacies = [
    { name: 'MedPlus 24/7', address: 'Shop 4, Ground Floor, Near Gate', phone: '022-4888-1234', hours: '24 Hours' },
    { name: 'Apollo Pharmacy', address: 'Main Road, 500m from building', phone: '022-4999-5678', hours: '8 AM - 11 PM' },
    { name: 'Wellness Forever', address: 'Junction Road, 1.2 km', phone: '022-4777-9012', hours: '24 Hours' },
  ];

  const emergencyNumbers = [
    { name: 'Ambulance (National)', number: '108', icon: '🚑' },
    { name: 'Police', number: '100', icon: '🚔' },
    { name: 'Fire Brigade', number: '101', icon: '🚒' },
    { name: 'Women Helpline', number: '1091', icon: '👩' },
    { name: 'Building Security', number: '022-1234-5678', icon: '🏢' },
  ];

  return `
    ${!isSilver ? renderNavbar() : ''}
    <div class="page-content page-enter" style="${isSilver ? 'padding-top:var(--space-xl);' : ''}">
      <div class="container" style="max-width:900px;">
        ${isSilver ? `
          <button class="btn btn-secondary" onclick="navigateTo('#/silver')" style="margin-bottom:var(--space-lg);">
            ← ${t('back')}
          </button>
        ` : ''}

        <h2 class="section-title" style="${isSilver ? 'font-size:1.6rem;' : ''}">🏥 ${t('localLifeline')}</h2>
        <p class="section-subtitle" style="${isSilver ? 'font-size:1.1rem;' : ''}">
          Emergency contacts and nearby medical facilities for your building.
        </p>

        <!-- Emergency Numbers -->
        <div class="card" style="margin-bottom:var(--space-xl);border-color:rgba(231,76,60,0.3);">
          <h3 style="margin-bottom:var(--space-lg);color:var(--danger-light);${isSilver ? 'font-size:1.3rem;' : ''}">
            📱 Emergency Numbers
          </h3>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:var(--space-md);">
            ${emergencyNumbers.map(num => `
              <a href="tel:${num.number}" class="emergency-num-card">
                <span style="font-size:${isSilver ? '32px' : '24px'};">${num.icon}</span>
                <div>
                  <div style="font-weight:var(--font-weight-semibold);${isSilver ? 'font-size:1.1rem;' : ''}">${num.name}</div>
                  <div style="color:var(--danger-light);font-weight:var(--font-weight-bold);font-size:${isSilver ? '1.2rem' : 'var(--font-size-lg)'};">${num.number}</div>
                </div>
              </a>
            `).join('')}
          </div>
        </div>

        <!-- Hospitals -->
        <div class="card" style="margin-bottom:var(--space-xl);">
          <h3 style="margin-bottom:var(--space-lg);${isSilver ? 'font-size:1.3rem;' : ''}">🏥 ${t('hospitals')}</h3>
          ${hospitals.map(h => `
            <div class="lifeline-item">
              <div style="flex:1;">
                <div style="font-weight:var(--font-weight-semibold);${isSilver ? 'font-size:1.1rem;' : ''}">${h.name}</div>
                <div style="color:var(--text-muted);font-size:${isSilver ? '0.95rem' : 'var(--font-size-sm)'};">${h.address}</div>
              </div>
              <div style="text-align:right;">
                <a href="tel:${h.phone}" class="btn btn-sm" style="background:var(--success);color:white;${isSilver ? 'padding:12px 20px;font-size:1rem;' : ''}">
                  📞 ${h.phone}
                </a>
                <div style="color:var(--text-muted);font-size:var(--font-size-xs);margin-top:4px;">📍 ${h.distance}</div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Pharmacies -->
        <div class="card" style="margin-bottom:var(--space-xl);">
          <h3 style="margin-bottom:var(--space-lg);${isSilver ? 'font-size:1.3rem;' : ''}">💊 ${t('pharmacies')}</h3>
          ${pharmacies.map(p => `
            <div class="lifeline-item">
              <div style="flex:1;">
                <div style="font-weight:var(--font-weight-semibold);${isSilver ? 'font-size:1.1rem;' : ''}">${p.name}</div>
                <div style="color:var(--text-muted);font-size:${isSilver ? '0.95rem' : 'var(--font-size-sm)'};">${p.address}</div>
              </div>
              <div style="text-align:right;">
                <a href="tel:${p.phone}" class="btn btn-sm" style="background:var(--success);color:white;${isSilver ? 'padding:12px 20px;font-size:1rem;' : ''}">
                  📞 Call
                </a>
                <div style="color:var(--info);font-size:var(--font-size-xs);margin-top:4px;">🕐 ${p.hours}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      ${renderSOSButton()}
      ${isSilver ? renderSilverNav() : ''}
    </div>
    <div class="modal-overlay" id="modal-overlay"></div>

    <style>
      .emergency-num-card {
        display: flex;
        align-items: center;
        gap: var(--space-md);
        padding: var(--space-md);
        background: var(--bg-card);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        transition: all var(--transition-fast);
        color: var(--text-primary);
      }
      .emergency-num-card:hover {
        border-color: var(--danger);
        background: rgba(231,76,60,0.1);
        color: var(--text-primary);
      }
      .lifeline-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--space-md) 0;
        border-bottom: 1px solid var(--border);
        gap: var(--space-md);
      }
      .lifeline-item:last-child { border-bottom: none; }
    </style>`;
}
