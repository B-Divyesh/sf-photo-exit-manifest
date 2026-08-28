const offline = document.querySelector<HTMLElement>('#offline-notice');
const scrollStateKey = 'photoExitScrollY';

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

function updateNetwork() {
  if (offline) offline.hidden = navigator.onLine;
}

function rememberScrollPosition() {
  const state = history.state && typeof history.state === 'object' ? history.state : {};
  history.replaceState({ ...state, [scrollStateKey]: window.scrollY }, '');
}

function announceRoute(event?: PageTransitionEvent) {
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
  const restoreScroll = event?.persisted || navigation?.type === 'back_forward';
  const savedScroll = history.state?.[scrollStateKey];
  const focusHeading = () => {
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
    if (status) status.textContent = `${document.title} loaded`;
  };
  if (restoreScroll && typeof savedScroll === 'number') {
    window.requestAnimationFrame(() => {
      window.scrollTo(0, savedScroll);
      focusHeading();
    });
  } else {
    focusHeading();
  }
}

window.addEventListener('online', updateNetwork);
window.addEventListener('offline', updateNetwork);
window.addEventListener('pageshow', announceRoute);
window.addEventListener('pagehide', rememberScrollPosition);
document.addEventListener('click', (event) => {
  const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
  if (!link) return;
  const destination = new URL(link.href, location.href);
  if (destination.origin === location.origin && destination.href !== location.href) rememberScrollPosition();
});
updateNetwork();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => void navigator.serviceWorker.register('/sw.js'));
}
