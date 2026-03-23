/* ============================================
   NeighborNet — Login Page
   ============================================ */

function renderLoginPage() {
  return `
    <div class="auth-page page-enter">
      <div class="auth-container">
        <div class="auth-card card-glass">
          <div class="auth-header">
            <span style="font-size:48px;">🔐</span>
            <h1>${t('loginBtn')}</h1>
            <p style="color:var(--text-secondary);">${t('tagline')}</p>
          </div>
          <form class="auth-form" onsubmit="handleLogin(event)">
            <div class="input-group">
              <label for="login-apt">${t('apartmentNo')}</label>
              <input type="text" id="login-apt" class="input-field" placeholder="e.g. A-101" required>
            </div>
            <div class="input-group">
              <label for="login-pass">${t('password')}</label>
              <input type="password" id="login-pass" class="input-field" placeholder="••••••••" required>
            </div>
            <button type="submit" class="btn btn-primary btn-lg" style="width:100%;">
              ${t('loginBtn')}
            </button>
          </form>
          <p class="auth-footer">
            ${t('noAccount')} <a href="#/register">${t('register')}</a>
          </p>
          <div style="margin-top:var(--space-xl);padding-top:var(--space-lg);border-top:1px solid var(--border);">
            <p style="color:var(--text-muted);font-size:var(--font-size-sm);text-align:center;margin-bottom:var(--space-md);">Demo accounts (password: 1234)</p>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-sm);">
              <button class="btn btn-sm" style="background:var(--bg-card);" onclick="demoLogin('A-101')">🧑 A-101 (Aarav)</button>
              <button class="btn btn-sm" style="background:var(--bg-card);" onclick="demoLogin('B-204')">🧑 B-204 (Priya)</button>
              <button class="btn btn-sm" style="background:var(--bg-card);" onclick="demoLogin('B-101')">🧓 B-101 (Ramesh)</button>
              <button class="btn btn-sm" style="background:var(--bg-card);" onclick="demoLogin('A-202')">🧓 A-202 (Sunita)</button>
            </div>
          </div>
        </div>
      </div>
    </div>`;
}

function handleLogin(e) {
  e.preventDefault();
  const apartment = document.getElementById('login-apt').value.trim().toUpperCase();
  const password = document.getElementById('login-pass').value;

  const user = Store.findUser(apartment, password);
  if (!user) {
    showToast('Invalid apartment or password');
    return;
  }

  Store.setCurrentUser(user);
  showToast(`${t('welcome')}, ${user.name}! 🎉`);

  if (user.type === 'senior') {
    navigateTo('#/silver');
  } else {
    navigateTo('#/vibrant');
  }
}

function demoLogin(apartment) {
  const user = Store.getUsers().find(u => u.apartment === apartment);
  if (user) {
    Store.setCurrentUser(user);
    showToast(`${t('welcome')}, ${user.name}! 🎉`);
    navigateTo(user.type === 'senior' ? '#/silver' : '#/vibrant');
  }
}
