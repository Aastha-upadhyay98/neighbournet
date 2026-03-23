/* ============================================
   NeighbourNet — Landing Page
   ============================================ */

function renderLandingPage() {
  const themeIcon = getTheme() === 'dark' ? '🌙' : '☀️';
  return `
    <div class="landing-page page-enter">
      <!-- Theme Toggle (Landing) -->
      <button class="theme-toggle" id="theme-toggle-btn" onclick="toggleTheme()"
        style="position:fixed;top:20px;right:20px;z-index:100;"
        title="${t('toggleTheme')}">
        ${themeIcon}
      </button>

      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-bg"></div>
        <div class="hero-particles" id="particles"></div>
        <div class="container hero-content">
          <div class="hero-badge">${t('greeting')} 🙏</div>
          <h1 class="hero-title">${t('heroTitle')}</h1>
          <p class="hero-subtitle">${t('heroSubtitle')}</p>
          <div class="hero-actions">
            <button class="btn btn-primary btn-lg" onclick="navigateTo('#/register')">
              🏠 ${t('joinBuilding')}
            </button>
            <button class="btn btn-secondary btn-lg" onclick="navigateTo('#/login')">
              ${t('alreadyMember')}
            </button>
          </div>
          <div class="hero-building">
            <div class="building-illustration">
              <div class="building-body">
                <div class="building-windows">
                  ${Array.from({length: 24}, (_, i) => `
                    <div class="window ${Math.random()>0.4?'lit':''}" style="animation-delay:${Math.random()*3}s">
                      ${Math.random()>0.7 ? '<span class="window-emoji">' + ['👤','👨‍💻','🧓','👩‍🍳','📖','🎸'][Math.floor(Math.random()*6)] + '</span>' : ''}
                    </div>
                  `).join('')}
                </div>
              </div>
              <div class="building-base"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-section">
        <div class="container">
          <h2 class="section-title" style="justify-content:center;">${t('appName')} — Digital Chowk 🏘️</h2>
          <div class="grid-3 features-grid">
            <div class="feature-card card-glass">
              <div class="feature-icon">🤝</div>
              <h3>${t('feature1Title')}</h3>
              <p>${t('feature1Desc')}</p>
            </div>
            <div class="feature-card card-glass">
              <div class="feature-icon">🛡️</div>
              <h3>${t('feature2Title')}</h3>
              <p>${t('feature2Desc')}</p>
            </div>
            <div class="feature-card card-glass">
              <div class="feature-icon">⭐</div>
              <h3>${t('feature3Title')}</h3>
              <p>${t('feature3Desc')}</p>
            </div>
          </div>

          <!-- Extra Feature: Voice & Events -->
          <div class="grid-2" style="margin-top:var(--space-2xl);max-width:800px;margin-left:auto;margin-right:auto;">
            <div class="feature-card card-glass">
              <div class="feature-icon">🎤</div>
              <h3>${t('voiceCommand')}</h3>
              <p>Senior citizens can use voice commands — just speak to navigate, send messages, and request help.</p>
            </div>
            <div class="feature-card card-glass">
              <div class="feature-icon">📅</div>
              <h3>${t('communityEvents')}</h3>
              <p>Organize celebrations, yoga sessions, and workshops. RSVP and see who's attending!</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Language Preview -->
      <section class="lang-preview-section">
        <div class="container text-center">
          <p style="color:var(--text-muted);margin-bottom:var(--space-md);">Available in</p>
          <div class="lang-selector" style="justify-content:center;display:inline-flex;">
            <button class="lang-btn ${I18n.currentLang==='en'?'active':''}" onclick="switchLang('en')">English</button>
            <button class="lang-btn ${I18n.currentLang==='hi'?'active':''}" onclick="switchLang('hi')">हिंदी</button>
            <button class="lang-btn ${I18n.currentLang==='mr'?'active':''}" onclick="switchLang('mr')">मराठी</button>
          </div>
        </div>
      </section>
    </div>

    <style>
      .landing-page { background: var(--bg-primary); }

      .hero {
        position: relative;
        min-height: 100vh;
        display: flex;
        align-items: center;
        overflow: hidden;
        padding: var(--space-3xl) 0;
      }
      .hero-bg {
        position: absolute;
        inset: 0;
        background: var(--gradient-hero);
        z-index: 0;
      }
      .hero-bg::after {
        content: '';
        position: absolute;
        top: -50%;
        right: -20%;
        width: 600px;
        height: 600px;
        background: radial-gradient(circle, rgba(108,92,231,0.15) 0%, transparent 70%);
        border-radius: 50%;
        animation: float 6s ease-in-out infinite;
      }
      .hero-bg::before {
        content: '';
        position: absolute;
        bottom: -30%;
        left: -10%;
        width: 400px;
        height: 400px;
        background: radial-gradient(circle, rgba(0,206,201,0.1) 0%, transparent 70%);
        border-radius: 50%;
        animation: float 8s ease-in-out infinite reverse;
      }
      @keyframes float {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-30px) rotate(5deg); }
      }
      .hero-content {
        position: relative;
        z-index: 1;
        text-align: center;
      }
      .hero-badge {
        display: inline-block;
        background: rgba(108,92,231,0.15);
        border: 1px solid rgba(108,92,231,0.3);
        border-radius: var(--radius-xl);
        padding: 8px 20px;
        font-size: var(--font-size-md);
        margin-bottom: var(--space-xl);
        animation: pageIn 0.6s ease;
      }
      .hero-title {
        font-size: clamp(2rem, 5vw, var(--font-size-5xl));
        font-weight: var(--font-weight-bold);
        line-height: 1.2;
        margin-bottom: var(--space-lg);
        background: linear-gradient(135deg, var(--text-primary) 0%, #A29BFE 50%, #00CEC9 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: pageIn 0.6s ease 0.1s both;
      }
      .hero-subtitle {
        font-size: var(--font-size-xl);
        color: var(--text-secondary);
        max-width: 600px;
        margin: 0 auto var(--space-2xl);
        animation: pageIn 0.6s ease 0.2s both;
      }
      .hero-actions {
        display: flex;
        gap: var(--space-md);
        justify-content: center;
        flex-wrap: wrap;
        animation: pageIn 0.6s ease 0.3s both;
      }

      /* Building Illustration */
      .hero-building {
        margin-top: var(--space-3xl);
        animation: pageIn 0.8s ease 0.5s both;
      }
      .building-illustration {
        max-width: 360px;
        margin: 0 auto;
      }
      .building-body {
        background: linear-gradient(180deg, var(--bg-card) 0%, var(--bg-secondary) 100%);
        border-radius: var(--radius-lg) var(--radius-lg) 0 0;
        padding: var(--space-lg);
        border: 1px solid var(--border);
        border-bottom: none;
      }
      .building-windows {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 8px;
      }
      .window {
        aspect-ratio: 1;
        background: rgba(0,0,0,0.3);
        border-radius: 4px;
        border: 1px solid var(--border);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        transition: all 0.5s;
      }
      [data-theme="light"] .window {
        background: rgba(108,92,231,0.08);
      }
      .window.lit {
        background: rgba(253,203,110,0.3);
        border-color: rgba(253,203,110,0.3);
        animation: windowGlow 4s ease-in-out infinite;
      }
      [data-theme="light"] .window.lit {
        background: rgba(253,203,110,0.4);
        border-color: rgba(253,203,110,0.5);
      }
      @keyframes windowGlow {
        0%, 100% { background: rgba(253,203,110,0.2); }
        50% { background: rgba(253,203,110,0.4); }
      }
      .window-emoji { font-size: 14px; }
      .building-base {
        height: 12px;
        background: var(--gradient-primary);
        border-radius: 0 0 var(--radius-md) var(--radius-md);
      }

      /* Features */
      .features-section {
        padding: var(--space-3xl) 0;
      }
      .feature-card {
        text-align: center;
        padding: var(--space-2xl);
        transition: all var(--transition-base);
      }
      .feature-card:hover {
        transform: translateY(-8px);
        box-shadow: var(--shadow-glow);
      }
      .feature-icon {
        font-size: 48px;
        margin-bottom: var(--space-lg);
      }
      .feature-card h3 {
        font-size: var(--font-size-xl);
        margin-bottom: var(--space-sm);
      }
      .feature-card p {
        color: var(--text-secondary);
        font-size: var(--font-size-md);
      }

      /* Lang Preview */
      .lang-preview-section {
        padding: var(--space-2xl) 0 var(--space-3xl);
      }

      @media (max-width: 768px) {
        .features-grid { grid-template-columns: 1fr; }
        .building-windows { grid-template-columns: repeat(4, 1fr); }
      }
    </style>`;
}
