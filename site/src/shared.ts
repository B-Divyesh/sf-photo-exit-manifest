const offline = document.querySelector<HTMLElement>('#offline-notice');

function updateNetwork() {
  if (offline) offline.hidden = navigator.onLine;
}

function announceRoute() {
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  let cameFromThisSite = false;
  try {
    cameFromThisSite = Boolean(document.referrer) && new URL(document.referrer).origin === location.origin;
  } catch {
    cameFromThisSite = false;
  }
  if (!cameFromThisSite && navigation?.type !== 'back_forward') return;
  const heading = document.querySelector<HTMLHeadingElement>('main h1');
  const status = document.querySelector<HTMLElement>('#route-status');
  if (!heading) return;
  heading.tabIndex = -1;
  heading.focus({ preventScroll: true });
  if (status) status.textContent = `${document.title} loaded`;
}

window.addEventListener('online', updateNetwork);
window.addEventListener('offline', updateNetwork);
window.addEventListener('pageshow', announceRoute);
updateNetwork();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => void navigator.serviceWorker.register('/sw.js'));
}
