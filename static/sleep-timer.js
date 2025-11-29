/*
 * Sleep-timer script for root site
 * - Tries to fetch /api/sleep-status
 * - Falls back to a client-side timeout (default 30 minutes)
 * - Tracks user activity (mousemove, keydown, touchstart, click, scroll) to reset countdown
 */
(() => {
  const DEFAULT_IDLE_SECONDS = (window.IDLE_TIMEOUT_SECONDS && Number(window.IDLE_TIMEOUT_SECONDS)) || 30 * 60; // 30min
  const endpoint = '/api/sleep-status';
  const containerId = 'sleep-timer';
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    // Some basic styling so it shows up
    container.style.position = 'fixed';
    container.style.right = '12px';
    container.style.top = '12px';
    container.style.padding = '8px 10px';
    container.style.background = 'rgba(0,0,0,0.6)';
    container.style.color = '#fff';
    container.style.borderRadius = '6px';
    container.style.fontWeight = '600';
    container.style.zIndex = '9999';
    container.style.fontFamily = 'Inter, system-ui, sans-serif';
    container.style.fontSize = '14px';
    container.textContent = 'Loading sleep info...';
    document.body.appendChild(container);
  }

  let idleSeconds = DEFAULT_IDLE_SECONDS;
  let lastActive = Date.now();

  function formatTimeDiff(ms) {
    const total = Math.max(0, Math.floor(ms / 1000));
    const m = Math.floor(total / 60).toString().padStart(2,'0');
    const s = (total % 60).toString().padStart(2,'0');
    return `${m}:${s}`;
  }

  function render() {
    const willSleepAt = lastActive + idleSeconds * 1000;
    const now = Date.now();
    const diff = willSleepAt - now;
    if (diff <= 0) {
      container.textContent = 'Server likely sleeping';
      container.classList.add('sleeping');
      return;
    }
    container.classList.remove('sleeping');
    container.textContent = `Server sleeps in ${formatTimeDiff(diff)}`;
  }

  let interval = null;
  function startRenderLoop() {
    render();
    if (interval) clearInterval(interval);
    interval = setInterval(render, 1000);
  }

  function resetActivity() {
    lastActive = Date.now();
  }

  function startActivityListeners() {
    ['mousemove','keydown','touchstart','click','scroll'].forEach(ev => {
      window.addEventListener(ev, resetActivity, { passive: true });
    });
  }

  function tryFetchStatus() {
    fetch(endpoint, { cache: 'no-cache'})
      .then(res => {
        if (!res.ok) throw new Error('Not ok');
        return res.json();
      })
      .then(json => {
        if (json && json.idleTimeoutSeconds) {
          idleSeconds = Number(json.idleTimeoutSeconds) || idleSeconds;
        }
        if (json && json.lastActive) {
          lastActive = new Date(json.lastActive).getTime();
        }
        startRenderLoop();
      })
      .catch(_ => {
        // Nothing to do — just fall back to client behavior
        container.title = 'Using local fallback timeout';
        startRenderLoop();
      });
  }

  // Initialize
  startActivityListeners();
  tryFetchStatus();
})();
