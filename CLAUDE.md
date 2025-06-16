# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chrome extension that automatically adds `lr=lang_ja` parameter to Google search URLs when the search query contains Kanji characters (漢字), prioritizing Japanese language results.

## Key Commands

### Loading the Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select this directory

### Testing

- Load extension and search on Google with queries containing Kanji (e.g., "東京", "日本語")
- Right-click anywhere to toggle the extension ON/OFF via context menu
- Check that `lr=lang_ja` is added to the URL when enabled

### Packaging for Distribution

No build process required - this is a pure JavaScript extension that can be packaged directly:

- Zip the entire directory for Chrome Web Store submission
- Exclude development files using the included `.gitignore`

## Architecture

### Core Components

1. **Content Script (`content.js`)**

   - Runs on Google search result pages
   - Detects Kanji using Unicode ranges: `[\u4E00-\u9FFF\u3400-\u4DBF]`
   - Modifies URL by adding/updating `lr=lang_ja` parameter
   - Checks Chrome storage for enabled/disabled state

2. **Service Worker (`background.js`)**

   - Creates context menu item "日本語優先検索: ON/OFF"
   - Manages extension state in `chrome.storage.sync`
   - Automatically reloads Google search pages when settings are toggled

3. **Manifest (`manifest.json`)**
   - Uses Manifest V3
   - Supports 31 Google domains
   - Permissions: `activeTab`, `contextMenus`, `storage`, `tabs`
   - Includes icon definitions for 16px, 48px, and 128px sizes

### State Management

The extension uses Chrome's sync storage to persist the enabled/disabled state:

- Key: `googleJpSearchEnabled` (boolean)
- Default: `true` (enabled on installation)
- Syncs across user's devices

### URL Modification Logic

1. Only triggers on `/search` paths
2. Extracts query parameter `q`
3. Checks for Kanji presence using Unicode ranges
4. Skips if `lr=lang_ja` already exists
5. Uses `window.location.replace()` to avoid history pollution
6. Respects user's ON/OFF preference from storage

## Common Development Tasks

### Adding New Google Domains

Add new domains to the `matches` array in `manifest.json`:

```json
"matches": [
  "https://www.google.com/*",
  "https://www.google.co.jp/*",
  // Add new domain here
]
```

### Debugging

- Use Chrome DevTools on Google search pages
- Check console for any errors
- Verify storage state: `chrome.storage.sync.get(['googleJpSearchEnabled'], console.log)`

## Store Distribution

This extension is ready for Chrome Web Store publication with:

- Complete icon set (16px, 48px, 128px) in `/icons/`
- Comprehensive README.md with privacy policy
- No external dependencies or build process required
- Manifest V3 compliance

## Known Issues

1. Context menu title shows "日本語優先検索" while some docs mention "日本語優先検索" - this is intentional for UI brevity
