const MENU_ITEM_PREFIX = "reverse_image_search:";

const ENGINES = [
  {
    id: "yandex",
    title: "使用 yandex.com 进行搜图",
    buildUrl: (srcUrl) =>
      `https://yandex.com/images/search?rpt=imageview&url=${encodeURIComponent(srcUrl)}`
  },
  {
    id: "saucenao",
    title: "使用 SauceNAO 进行搜图",
    buildUrl: (srcUrl) =>
      `https://saucenao.com/search.php?url=${encodeURIComponent(srcUrl)}`
  },
  {
    id: "iqdb",
    title: "使用 IQDB 进行搜图",
    buildUrl: (srcUrl) => `https://iqdb.org/?url=${encodeURIComponent(srcUrl)}`
  },
  {
    id: "google",
    title: "使用 Google 进行搜图",
    buildUrl: (srcUrl) =>
      `https://lens.google.com/uploadbyurl?url=${encodeURIComponent(srcUrl)}`
  }
];

const ENGINE_BY_ID = Object.fromEntries(ENGINES.map((engine) => [engine.id, engine]));

let menuRebuildInProgress = false;
let menuRebuildQueued = false;

function requestEnsureMenu() {
  if (menuRebuildInProgress) {
    menuRebuildQueued = true;
    return;
  }
  menuRebuildInProgress = true;
  menuRebuildQueued = false;
  chrome.contextMenus.removeAll(() => {
    for (const engine of ENGINES) {
      chrome.contextMenus.create(
        {
          id: `${MENU_ITEM_PREFIX}${engine.id}`,
          title: engine.title,
          contexts: ["image"]
        },
        () => {
          void chrome.runtime.lastError;
        }
      );
    }

    menuRebuildInProgress = false;
    if (menuRebuildQueued) requestEnsureMenu();
  });
}

chrome.runtime.onInstalled.addListener(() => {
  requestEnsureMenu();
});

chrome.runtime.onStartup?.addListener(() => {
  requestEnsureMenu();
});

requestEnsureMenu();

chrome.contextMenus.onClicked.addListener((info, tab) => {
  const srcUrl = String(info.srcUrl || "");
  if (!srcUrl) return;

  const menuItemId = String(info.menuItemId || "");
  if (!menuItemId.startsWith(MENU_ITEM_PREFIX)) return;

  const engineId = menuItemId.slice(MENU_ITEM_PREFIX.length);
  const engine = ENGINE_BY_ID[engineId];
  const targetUrl = engine?.buildUrl(srcUrl) || "";
  if (!targetUrl) return;
  chrome.tabs.create({
    url: targetUrl,
    active: true,
    index: typeof tab?.index === "number" ? tab.index + 1 : undefined
  });
});
