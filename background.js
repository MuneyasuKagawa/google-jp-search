chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ googleJpSearchEnabled: true });

  chrome.contextMenus.create({
    id: "toggleJapaneseSearch",
    title: "日本語優先検索: ON",
    contexts: ["all"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "toggleJapaneseSearch") {
    chrome.storage.sync.get(["googleJpSearchEnabled"], (result) => {
      const newState = !result.googleJpSearchEnabled;
      chrome.storage.sync.set({ googleJpSearchEnabled: newState });

      chrome.contextMenus.update("toggleJapaneseSearch", {
        title: `日本語優先検索: ${newState ? "ON" : "OFF"}`,
      });
      
      // Googleの検索結果ページの場合は再読み込み
      if (tab && tab.url && tab.url.includes('google.') && tab.url.includes('/search')) {
        chrome.tabs.reload(tab.id);
      }
    });
  }
});
