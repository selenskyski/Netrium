// Register UV service worker
(async () => {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/uv/uv.sw.js', { scope: '/' });
      console.log('UV service worker registered');
    } catch (e) {
      console.error('SW registration failed', e);
    }
  }
})();

import { bareClient } from '/uv/uv.client.js';

const input = document.getElementById('url');
const goBtn = document.getElementById('go');
const frame = document.getElementById('frame');
const gamesEl = document.getElementById('games');

function toProxy(urlOrQuery) {
  const url = urlOrQuery.includes('.') || urlOrQuery.startsWith('http')
    ? urlOrQuery
    : `https://duckduckgo.com/?q=${encodeURIComponent(urlOrQuery)}`;
  return __uv$config.prefix + __uv$encodeUrl(url);
}

goBtn.addEventListener('click', () => {
  frame.src = toProxy(input.value.trim());
});

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') goBtn.click();
});

// Cloak: swap title & favicon for stealth
document.getElementById('cloak').onclick = () => {
  document.title = 'Docs – Overview';
  const link = document.querySelector('link[rel="icon"]');
  link.href = 'https://www.google.com/favicon.ico';
};

// Load games
fetch('/games.json')
  .then((r) => r.json())
  .then((games) => {
    gamesEl.innerHTML = games
      .map(
        (g) => `
        <button class="card" data-url="${g.url}">
          <span class="title">${g.name}</span>
        </button>`
      )
      .join('');
    gamesEl.querySelectorAll('.card').forEach((el) => {
      el.addEventListener('click', () => (frame.src = toProxy(el.dataset.url)));
    });
  })
  .catch(() => (gamesEl.innerHTML = '<p>Could not load games.</p>'));
