// DOM queries
const tabTimeline = document.getElementById('tab-timeline');
const tabThemes = document.getElementById('tab-themes');
const panelTimeline = document.getElementById('panel-timeline');
const panelThemes = document.getElementById('panel-themes');
const drawer = document.getElementById('drawer');
const dTitle = document.getElementById('drawer-title');
const dDesc = document.getElementById('drawer-desc');
const dChips = document.getElementById('drawer-chips');
const closeBtn = document.getElementById('drawer-close');
const drawerEpisodeBtn = document.getElementById('drawer-episode-btn');
const navToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

// View-switching elements
const mainView = document.getElementById('main-view');
const episodeView = document.getElementById('episode-view');
const episodeTitle = document.getElementById('episode-title');
const episodeContent = document.getElementById('episode-content');
const backBtn = document.getElementById('btn-back');

let activeElement = null;

function setTab(tab){
  const isTimeline = tab === 'timeline';
  tabTimeline.classList.toggle('active', isTimeline);
  tabTimeline.setAttribute('aria-selected', isTimeline);
  tabThemes.classList.toggle('active', !isTimeline);
  tabThemes.setAttribute('aria-selected', !isTimeline);
  panelTimeline.hidden = !isTimeline;
  panelThemes.hidden = isTimeline;
  closeDrawer();
}

function openDrawerFrom(el){
  if (activeElement) {
    activeElement.classList.remove('active');
  }
  activeElement = el;
  activeElement.classList.add('active');

  const data = el.dataset;
  dTitle.textContent = data.title || 'Untitled';
  dDesc.textContent = data.desc || '';
  dChips.innerHTML = '';

  if (data.era){ addChip('Era', data.era); }
  if (data.themes || data.linked){ addChip('Themes', data.themes || data.linked); }

  drawerEpisodeBtn.onclick = () => showEpisodePage(data);

  drawer.classList.add('open');
  closeBtn.focus();
}

function closeDrawer(){
  drawer.classList.remove('open');
  if (activeElement) {
    activeElement.classList.remove('active');
    activeElement.focus();
    activeElement = null;
  }
}

function addChip(label, value){
  const c = document.createElement('span');
  c.className = 'chip';
  c.textContent = `${label}: ${value}`;
  dChips.appendChild(c);
}

function attachOpenHandlers(selector){
  document.querySelectorAll(selector).forEach(el => {
    // Populate the node name/meta if they are empty
    if(el.classList.contains('node') && !el.querySelector('.name')) {
      el.innerHTML = `<div class="eyebrow">Era</div><div class="name">${el.dataset.title}</div><div class="meta">${el.dataset.era}</div>`;
    }
    if(el.classList.contains('theme') && !el.querySelector('h3')) {
      const existingP = el.querySelector('p');
      const text = existingP ? existingP.textContent : 'Cross-cultural idea.';
      el.innerHTML = `<h3>${el.dataset.title}</h3><p>${text}</p>`;
    }

    el.addEventListener('click', () => openDrawerFrom(el));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDrawerFrom(el); }
    });
  });
}

function showEpisodePage(data) {
  closeDrawer();
  mainView.hidden = true;
  episodeView.hidden = false;

  episodeTitle.textContent = data.title;
  episodeContent.innerHTML = `<p>${data.desc}</p>`;

  window.scrollTo(0, 0);
  backBtn.focus();
}

function showMainView() {
  episodeView.hidden = true;
  mainView.hidden = false;
  window.scrollTo(0, 0);
}

// Data-driven rendering and routing
(async function init() {
  try {
    const res = await fetch('./assets/data.json', { cache: 'no-store' });
    const data = await res.json();
    renderTimeline(data.timeline);
    renderThemes(data.themes);
    wireCommonHandlers();
    applyHashRoute();
  } catch (e) {
    console.error('Failed to load data.json', e);
  }
})();

function renderTimeline(items) {
  const wrap = document.getElementById('timeline-list');
  if (!wrap) return;
  wrap.innerHTML = '';
  items.forEach(item => {
    const el = document.createElement('article');
    el.className = 'node';
    el.setAttribute('role', 'listitem');
    el.setAttribute('tabindex', '0');
    el.dataset.title = item.title;
    el.dataset.era = item.era;
    el.dataset.themes = (item.themes || []).join(', ');
    el.dataset.desc = item.desc || '';
    el.dataset.slug = item.slug;
    el.innerHTML = `<div class="eyebrow">Era</div><div class="name">${item.title}</div><div class="meta">${item.era}</div>`;
    wrap.appendChild(el);
  });
  attachOpenHandlers('#timeline-list .node');
  addTimelineKeyboardNav(wrap);
  setupTimelineScroll();
}

function renderThemes(items) {
  const wrap = document.getElementById('themes-list');
  if (!wrap) return;
  wrap.innerHTML = '';
  // Ensure grid is navigable by arrow keys
  wrap.setAttribute('role', 'list');
  items.forEach(item => {
    const el = document.createElement('article');
    el.className = 'theme';
    el.setAttribute('role', 'listitem');
    el.setAttribute('tabindex', '0');
    el.dataset.title = item.title;
    el.dataset.linked = (item.linked || []).join(', ');
    el.dataset.desc = item.desc || '';
    el.dataset.slug = item.slug;
    el.innerHTML = `<h3>${item.title}</h3><p>${item.summary || 'Cross-cultural idea.'}</p>`;
    wrap.appendChild(el);
  });
  attachOpenHandlers('#themes-list .theme');
  addGridKeyboardNav(wrap, '.theme');
}

function addTimelineKeyboardNav(container){
  const nodes = () => Array.from(container.querySelectorAll('.node'));
  container.addEventListener('keydown', (e) => {
    const list = nodes();
    const currentIndex = list.indexOf(document.activeElement);
    if (currentIndex === -1) return;

    const focusNode = (index, align = 'center') => {
      const target = list[index];
      target?.focus();
      target?.scrollIntoView({ behavior: 'smooth', inline: align, block: 'nearest' });
    };

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        focusNode(Math.min(currentIndex + 1, list.length - 1));
        break;
      case 'ArrowLeft':
        e.preventDefault();
        focusNode(Math.max(currentIndex - 1, 0));
        break;
      case 'Home':
        e.preventDefault();
        focusNode(0, 'start');
        break;
      case 'End':
        e.preventDefault();
        focusNode(list.length - 1, 'end');
        break;
      default:
        break;
    }
  });
}

function setupTimelineScroll(){
  const scroller = document.querySelector('.timeline-wrap');
  const prev = document.querySelector('.timeline-nav.prev');
  const next = document.querySelector('.timeline-nav.next');
  if(!scroller || !prev || !next) return;

  const scrollAmount = () => {
    const timeline = scroller.querySelector('.timeline');
    const node = timeline?.querySelector('.node');
    const styles = timeline ? getComputedStyle(timeline) : null;
    const gap = styles ? parseInt(styles.columnGap || styles.gap || 0, 10) : 0;
    return (node?.offsetWidth || 260) + gap;
  };

  prev.addEventListener('click', () => {
    scroller.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
  });
  next.addEventListener('click', () => {
    scroller.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
  });

  const update = () => {
    const max = scroller.scrollWidth - scroller.clientWidth - 1;
    prev.disabled = scroller.scrollLeft <= 0;
    next.disabled = scroller.scrollLeft >= max;
  };
  scroller.addEventListener('scroll', update);
  update();
}

function addGridKeyboardNav(container, itemSelector){
  const items = () => Array.from(container.querySelectorAll(itemSelector));
  container.addEventListener('keydown', (e) => {
    const list = items();
    const current = document.activeElement;
    const idx = list.indexOf(current);
    if (idx === -1) return;

    const cols = getComputedStyle(container).gridTemplateColumns.split(' ').length || 3;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      list[Math.min(idx + 1, list.length - 1)]?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      list[Math.max(idx - 1, 0)]?.focus();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      list[Math.min(idx + cols, list.length - 1)]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      list[Math.max(idx - cols, 0)]?.focus();
    }
  });
}

// Improve hash route tab selection ARIA state
const _setTab = setTab;
setTab = function(tab){
  _setTab(tab);
  const isTimeline = tab === 'timeline';
  document.getElementById('tab-timeline')?.setAttribute('aria-selected', String(isTimeline));
  document.getElementById('tab-themes')?.setAttribute('aria-selected', String(!isTimeline));
};

function wireCommonHandlers(){
  // Tabs
  tabTimeline?.addEventListener('click', () => setTab('timeline'));
  tabThemes?.addEventListener('click', () => setTab('themes'));

  // Drawer
  closeBtn?.addEventListener('click', closeDrawer);

  // Episode Back
  backBtn?.addEventListener('click', showMainView);

  // Global shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (drawer.classList.contains('open')) {
        closeDrawer();
      } else if (!episodeView.hidden) {
        showMainView();
      } else if (!aboutModal.hidden) {
        closeAbout();
      }
    }
  });

  // Click-away to close drawer
  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('open') && !drawer.contains(e.target) && !e.target.closest('.node, .theme')) {
      closeDrawer();
    }
  });

  // Buttons
  document.getElementById('btn-listen')?.addEventListener('click', () => setTab('timeline'));
  document.getElementById('btn-about')?.addEventListener('click', openAbout);
  document.getElementById('nav-about')?.addEventListener('click', (e) => { e.preventDefault(); openAbout(); });
  navToggle?.addEventListener('click', () => {
    const expanded = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(expanded));
  });
}

// Focus trap utilities
function getTabbables(root) {
  if (!root) return [];
  const selector = [
    'a[href]','area[href]','input:not([disabled]):not([type="hidden"])','select:not([disabled])','textarea:not([disabled])',
    'button:not([disabled])','iframe','object','embed','[contenteditable]','[tabindex]:not([tabindex="-1"])'
  ].join(',');
  return Array.from(root.querySelectorAll(selector))
    .filter(el => el.offsetParent !== null || el === document.activeElement);
}

let trapState = null; // { container, lastActive, onKeydown }
function trapFocus(container) {
  if (!container) return;
  const tabbables = getTabbables(container);
  const first = tabbables[0];
  const last = tabbables[tabbables.length - 1];
  const lastActive = document.activeElement;

  const onKeydown = (e) => {
    if (e.key !== 'Tab' || tabbables.length === 0) return;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last?.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first?.focus();
    }
  };

  document.addEventListener('keydown', onKeydown);
  if (first) first.focus();
  trapState = { container, lastActive, onKeydown };
}

function releaseFocus() {
  if (!trapState) return;
  document.removeEventListener('keydown', trapState.onKeydown);
  if (trapState.lastActive && trapState.lastActive.focus) {
    trapState.lastActive.focus();
  }
  trapState = null;
}

// Inert background helpers
const appBackground = document.getElementById('main-view');
const episodeBackground = document.getElementById('episode-view');
function setBackgroundInert(isInert) {
  [appBackground, episodeBackground].forEach(el => {
    if (!el) return;
    if (isInert) {
      el.setAttribute('inert', '');
      el.setAttribute('aria-hidden', 'true');
    } else {
      el.removeAttribute('inert');
      el.removeAttribute('aria-hidden');
    }
  });
}

// Enhance drawer open/close for focus + inert
const drawerTitle = document.getElementById('drawer-title');
const drawerRegion = document.getElementById('drawer');

const _openDrawerFrom = openDrawerFrom;
openDrawerFrom = function(el){
  _openDrawerFrom(el);
  document.body.classList.add('modal-open');
  drawerRegion.setAttribute('aria-modal', 'true');
  drawerRegion.setAttribute('role', 'dialog');
  drawerRegion.setAttribute('aria-labelledby', 'drawer-title');
  setBackgroundInert(true);
  trapFocus(drawerRegion);
};

const _closeDrawer = closeDrawer;
closeDrawer = function(){
  _closeDrawer();
  drawerRegion.removeAttribute('aria-modal');
  drawerRegion.removeAttribute('role');
  drawerRegion.removeAttribute('aria-labelledby');
  setBackgroundInert(false);
  releaseFocus();
  document.body.classList.remove('modal-open');
};

// Enhance About modal for focus + inert
const aboutModal = document.getElementById('about-modal');
const aboutOverlay = document.getElementById('about-overlay');
const aboutClose = document.getElementById('about-close');

const _openAbout = openAbout;
openAbout = function(){
  _openAbout();
  document.body.classList.add('modal-open');
  aboutModal.setAttribute('aria-modal', 'true');
  aboutModal.setAttribute('role', 'dialog');
  setBackgroundInert(true);
  trapFocus(aboutModal);
};

const _closeAbout = closeAbout;
closeAbout = function(){
  _closeAbout();
  aboutModal.removeAttribute('aria-modal');
  aboutModal.removeAttribute('role');
  setBackgroundInert(false);
  releaseFocus();
  document.body.classList.remove('modal-open');
};

// Hash routing: #mode=timeline|themes, #episode=slug
window.addEventListener('hashchange', applyHashRoute);
function applyHashRoute(){
  const params = new URLSearchParams(location.hash.replace(/^#/, ''));
  const mode = params.get('mode');
  const episode = params.get('episode');

  if (mode === 'themes') setTab('themes');
  else if (mode === 'timeline') setTab('timeline');

  if (episode) {
    // Try to find a node with matching slug and open episode page
    const el = document.querySelector(`.node[data-slug="${CSS.escape(episode)}"]`);
    if (el) {
      openDrawerFrom(el);
      // Directly open the episode page instead of waiting for button
      const data = el.dataset;
      showEpisodePage(data);
    }
  }
}

// When opening episode via button, update the hash
const originalShowEpisodePage = showEpisodePage;
showEpisodePage = function(data){
  const params = new URLSearchParams(location.hash.replace(/^#/, ''));
  params.set('mode', 'timeline');
  if (data.slug) params.set('episode', data.slug);
  location.hash = `#${params.toString()}`;
  originalShowEpisodePage(data);
};
