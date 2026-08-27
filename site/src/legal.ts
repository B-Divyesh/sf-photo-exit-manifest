import './style.css';

const offline = document.querySelector<HTMLElement>('#offline-notice');
function updateNetwork() {
  if (offline) offline.hidden = navigator.onLine;
}
window.addEventListener('online', updateNetwork);
window.addEventListener('offline', updateNetwork);
updateNetwork();
if ('serviceWorker' in navigator) window.addEventListener('load', () => void navigator.serviceWorker.register('/sw.js'));
