function containsKanji(text) {
  const kanjiRegex = /[\u4E00-\u9FFF\u3400-\u4DBF]/;
  return kanjiRegex.test(text);
}

function updateUrlWithLangJa() {
  const currentUrl = new URL(window.location.href);
  const searchParams = currentUrl.searchParams;

  const searchQuery = searchParams.get("q");

  if (!searchQuery) {
    return;
  }

  if (!containsKanji(searchQuery)) {
    return;
  }

  const currentLr = searchParams.get("lr");
  if (currentLr === "lang_ja") {
    return;
  }

  searchParams.set("lr", "lang_ja");

  const newUrl = currentUrl.toString();

  if (newUrl !== window.location.href) {
    window.location.replace(newUrl);
  }
}

if (
  window.location.pathname === "/search" ||
  window.location.pathname.startsWith("/search")
) {
  chrome.storage.sync.get(["googleJpSearchEnabled"], (result) => {
    if (result.googleJpSearchEnabled !== false) {
      updateUrlWithLangJa();
    }
  });
}
