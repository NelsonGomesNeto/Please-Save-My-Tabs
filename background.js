function compareWindowsSnapshots(a, b) {
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; i++) {
    if (a[i].length != b[i].length) return false;
    for (var j = 0; j < a[i].length; j++)
      if (a[i][j] != b[i][j])
        return false;
  }
  return true;
}

function updateWindowsSnapshots() {
  chrome.windows.getAll({ populate: true }, function (windows) {
    var windowsSnapshot = [];
    for (var i = 0; i < windows.length; i++) {
      var currentWindow = [];
      for (var j = 0; j < windows[i].tabs.length; j++)
        currentWindow.push(windows[i].tabs[j].url);
      windowsSnapshot.push(currentWindow);
    }

    chrome.storage.local.get({ windowsSnapshots: [] }, function (data) {
      // if (data.windowsSnapshots.length == 0 || !compareWindowsSnapshots(windowsSnapshot, data.windowsSnapshots[data.windowsSnapshots.length - 1]))
      data.windowsSnapshots.push(windowsSnapshot);
      while (data.windowsSnapshots.length > 10)
        data.windowsSnapshots.shift();
      chrome.storage.local.set(data, function () { });
    });
  });
}

var tabsToDiscard = {};
function createWindow(urls) {
  chrome.windows.create({ focused: false, url: urls, state: "minimized" }, (window) => {
    for (var i = 0; i < window.tabs.length; i++)
      tabsToDiscard[window.tabs[i].id] = true;
  });
}
function discardTabs(tabId, changeInfo, tab) {
  if (tabsToDiscard[tabId] == true && changeInfo.url) {
    chrome.tabs.discard(tabId);
    delete tabsToDiscard[tabId];
  }
}

function setup() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: { hostContains: '' },
      })
      ],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });

  // setInterval(updateWindowsSnapshots, 10000);
  chrome.tabs.onCreated.addListener(updateWindowsSnapshots);
  chrome.tabs.onRemoved.addListener(updateWindowsSnapshots);
  chrome.tabs.onDetached.addListener(updateWindowsSnapshots);
  chrome.tabs.onAttached.addListener(updateWindowsSnapshots);
  chrome.windows.onCreated.addListener(updateWindowsSnapshots);
  chrome.windows.onRemoved.addListener(updateWindowsSnapshots);
  chrome.tabs.onUpdated.addListener(discardTabs);
}

chrome.runtime.onInstalled.addListener(() => setup());
chrome.runtime.onStartup.addListener(() => setup());