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

// Event listeners
if (tabTimeline) tabTimeline.addEventListener('click', () => setTab('timeline'));
if (tabThemes) tabThemes.addEventListener('click', () => setTab('themes'));

attachOpenHandlers('.node');
attachOpenHandlers('.theme');

if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
if (backBtn) backBtn.addEventListener('click', showMainView);

// Global shortcuts and outside-click to close
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (drawer.classList.contains('open')) {
      closeDrawer();
    } else if (!episodeView.hidden) {
      showMainView();
    }
  }
});

document.addEventListener('click', (e) => {
  if (drawer.classList.contains('open') && !drawer.contains(e.target) && !e.target.closest('.node, .theme')) {
    closeDrawer();
  }
});

document.getElementById('btn-listen')?.addEventListener('click', () => setTab('timeline'));
document.getElementById('btn-about')?.addEventListener('click', () => setTab('themes'));
