const urlInput = document.getElementById('url');
const enabledToggle = document.getElementById('enabled');
const status = document.getElementById('status');
const hint = document.getElementById('hint');

const DEFAULT_HINT = 'Enter a full address, including https://. It opens every time you start a new tab.';
const ERROR_HINT = 'Web address must start with https:// or http://';

let statusTimer = null;
let saveTimer = null;

function isHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (err) {
    return false;
  }
}

chrome.storage.sync.get(
  { newTabUrl: '', enabled: true },
  (data) => {
    urlInput.value = data.newTabUrl;
    enabledToggle.checked = data.enabled;
  }
);

function showSaved() {
  status.classList.add('visible');
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => {
    status.classList.remove('visible');
  }, 1500);
}

function setError(isError) {
  hint.textContent = isError ? ERROR_HINT : DEFAULT_HINT;
  hint.classList.toggle('error', isError);
}

urlInput.addEventListener('input', () => {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    const value = urlInput.value.trim();

    if (value === '') {
      setError(false);
      chrome.storage.sync.set({ newTabUrl: '' }, showSaved);
      return;
    }

    if (!isHttpUrl(value)) {
      setError(true);
      return;
    }

    setError(false);
    chrome.storage.sync.set({ newTabUrl: value }, showSaved);
  }, 500);
});

enabledToggle.addEventListener('change', () => {
  chrome.storage.sync.set({ enabled: enabledToggle.checked }, showSaved);
});
