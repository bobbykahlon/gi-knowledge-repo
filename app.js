/* ── GI Knowledge Repository — app.js ── */

(function () {
  'use strict';

  const navContainer = document.getElementById('nav-container');
  const contentArea = document.getElementById('content-area');
  const breadcrumb = document.getElementById('breadcrumb');
  const hamburger = document.getElementById('hamburger');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  let navData = null;
  let activeLink = null;

  // Configure marked to allow raw HTML (needed for iframes, scripts in .md)
  marked.setOptions({ breaks: false });
  if (marked.use) {
    marked.use({ mangle: false, headerIds: false });
  }

  // ── Load navigation index ──────────────────────────────────────
  async function loadNav() {
    try {
      const res = await fetch('content/index.json');
      navData = await res.json();
      buildNav(navData.categories);
      handleInitialHash();
    } catch (e) {
      navContainer.innerHTML = '<p style="padding:16px;color:#888;font-size:13px;">Failed to load navigation.</p>';
    }
  }

  // ── Build sidebar nav ─────────────────────────────────────────
  function buildNav(categories) {
    navContainer.innerHTML = '';

    categories.forEach((cat) => {
      const group = document.createElement('div');
      group.className = 'nav-category';
      group.dataset.id = cat.id;

      const btn = document.createElement('button');
      btn.className = 'category-btn';
      btn.setAttribute('aria-expanded', 'false');
      btn.innerHTML = `${escapeHtml(cat.name)}<svg class="category-chevron" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

      const list = document.createElement('div');
      list.className = 'topic-list';
      list.setAttribute('role', 'list');

      cat.topics.forEach((topic) => {
        const link = document.createElement('a');
        link.className = 'topic-link';
        link.setAttribute('role', 'listitem');
        link.textContent = topic.title;
        link.href = `#${encodeURIComponent(topic.file)}`;
        link.dataset.file = topic.file;
        link.dataset.category = cat.name;
        link.dataset.title = topic.title;

        link.addEventListener('click', (e) => {
          e.preventDefault();
          selectTopic(link, cat.name, topic.title, topic.file);
          closeSidebar();
        });

        list.appendChild(link);
      });

      btn.addEventListener('click', () => {
        const isOpen = group.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(isOpen));
      });

      group.appendChild(btn);
      group.appendChild(list);
      navContainer.appendChild(group);
    });
  }

  // ── Select and render a topic ──────────────────────────────────
  async function selectTopic(linkEl, categoryName, topicTitle, filePath) {
    if (activeLink) activeLink.classList.remove('active');
    activeLink = linkEl;
    linkEl.classList.add('active');

    breadcrumb.innerHTML = `${escapeHtml(categoryName)}<span>›</span>${escapeHtml(topicTitle)}`;
    history.replaceState(null, '', `#${encodeURIComponent(filePath)}`);

    contentArea.classList.add('loading');
    contentArea.innerHTML = '';

    try {
      const res = await fetch(filePath);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const md = await res.text();
      contentArea.classList.remove('loading');

      // Parse markdown — marked preserves raw HTML blocks by default
      const parsed = marked.parse(md);
      contentArea.innerHTML = parsed;

      // Re-execute any inline <script> tags injected by marked
      contentArea.querySelectorAll('script').forEach(oldScript => {
        const s = document.createElement('script');
        s.textContent = oldScript.textContent;
        oldScript.parentNode.replaceChild(s, oldScript);
      });

    } catch (e) {
      contentArea.classList.remove('loading');
      contentArea.innerHTML = `<p style="color:#888;font-size:14px;">Could not load content for this topic.</p>`;
    }

    contentArea.scrollTop = 0;
  }

  // ── Handle URL hash on load ────────────────────────────────────
  function handleInitialHash() {
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    const filePath = decodeURIComponent(hash);
    if (!navData) return;

    for (const cat of navData.categories) {
      for (const topic of cat.topics) {
        if (topic.file === filePath) {
          const group = navContainer.querySelector(`.nav-category[data-id="${cat.id}"]`);
          if (group) {
            group.classList.add('open');
            group.querySelector('.category-btn').setAttribute('aria-expanded', 'true');
            const linkEl = group.querySelector(`a[data-file="${CSS.escape(filePath)}"]`);
            if (linkEl) selectTopic(linkEl, cat.name, topic.title, topic.file);
          }
          return;
        }
      }
    }
  }

  // ── Mobile sidebar ─────────────────────────────────────────────
  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', () => {
    const isOpen = sidebar.classList.contains('open');
    isOpen ? closeSidebar() : openSidebar();
  });

  overlay.addEventListener('click', closeSidebar);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSidebar();
  });

  // ── Utility ───────────────────────────────────────────────────
  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ── Init ──────────────────────────────────────────────────────
  loadNav();

})();
