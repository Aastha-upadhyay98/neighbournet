/* ============================================
   NeighbourNet — Vibrant Dashboard (Feed)
   ============================================ */

function renderVibrantDashboard() {
  const user = Store.getCurrentUser();
  const posts = Store.getPosts();
  const leaderboard = Store.getLeaderboard().slice(0, 5);
  const emergencies = Store.getEmergencies().filter(e => {
    const age = Date.now() - new Date(e.createdAt).getTime();
    return age < 3600000; // Last hour
  });
  const events = Store.getEvents()
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  // Simulated weather
  const weatherData = getWeatherData();

  return `
    ${renderNavbar()}
    <div class="page-content page-enter">
      <div class="container">
        <!-- Emergency Alerts -->
        ${emergencies.length > 0 ? `
          <div class="emergency-banner">
            ${emergencies.map(e => `
              <div class="alert-banner ${e.type === 'sos' ? 'alert-sos' : 'alert-minor'}">
                <span>${e.type === 'sos' ? '🚨' : '⚠️'} ${e.userName} (${e.apartment}): ${e.message}</span>
                <span class="alert-time">${timeAgo(e.createdAt)}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <div class="dashboard-layout">
          <!-- Main Feed -->
          <div class="feed-column">
            <h2 class="section-title">📢 ${t('whatsHappening')}</h2>

            <!-- Post Creator -->
            <div class="card post-creator" style="margin-bottom:var(--space-xl);">
              <div class="flex items-center gap-md" style="margin-bottom:var(--space-md);">
                ${avatarHTML(user)}
                <input type="text" id="post-input" class="input-field" placeholder="${t('sharePost')}" style="flex:1;">
              </div>
              <div class="flex justify-between items-center">
                <div class="flex gap-sm">
                  <button class="btn btn-sm post-cat-btn active" data-cat="general" onclick="setPostCat(this,'general')">📢 General</button>
                  <button class="btn btn-sm post-cat-btn" data-cat="lost-found" onclick="setPostCat(this,'lost-found')">🔑 ${t('lostFound')}</button>
                  <button class="btn btn-sm post-cat-btn" data-cat="club" onclick="setPostCat(this,'club')">👥 ${t('club')}</button>
                </div>
                <button class="btn btn-primary btn-sm" onclick="createPost()">${t('post')}</button>
              </div>
            </div>

            <!-- Filter Tabs -->
            <div class="tabs">
              <button class="tab active" onclick="filterFeed(this,'all')">${t('allPosts')}</button>
              <button class="tab" onclick="filterFeed(this,'announcement')">📋 ${t('announcement')}</button>
              <button class="tab" onclick="filterFeed(this,'lost-found')">🔑 ${t('lostFound')}</button>
              <button class="tab" onclick="filterFeed(this,'club')">👥 ${t('club')}</button>
              <button class="tab" onclick="filterFeed(this,'resource')">📦 ${t('resource')}</button>
            </div>

            <!-- Feed Items -->
            <div id="feed-list">
              ${posts.map(post => renderFeedItem(post)).join('')}
            </div>
          </div>

          <!-- Sidebar -->
          <div class="sidebar-column">
            <!-- Weather Widget -->
            <div class="weather-widget">
              <div class="weather-icon">${weatherData.icon}</div>
              <div class="weather-temp">${weatherData.temp}°C</div>
              <div class="weather-desc">${weatherData.desc}</div>
              <div style="font-size:var(--font-size-xs);color:var(--text-muted);margin-top:var(--space-xs);">
                💧 ${weatherData.humidity}% · 💨 ${weatherData.wind} km/h
              </div>
            </div>

            <!-- User Card -->
            <div class="card" style="margin-bottom:var(--space-lg);">
              <div class="flex items-center gap-md" style="margin-bottom:var(--space-md);">
                ${avatarHTML(user, 'avatar-lg')}
                <div>
                  <h3>${user.name}</h3>
                  <p style="color:var(--text-muted);font-size:var(--font-size-sm);">🏠 ${user.apartment}</p>
                </div>
              </div>
              <div class="stat-card" style="text-align:center;">
                <div class="stat-value">${user.credits || 0}</div>
                <div class="stat-label">⭐ ${t('communityKarma')}</div>
              </div>
            </div>

            <!-- Upcoming Events Preview -->
            ${events.length > 0 ? `
              <div class="card" style="margin-bottom:var(--space-lg);">
                <h3 style="margin-bottom:var(--space-md);">📅 ${t('upcomingEvents')}</h3>
                ${events.map(ev => {
                  const d = new Date(ev.date);
                  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                  return `
                    <div style="display:flex;align-items:center;gap:var(--space-md);padding:var(--space-sm) 0;border-bottom:1px solid var(--border);">
                      <div style="background:var(--gradient-primary);color:white;border-radius:var(--radius-sm);padding:4px 8px;text-align:center;min-width:40px;">
                        <div style="font-size:var(--font-size-lg);font-weight:var(--font-weight-bold);line-height:1;">${d.getDate()}</div>
                        <div style="font-size:10px;">${months[d.getMonth()]}</div>
                      </div>
                      <div style="flex:1;">
                        <div style="font-size:var(--font-size-sm);font-weight:var(--font-weight-medium);">${ev.title}</div>
                        <div style="font-size:var(--font-size-xs);color:var(--text-muted);">🕐 ${ev.time} · 👥 ${ev.attendees?.length || 0}</div>
                      </div>
                    </div>`;
                }).join('')}
                <a href="#/vibrant/events" class="btn btn-sm btn-secondary" style="width:100%;margin-top:var(--space-md);">
                  ${t('events')} →
                </a>
              </div>
            ` : ''}

            <!-- Leaderboard Preview -->
            <div class="card">
              <h3 style="margin-bottom:var(--space-md);">🏆 ${t('leaderboard')}</h3>
              ${leaderboard.map((u, i) => `
                <div class="leaderboard-item">
                  <span class="leaderboard-rank ${i<3 ? 'rank-'+(i+1) : ''}" style="${i>=3?'background:var(--bg-card);color:var(--text-muted);':''}">
                    ${i + 1}
                  </span>
                  ${avatarHTML(u, 'avatar-sm')}
                  <div>
                    <div style="font-weight:var(--font-weight-medium);font-size:var(--font-size-sm);">${u.name}</div>
                    <div style="font-size:var(--font-size-xs);color:var(--text-muted);">${u.apartment}</div>
                  </div>
                  <span class="leaderboard-credits">${u.credits}⭐</span>
                </div>
              `).join('')}
              <a href="#/vibrant/credits" class="btn btn-sm btn-secondary" style="width:100%;margin-top:var(--space-md);">
                ${t('creditHistory')} →
              </a>
            </div>

            <!-- Quick Links -->
            <div class="card" style="margin-top:var(--space-lg);">
              <h3 style="margin-bottom:var(--space-md);">⚡ Quick Actions</h3>
              <div style="display:flex;flex-direction:column;gap:var(--space-sm);">
                <a href="#/vibrant/market" class="quick-link">🛒 ${t('resourceSharing')}</a>
                <a href="#/vibrant/skills" class="quick-link">🤝 ${t('skillSwap')}</a>
                <a href="#/vibrant/notices" class="quick-link">📋 ${t('noticeBoard')}</a>
                <a href="#/vibrant/chat" class="quick-link">💬 ${t('chatHub')}</a>
                <a href="#/vibrant/events" class="quick-link">📅 ${t('communityEvents')}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      ${renderSOSButton()}
    </div>
    <div class="modal-overlay" id="modal-overlay"></div>

    <style>
      .dashboard-layout {
        display: grid;
        grid-template-columns: 1fr 340px;
        gap: var(--space-xl);
        align-items: start;
      }
      @media (max-width: 900px) {
        .dashboard-layout { grid-template-columns: 1fr; }
        .sidebar-column { order: -1; }
      }
      .post-cat-btn {
        background: var(--bg-input);
        color: var(--text-muted);
        font-size: var(--font-size-xs);
      }
      .post-cat-btn.active {
        background: rgba(108,92,231,0.2);
        color: var(--primary-light);
      }
      .quick-link {
        display: block;
        padding: 10px 14px;
        border-radius: var(--radius-md);
        color: var(--text-secondary);
        font-size: var(--font-size-sm);
        transition: all var(--transition-fast);
      }
      .quick-link:hover {
        background: rgba(108,92,231,0.1);
        color: var(--primary-light);
      }
      .alert-banner {
        padding: 12px var(--space-lg);
        border-radius: var(--radius-md);
        margin-bottom: var(--space-md);
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: var(--font-size-sm);
      }
      .alert-sos {
        background: rgba(231,76,60,0.15);
        border: 1px solid rgba(231,76,60,0.3);
        color: var(--danger-light);
      }
      .alert-minor {
        background: rgba(253,203,110,0.1);
        border: 1px solid rgba(253,203,110,0.2);
        color: var(--warning);
      }
      .alert-time { font-size: var(--font-size-xs); color: var(--text-muted); }
    </style>`;
}

// ── Weather Data (Simulated) ──
function getWeatherData() {
  const hour = new Date().getHours();
  const weathers = [
    { icon: '☀️', temp: 32, desc: 'Sunny & Clear', humidity: 45, wind: 12 },
    { icon: '⛅', temp: 29, desc: 'Partly Cloudy', humidity: 55, wind: 15 },
    { icon: '🌤️', temp: 30, desc: 'Warm & Pleasant', humidity: 50, wind: 10 },
    { icon: '🌙', temp: 24, desc: 'Clear Night', humidity: 60, wind: 8 },
  ];
  if (hour >= 6 && hour < 12) return weathers[2];
  if (hour >= 12 && hour < 17) return weathers[0];
  if (hour >= 17 && hour < 20) return weathers[1];
  return weathers[3];
}

function renderFeedItem(post) {
  const author = Store.getUserById(post.authorId);
  if (!author) return '';
  const catBadge = {
    'announcement': `<span class="badge badge-primary">${t('announcement')}</span>`,
    'lost-found': `<span class="badge badge-warning">${t('lostFound')}</span>`,
    'club': `<span class="badge badge-success">${t('club')}</span>`,
    'resource': `<span class="badge badge-primary">${t('resource')}</span>`,
  };

  return `
    <div class="feed-item" data-category="${post.category || 'general'}">
      <div class="feed-item-header">
        ${avatarHTML(author)}
        <div class="feed-item-meta">
          <span class="name">${author.name} <span style="color:var(--text-muted);font-size:var(--font-size-xs);">🏠 ${author.apartment}</span></span>
          <span class="time">${timeAgo(post.createdAt)} ${catBadge[post.category] || ''}</span>
        </div>
      </div>
      <div class="feed-item-content">${post.content}</div>
      <div class="feed-item-actions">
        <button class="feed-action" onclick="likePost('${post.id}', this)">❤️ ${t('like')} <span>(${post.likes || 0})</span></button>
        <button class="feed-action" onclick="showToast('Coming soon!')">💬 ${t('comment')}</button>
        <button class="feed-action" onclick="showToast('Coming soon!')">↗️ Share</button>
      </div>
    </div>`;
}

let currentPostCat = 'general';
function setPostCat(btn, cat) {
  document.querySelectorAll('.post-cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentPostCat = cat;
}

function createPost() {
  const input = document.getElementById('post-input');
  const content = input.value.trim();
  if (!content) return;
  const user = Store.getCurrentUser();
  Store.addPost({
    authorId: user.id,
    content,
    category: currentPostCat
  });
  input.value = '';
  navigateTo('#/vibrant');
}

function likePost(postId, btn) {
  Store.likePost(postId);
  const count = btn.querySelector('span');
  const current = parseInt(count.textContent.replace(/[()]/g, ''));
  count.textContent = `(${current + 1})`;
}

function filterFeed(tab, category) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  document.querySelectorAll('.feed-item').forEach(item => {
    if (category === 'all' || item.dataset.category === category) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  });
}
