import './style.css';
import './shared';

const params = new URLSearchParams(location.search);
if (params.get('demo') === '1') location.replace('/demo/');

const copy = document.querySelector<HTMLButtonElement>('#copy-command');
copy?.addEventListener('click', async () => {
  const command = document.querySelector<HTMLElement>('#install-command')?.textContent?.trim() || '';
  try {
    await navigator.clipboard.writeText(command);
    copy.textContent = 'Install command copied';
  } catch {
    copy.textContent = 'Select the command to copy it';
  }
  window.setTimeout(() => { copy.textContent = 'Copy install command'; }, 1800);
});
