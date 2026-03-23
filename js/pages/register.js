/* ============================================
   NeighborNet — Register Page
   ============================================ */

function renderRegisterPage() {
  return `
    <div class="auth-page page-enter">
      <div class="auth-container">
        <div class="auth-card card-glass">
          <div class="auth-header">
            <span style="font-size:48px;">🏠</span>
            <h1>${t('joinBuilding')}</h1>
            <p style="color:var(--text-secondary);">${t('tagline')}</p>
          </div>
          <form class="auth-form" onsubmit="handleRegister(event)">
            <div class="input-group">
              <label for="reg-name">${t('fullName')}</label>
              <input type="text" id="reg-name" class="input-field" placeholder="e.g. Aarav Sharma" required>
            </div>
            <div class="input-group">
              <label for="reg-apt">${t('apartmentNo')}</label>
              <input type="text" id="reg-apt" class="input-field" placeholder="e.g. A-101" required>
            </div>
            <div class="input-group">
              <label for="reg-invite">${t('inviteCode')}</label>
              <input type="text" id="reg-invite" class="input-field" placeholder="e.g. BLDG2024" required>
            </div>
            <div class="input-group">
              <label for="reg-pass">${t('password')}</label>
              <input type="password" id="reg-pass" class="input-field" placeholder="••••••••" required>
            </div>
            <div class="input-group">
              <label>${t('ageGroup')}</label>
              <div class="age-group-selector">
                <label class="age-option">
                  <input type="radio" name="type" value="youngster" checked>
                  <span class="age-option-card">
                    <span style="font-size:28px;">🧑</span>
                    <span>${t('youngster')}</span>
                  </span>
                </label>
                <label class="age-option">
                  <input type="radio" name="type" value="senior">
                  <span class="age-option-card">
                    <span style="font-size:28px;">🧓</span>
                    <span>${t('senior')}</span>
                  </span>
                </label>
              </div>
            </div>
            <button type="submit" class="btn btn-primary btn-lg" style="width:100%;">
              ${t('registerBtn')}
            </button>
          </form>
          <p class="auth-footer">
            ${t('hasAccount')} <a href="#/login">${t('login')}</a>
          </p>
        </div>
      </div>
    </div>

    <style>
      .auth-page {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--space-2xl);
        background: var(--gradient-hero);
      }
      .auth-container { width: 100%; max-width: 480px; }
      .auth-card { padding: var(--space-2xl); }
      .auth-header {
        text-align: center;
        margin-bottom: var(--space-2xl);
      }
      .auth-header h1 {
        font-size: var(--font-size-2xl);
        margin-top: var(--space-md);
      }
      .auth-form {
        display: flex;
        flex-direction: column;
        gap: var(--space-lg);
      }
      .age-group-selector {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-md);
      }
      .age-option input { display: none; }
      .age-option-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--space-sm);
        padding: var(--space-lg);
        background: var(--bg-card);
        border: 2px solid var(--border);
        border-radius: var(--radius-lg);
        cursor: pointer;
        transition: all var(--transition-base);
        font-weight: var(--font-weight-medium);
      }
      .age-option input:checked + .age-option-card {
        border-color: var(--primary);
        background: rgba(108,92,231,0.15);
        box-shadow: var(--shadow-glow);
      }
      .auth-footer {
        text-align: center;
        margin-top: var(--space-xl);
        color: var(--text-muted);
      }
    </style>`;
}

function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById('reg-name').value.trim();
  const apartment = document.getElementById('reg-apt').value.trim().toUpperCase();
  const invite = document.getElementById('reg-invite').value.trim();
  const password = document.getElementById('reg-pass').value;
  const type = document.querySelector('input[name="type"]:checked').value;

  if (!name || !apartment || !password) {
    showToast('Please fill all fields');
    return;
  }

  // Check duplicate apartment
  const existing = Store.getUsers().find(u => u.apartment === apartment);
  if (existing) {
    showToast('This apartment is already registered');
    return;
  }

  const colors = ['#6C5CE7', '#00CEC9', '#FD79A8', '#FDCB6E', '#E17055', '#00B894', '#74B9FF', '#A29BFE'];
  const user = Store.addUser({
    name,
    apartment,
    password,
    type,
    color: colors[Math.floor(Math.random() * colors.length)]
  });

  Store.setCurrentUser(user);
  showToast(`${t('welcome')}, ${name}! 🎉`);

  if (type === 'senior') {
    navigateTo('#/silver');
  } else {
    navigateTo('#/vibrant');
  }
}
