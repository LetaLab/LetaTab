// Redirect the New Tab page to the address configured in the popup,
// falling back to the default in config.js until one is saved.
//
// Priority: chrome.storage (set from the popup) > config.js default
// > a short on-page message telling you what to do next.

(function () {
  'use strict';

  function isHttpUrl(value) {
    try {
      const parsed = new URL(value);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch (err) {
      return false;
    }
  }

  function showMessage(text) {
    document.body.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.style.cssText =
      'display:flex;align-items:center;justify-content:center;' +
      'height:100vh;margin:0;padding:0 24px;box-sizing:border-box;' +
      'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;' +
      'color:#9099a3;font-size:13px;text-align:center;';
    wrap.textContent = text;
    document.body.appendChild(wrap);
  }

  chrome.storage.sync.get({ newTabUrl: '', enabled: true }, (data) => {
    if (!data.enabled) {
      showMessage('LetaTab is turned off. Click the toolbar icon to turn it back on.');
      return;
    }

    if (data.newTabUrl && isHttpUrl(data.newTabUrl)) {
      window.location.href = data.newTabUrl;
      return;
    }

    if (typeof NEW_TAB_URL !== 'undefined' && isHttpUrl(NEW_TAB_URL)) {
      window.location.href = NEW_TAB_URL;
      return;
    }

    showMessage('No New Tab URL is set yet. Click the LetaTab icon in the toolbar to choose one.');
  });
})();
