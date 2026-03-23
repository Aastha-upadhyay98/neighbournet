/* ============================================
   NeighbourNet — SPA Router & App Init
   ============================================ */

// ── Theme System ──
function getTheme() {
  return localStorage.getItem('nn_theme') || 'dark';
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('nn_theme', theme);
  // Update meta theme-color
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.content = theme === 'light' ? '#F5F3FF' : '#6C5CE7';
  }
}

function toggleTheme() {
  const current = getTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
  // Animate the toggle button
  const btn = document.getElementById('theme-toggle-btn');
  if (btn) {
    btn.style.transform = 'rotate(360deg) scale(0.8)';
    setTimeout(() => {
      btn.textContent = next === 'dark' ? '🌙' : '☀️';
      btn.style.transform = '';
    }, 200);
  }
}

// ── SPA Router ──
function navigateTo(hash) {
  window.location.hash = hash;
}

function switchLang(lang) {
  I18n.setLang(lang);
  router();
}

function handleLogout() {
  Store.logout();
  document.body.classList.remove('silver-mode');
  navigateTo('#/');
}

function router() {
  const hash = window.location.hash || '#/';
  const app = document.getElementById('app');
  const user = Store.getCurrentUser();

  // Auth guard
  const publicRoutes = ['#/', '#/login', '#/register'];
  if (!user && !publicRoutes.includes(hash)) {
    navigateTo('#/login');
    return;
  }

  // Toggle silver mode
  if (hash.startsWith('#/silver')) {
    document.body.classList.add('silver-mode');
  } else {
    document.body.classList.remove('silver-mode');
  }

  // Route mapping
  let content = '';
  switch (hash) {
    case '#/':
      content = renderLandingPage();
      break;
    case '#/register':
      content = renderRegisterPage();
      break;
    case '#/login':
      content = renderLoginPage();
      break;

    // Vibrant Dashboard
    case '#/vibrant':
      content = renderVibrantDashboard();
      break;
    case '#/vibrant/credits':
      content = renderCreditsPage();
      break;
    case '#/vibrant/market':
      content = renderMarketplacePage();
      break;
    case '#/vibrant/chat':
      content = renderChatPage();
      break;
    case '#/vibrant/skills':
      content = renderSkillsPage();
      break;
    case '#/vibrant/notices':
      content = renderNoticesPage();
      break;
    case '#/vibrant/events':
      content = renderEventsPage();
      break;

    // Silver Dashboard
    case '#/silver':
      content = renderSilverDashboard();
      break;
    case '#/silver/notices':
      content = renderSilverNoticesPage();
      break;
    case '#/silver/messages':
      content = renderSilverMessagesPage();
      break;
    case '#/silver/help':
      content = renderSilverHelpPage();
      break;

    // Shared
    case '#/emergency':
      content = renderEmergencyPage();
      break;

    default:
      content = renderLandingPage();
  }

  app.innerHTML = content;

  // Highlight active nav link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === hash);
  });

  // Scroll to top
  window.scrollTo(0, 0);
}

// ── Init ──
function initApp() {
  // Apply saved theme
  setTheme(getTheme());

  I18n.init();
  Store.seedIfEmpty();
  window.addEventListener('hashchange', router);
  router();
}

document.addEventListener('DOMContentLoaded', initApp);
