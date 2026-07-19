# LetaTab

<p align="left">  
<img src="https://github.com/user-attachments/assets/79b0c0a6-6caa-4d3f-bebb-c1facc760e06" alt="OG" width="15%">
</p>

---

<p align="center">
  <em>Hi, I'm Leta - the mascot of all projects under the LetaLab umbrella!</em><br><br>
  <em>Andrzej brought me to life using Inkscape! I am related to Tux!</em><br>
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/e6230a1e-3fbd-48f7-965c-fdb42e52d370" alt="icon-512" width="220">
</p>

---

**Set your own New Tab page, in a click.**

Every new tab defaults to the browser's own New Tab page, and there's no built-in way to point it at your own dashboard, search page, or anything else you'd rather see first - not without editing a file by hand, anyway. LetaTab lets you set any web address once, in a small popup, and every new tab opens straight to it from then on.

"LetaTab" is a small, single-purpose extension for Chrome, Edge, Brave, and other Chromium-based browsers, and it's part of the LetaLab family of projects - you can find the rest of them at [https://LetaLab.eu](https://letalab.eu).

Website is created by me and I do everything that is in my limited power to make it [safe and private](https://www.ssllabs.com/ssltest/analyze.html?d=letalab.eu&hideResults=on&latest).

| SSLLabs Server testing results |
|---|
| <a href="https://github.com/user-attachments/assets/9fe4044b-92f6-4de6-9e65-5fbf79fb4df2"><img width="50%" alt="SSLLabs Server testing results" src="https://github.com/user-attachments/assets/9fe4044b-92f6-4de6-9e65-5fbf79fb4df2" /></a> |

![Manifest](https://img.shields.io/badge/Manifest-V3-blue)
![Browsers](https://img.shields.io/badge/Chrome%20%7C%20Edge%20%7C%20Brave%20%7C%20Chromium-supported-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## Table of contents

- [Get the extension](#get-the-extension)
- [Screenshots](#screenshots)
- [Features](#features)
- [How it works](#how-it-works)
- [Permissions](#permissions)
- [Privacy and security](#privacy-and-security)
- [Known issues and support](#known-issues-and-support)
- [Directory structure](#directory-structure)
- [License](#license)
- [Credits](#credits)

## Get the extension

The easiest way to install LetaTab is straight from your browser's official store:

[![Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-Install-blue)](ADD-THIS-LATER)
[![Edge Add-ons](https://img.shields.io/badge/Edge%20Addons-Install-blue)](ADD-THIS-LATER)

Brave and other Chromium-based browsers can use the Chrome Web Store link above too.

## Screenshots

_Screenshots of the popup and New Tab page will be added here once the store listing is ready._

## Features

- Set any web address as your New Tab page from a small popup - no more editing `config.js` by hand
- Your choice is saved instantly through `chrome.storage.sync` and stays put - no re-prompting, no reset on browser restart
- A simple ON/OFF toggle in the popup lets you pause the redirect without uninstalling anything - when it's off, a new tab shows a plain message instead
- Falls back to a sensible built-in default address until you choose your own, so the extension is never left pointing nowhere
- Web addresses are checked before they're saved, so a typo can't quietly break your New Tab page
- Zero configuration beyond that one address field - no accounts, no onboarding, no setup wizard
- A small link to letalab.eu at the bottom of the popup - just a plain link that opens in a new tab, nothing tracking it

## How it works

LetaTab uses Chrome's `chrome_url_overrides` manifest key, the API built for exactly this purpose, to replace the browser's New Tab page with its own page (`newtab.html`).

The new page reads `chrome.storage.sync` as soon as it loads. If you've saved an address in the popup and the extension is enabled, it sends the browser straight there. If you haven't saved one yet, it falls back to the default address in `config.js`, and if even that's missing, it shows a short message instead of a blank page.

Saving works the same way in reverse - typing an address in the popup writes it to `chrome.storage.sync` a moment after you stop typing, once it's checked that the address starts with `https://` or `http://`. That's the same storage area the New Tab page reads from, so the next tab you open already reflects the change.

```text
popup (user types an address)
  -> validate it's http:// or https://
       -> chrome.storage.sync.set()
            -> newtab.html loads (chrome_url_overrides)
                 -> reads chrome.storage.sync.get()
                      -> window.location.href = saved address
```

No network requests anywhere in this chain except the one page you asked to open, no external dependencies, no build step - just vanilla JavaScript, and no background service worker at all, since there's nothing that needs to run in the background.

## Permissions

| Permission | Why |
|---|---|
| `storage` | Remembers the New Tab address you choose and whether the extension is enabled |

That's genuinely all of it - no host permissions, no `<all_urls>`, no `tabs`, no `cookies`, no `scripting`, no `webRequest`. If a future version ever needs something new, this table gets updated in the same commit that adds it.

## Privacy and security

- No data collection of any kind - no analytics, no crash reporting, no telemetry, no update-check pings. The extension never contacts any server, including one of its own
- Exactly two values are ever stored, using the browser's own `chrome.storage.sync`: the New Tab address, and the on/off state
- No remote code loading - the full source ships inside the installed package, nothing is fetched or evaluated at runtime
- No host permissions of any kind - the extension can't read or modify any website's content, it only opens the one address you chose, the same as typing it yourself
- Full details live in the [Privacy Policy](https://letalab.eu/LetaTab/Privacy_Policy.html), also hosted at [https://LetaLab.eu](https://letalab.eu)

## Known issues and support

LetaTab relies only on Chrome's documented `chrome_url_overrides` API, not a workaround, so there's no equivalent to the undocumented-API risk some other extensions carry.

If another installed extension also overrides the New Tab page, Chrome and Edge only let one override apply at a time - generally whichever one was installed most recently. If your new tab isn't opening where you expect, that's the first thing to check.

Running into that, or anything else that doesn't behave the way it should? Open a thread in [Issues](https://github.com/LetaLab/LetaTab/issues).

## Directory structure

```text
├── leta-tab/
│   ├── manifest.json
│   ├── config.js                fallback New Tab address, used until you set your own
│   ├── newtab.html               the overridden New Tab page
│   ├── redirect.js               reads chrome.storage.sync and redirects, or shows a short message
│   ├── favicon.png / favicon.svg
│   ├── favicon-16.png / favicon-32.png / favicon-128.png
│   ├── popup/
│   │   ├── popup.html
│   │   ├── popup.css
│   │   └── popup.js
│   └── LICENSE
├── Privacy_Policy.html    source for the page hosted at letalab.eu, not part of the extension
└── README.md              this file, not part of the extension
```

## License

MIT - see [`LICENSE`](LICENSE)

## Credits

Built by [LetaLab.eu](https://letalab.eu) - a small collection of tools built for actual daily use.
