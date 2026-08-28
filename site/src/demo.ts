import './style.css';
import './shared';

const reset = document.querySelector<HTMLButtonElement>('#reset-demo');
const status = document.querySelector<HTMLElement>('#demo-status');

reset?.addEventListener('click', () => {
  document.querySelectorAll<HTMLDetailsElement>('.demo-details').forEach((item) => { item.open = false; });
  const heading = document.querySelector<HTMLHeadingElement>('main h1');
  if (heading) {
    heading.tabIndex = -1;
    heading.focus();
  }
  if (status) status.textContent = 'Sample restored. No browser or family data changed.';
  reset.textContent = 'Demo reset';
  window.setTimeout(() => { reset.textContent = 'Reset demo'; }, 1600);
});
