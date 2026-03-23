/* ============================================
   NeighborNet — Data Store (localStorage)
   ============================================ */

const Store = {
  // ── Core Helpers ──
  get(key) {
    try {
      return JSON.parse(localStorage.getItem(`nn_${key}`));
    } catch { return null; }
  },

  set(key, value) {
    localStorage.setItem(`nn_${key}`, JSON.stringify(value));
  },

  // ── Current User ──
  getCurrentUser() {
    return this.get('currentUser');
  },

  setCurrentUser(user) {
    this.set('currentUser', user);
  },

  logout() {
    localStorage.removeItem('nn_currentUser');
  },

  // ── Users ──
  getUsers() {
    return this.get('users') || [];
  },

  addUser(user) {
    const users = this.getUsers();
    user.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    user.credits = 50;
    user.joinedAt = new Date().toISOString();
    users.push(user);
    this.set('users', users);
    return user;
  },

  getUserById(id) {
    return this.getUsers().find(u => u.id === id);
  },

  findUser(apartment, password) {
    return this.getUsers().find(u => u.apartment === apartment && u.password === password);
  },

  updateUser(id, updates) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates };
      this.set('users', users);
      if (this.getCurrentUser()?.id === id) {
        this.setCurrentUser(users[idx]);
      }
    }
  },

  // ── Posts / Feed ──
  getPosts() {
    return this.get('posts') || [];
  },

  addPost(post) {
    const posts = this.getPosts();
    post.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    post.createdAt = new Date().toISOString();
    post.likes = 0;
    post.comments = [];
    posts.unshift(post);
    this.set('posts', posts);
    return post;
  },

  likePost(postId) {
    const posts = this.getPosts();
    const post = posts.find(p => p.id === postId);
    if (post) {
      post.likes = (post.likes || 0) + 1;
      this.set('posts', posts);
    }
  },

  // ── Notices ──
  getNotices() {
    return this.get('notices') || [];
  },

  addNotice(notice) {
    const notices = this.getNotices();
    notice.id = Date.now().toString(36);
    notice.createdAt = new Date().toISOString();
    notices.unshift(notice);
    this.set('notices', notices);
    return notice;
  },

  // ── Marketplace ──
  getMarketItems() {
    return this.get('market') || [];
  },

  addMarketItem(item) {
    const items = this.getMarketItems();
    item.id = Date.now().toString(36);
    item.createdAt = new Date().toISOString();
    item.available = true;
    items.unshift(item);
    this.set('market', items);
    return item;
  },

  // ── Skills ──
  getSkills() {
    return this.get('skills') || [];
  },

  addSkill(skill) {
    const skills = this.getSkills();
    skill.id = Date.now().toString(36);
    skills.push(skill);
    this.set('skills', skills);
    return skill;
  },

  // ── Messages ──
  getConversations() {
    return this.get('conversations') || [];
  },

  getMessages(convId) {
    return this.get(`msgs_${convId}`) || [];
  },

  sendMessage(convId, msg) {
    const msgs = this.getMessages(convId);
    msg.id = Date.now().toString(36);
    msg.sentAt = new Date().toISOString();
    msgs.push(msg);
    this.set(`msgs_${convId}`, msgs);
    return msg;
  },

  getOrCreateConversation(userId1, userId2) {
    let convos = this.getConversations();
    let convo = convos.find(c =>
      (c.user1 === userId1 && c.user2 === userId2) ||
      (c.user1 === userId2 && c.user2 === userId1)
    );
    if (!convo) {
      convo = { id: Date.now().toString(36), user1: userId1, user2: userId2 };
      convos.push(convo);
      this.set('conversations', convos);
    }
    return convo;
  },

  // ── Credits ──
  addCredits(userId, amount, reason) {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      user.credits = (user.credits || 0) + amount;
      this.set('users', users);
      // Log
      const log = this.get('creditLog') || [];
      log.unshift({ userId, amount, reason, date: new Date().toISOString() });
      this.set('creditLog', log);
      if (this.getCurrentUser()?.id === userId) {
        this.setCurrentUser(user);
      }
    }
  },

  getCreditLog(userId) {
    return (this.get('creditLog') || []).filter(l => l.userId === userId);
  },

  getLeaderboard() {
    return this.getUsers()
      .filter(u => u.credits > 0)
      .sort((a, b) => b.credits - a.credits)
      .slice(0, 10);
  },

  // ── Help Requests ──
  getHelpRequests() {
    return this.get('helpRequests') || [];
  },

  addHelpRequest(req) {
    const reqs = this.getHelpRequests();
    req.id = Date.now().toString(36);
    req.createdAt = new Date().toISOString();
    req.status = 'open';
    reqs.unshift(req);
    this.set('helpRequests', reqs);
    return req;
  },

  // ── Emergency Alerts ──
  getEmergencies() {
    return this.get('emergencies') || [];
  },

  addEmergency(alert) {
    const alerts = this.getEmergencies();
    alert.id = Date.now().toString(36);
    alert.createdAt = new Date().toISOString();
    alerts.unshift(alert);
    this.set('emergencies', alerts);
    return alert;
  },

  // ── Polls / Voting ──
  getPolls() {
    return this.get('polls') || [];
  },

  addPoll(poll) {
    const polls = this.getPolls();
    poll.id = Date.now().toString(36);
    poll.createdAt = new Date().toISOString();
    polls.push(poll);
    this.set('polls', polls);
    return poll;
  },

  votePoll(pollId, optionIndex, userId) {
    const polls = this.getPolls();
    const poll = polls.find(p => p.id === pollId);
    if (poll && !poll.voters?.includes(userId)) {
      poll.options[optionIndex].votes = (poll.options[optionIndex].votes || 0) + 1;
      poll.voters = poll.voters || [];
      poll.voters.push(userId);
      this.set('polls', polls);
    }
  },

  // ── Seed Demo Data ──
  seedIfEmpty() {
    if (this.getUsers().length > 0) return;

    const colors = ['#6C5CE7', '#00CEC9', '#FD79A8', '#FDCB6E', '#E17055', '#00B894', '#74B9FF', '#A29BFE'];
    const randomColor = () => colors[Math.floor(Math.random() * colors.length)];

    // Demo users
    const demoUsers = [
      { name: 'Aarav Sharma', apartment: 'A-101', type: 'youngster', password: '1234', color: randomColor(), credits: 320 },
      { name: 'Priya Patel', apartment: 'B-204', type: 'youngster', password: '1234', color: randomColor(), credits: 275 },
      { name: 'Rohan Deshmukh', apartment: 'A-305', type: 'youngster', password: '1234', color: randomColor(), credits: 190 },
      { name: 'Sneha Kulkarni', apartment: 'C-102', type: 'youngster', password: '1234', color: randomColor(), credits: 150 },
      { name: 'Ramesh Joshi', apartment: 'B-101', type: 'senior', password: '1234', color: randomColor(), credits: 80 },
      { name: 'Sunita Devi', apartment: 'A-202', type: 'senior', password: '1234', color: randomColor(), credits: 60 },
      { name: 'Mohan Patil', apartment: 'C-301', type: 'senior', password: '1234', color: randomColor(), credits: 45 },
      { name: 'Kavita Nair', apartment: 'B-303', type: 'youngster', password: '1234', color: randomColor(), credits: 210 },
    ];

    demoUsers.forEach(u => {
      u.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      u.joinedAt = new Date().toISOString();
    });
    this.set('users', demoUsers);

    // Demo posts
    const demoPosts = [
      { authorId: demoUsers[0].id, content: '🏋️ Starting a morning yoga group on the terrace! Anyone interested in joining? 6 AM every weekday. Let\'s get fit together!', category: 'club', likes: 12, comments: [] },
      { authorId: demoUsers[1].id, content: '🔑 Found a set of keys near the parking area (B-block). Has a small blue keychain. Please claim at B-204!', category: 'lost-found', likes: 3, comments: [] },
      { authorId: demoUsers[4].id, content: 'The society meeting is scheduled for this Sunday at 5 PM in the clubhouse. Please attend — important maintenance decisions.', category: 'announcement', likes: 8, comments: [] },
      { authorId: demoUsers[3].id, content: '📚 I have a collection of UPSC preparation books I\'d like to share. If any student needs them, message me!', category: 'resource', likes: 15, comments: [] },
      { authorId: demoUsers[7].id, content: '🎸 Anyone up for a jam session this weekend? I play guitar and am looking for a vocalist and tabla player!', category: 'club', likes: 7, comments: [] },
      { authorId: demoUsers[2].id, content: '🚗 Heading to Pune tomorrow morning around 8 AM. Have 2 seats available for carpool. DM if interested!', category: 'resource', likes: 5, comments: [] },
    ];
    demoPosts.forEach(p => {
      p.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      p.createdAt = new Date(Date.now() - Math.random() * 86400000 * 3).toISOString();
    });
    this.set('posts', demoPosts);

    // Demo notices
    this.set('notices', [
      { id: 'n1', title: 'Water Tank Cleaning', content: 'Water supply will be interrupted on Sunday from 10 AM to 2 PM for tank cleaning.', author: 'Society Admin', createdAt: new Date().toISOString(), priority: 'high' },
      { id: 'n2', title: 'Diwali Celebration', content: 'Grand Diwali celebration in the courtyard on Nov 12th. Cultural program starts at 7 PM. All families welcome!', author: 'Cultural Committee', createdAt: new Date().toISOString(), priority: 'normal' },
      { id: 'n3', title: 'Parking Rules Update', content: 'Please park only in designated spots. Visitor parking is now available in Zone C.', author: 'Society Admin', createdAt: new Date().toISOString(), priority: 'normal' },
    ]);

    // Demo skills
    this.set('skills', [
      { id: 's1', userId: demoUsers[0].id, skill: 'Guitar Lessons', type: 'offer', description: 'Can teach acoustic guitar basics. 30 min sessions on weekends.' },
      { id: 's2', userId: demoUsers[1].id, skill: 'Tax Filing Help', type: 'offer', description: 'CA student — happy to help with ITR filing and tax queries.' },
      { id: 's3', userId: demoUsers[4].id, skill: 'Marathi Literature', type: 'offer', description: 'Retired professor. Can share books and discuss Marathi literature.' },
      { id: 's4', userId: demoUsers[3].id, skill: 'Yoga & Meditation', type: 'offer', description: 'Certified yoga instructor. Free sessions for building residents.' },
      { id: 's5', userId: demoUsers[7].id, skill: 'Web Development', type: 'offer', description: 'Full-stack developer. Can help with tech projects and website building.' },
      { id: 's6', userId: demoUsers[5].id, skill: 'Cooking Classes', type: 'offer', description: 'Traditional Maharashtrian recipes. Love sharing vishesh pakwan tips!' },
    ]);

    // Demo marketplace
    this.set('market', [
      { id: 'm1', userId: demoUsers[0].id, title: 'Electric Drill', type: 'lend', description: 'Bosch electric drill. Available for 2 days.', available: true, createdAt: new Date().toISOString() },
      { id: 'm2', userId: demoUsers[3].id, title: 'Board Games Collection', type: 'share', description: 'Monopoly, Scrabble, Chess. Come over for game night!', available: true, createdAt: new Date().toISOString() },
      { id: 'm3', userId: demoUsers[2].id, title: 'Carpool to Hinjewadi', type: 'carpool', description: 'Daily commute 8:30 AM, return 6:30 PM. Can share ride.', available: true, createdAt: new Date().toISOString() },
    ]);

    // Demo polls
    this.set('polls', [
      { id: 'p1', question: 'Should we install CCTV cameras in the parking area?', options: [{ text: 'Yes', votes: 18 }, { text: 'No', votes: 5 }, { text: 'Need more info', votes: 8 }], voters: [], createdAt: new Date().toISOString() },
      { id: 'p2', question: 'Preferred time for society meetings?', options: [{ text: 'Sunday 10 AM', votes: 12 }, { text: 'Sunday 5 PM', votes: 22 }, { text: 'Saturday 6 PM', votes: 9 }], voters: [], createdAt: new Date().toISOString() },
    ]);

    // Demo events
    const now = new Date();
    this.set('events', [
      { id: 'e1', title: 'Diwali Celebration', description: 'Grand Diwali celebration with cultural program, rangoli competition, and dinner.', date: new Date(now.getTime() + 5 * 86400000).toISOString().split('T')[0], time: '19:00', location: 'Society Courtyard', organizerId: demoUsers[1].id, attendees: [demoUsers[0].id, demoUsers[1].id, demoUsers[3].id, demoUsers[4].id, demoUsers[5].id], createdAt: new Date().toISOString() },
      { id: 'e2', title: 'Morning Yoga Session', description: 'Daily yoga on the terrace. Open to all ages. Bring your own mat.', date: new Date(now.getTime() + 1 * 86400000).toISOString().split('T')[0], time: '06:00', location: 'Terrace', organizerId: demoUsers[0].id, attendees: [demoUsers[0].id, demoUsers[5].id], createdAt: new Date().toISOString() },
      { id: 'e3', title: 'Gardening Workshop', description: 'Learn how to grow herbs and vegetables in your balcony. Seeds provided free!', date: new Date(now.getTime() + 8 * 86400000).toISOString().split('T')[0], time: '10:00', location: 'Garden Area', organizerId: demoUsers[5].id, attendees: [demoUsers[2].id, demoUsers[5].id, demoUsers[6].id], createdAt: new Date().toISOString() },
    ]);
  },

  // ── Events ──
  getEvents() {
    return this.get('events') || [];
  },

  addEvent(event) {
    const events = this.getEvents();
    event.id = Date.now().toString(36);
    event.createdAt = new Date().toISOString();
    event.attendees = event.attendees || [];
    events.push(event);
    this.set('events', events);
    return event;
  },

  rsvpEvent(eventId, userId) {
    const events = this.getEvents();
    const event = events.find(e => e.id === eventId);
    if (event) {
      if (!event.attendees) event.attendees = [];
      if (!event.attendees.includes(userId)) {
        event.attendees.push(userId);
      } else {
        event.attendees = event.attendees.filter(id => id !== userId);
      }
      this.set('events', events);
    }
  }
};
