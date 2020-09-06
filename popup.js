let windowsSnapshotsTable = document.getElementById('windowsSnapshotsTable');
let resetWindowsSnapshots = document.getElementById('resetWindowsSnapshots');
resetWindowsSnapshots.addEventListener('click', () => {
  chrome.storage.local.set({ windowsSnapshots: [] }, function () { });
});

var windowsSnapshots;

chrome.storage.local.get({ windowsSnapshots: [] }, function (data) {
  windowsSnapshots = data.windowsSnapshots;
  windowsSnapshots.reverse();

  lines = "";
  for (var i = 0; i < windowsSnapshots.length; i++) {
    lines += "<tr>";
    tabs = "(";
    for (var j = 0; j < windowsSnapshots[i].length; j++) {
      if (j) tabs += ", ";
      tabs += windowsSnapshots[i][j].length;
    }
    tabs += ")";
    lines += "<td><button id='ws" + i + "'>" + windowsSnapshots[i].length + " windows " + tabs + " </button></td>";
    lines += "</tr>";
  }

  windowsSnapshotsTable.innerHTML += lines;

  for (var i = 0; i < windowsSnapshots.length; i++) {
    let button = document.getElementById("ws" + i);
    function lol(idx) {
      button.addEventListener('click', () => {
        openWindows(idx);
        // addTextToClipboard(idx);
      });
    };
    lol(i);
  }
});

function openWindows(idx) {
  for (var i = 0; i < windowsSnapshots[idx].length; i++) {
    chrome.extension.getBackgroundPage().createWindow(windowsSnapshots[idx][i]);
  }
}
function addTextToClipboard(idx) {
  navigator.clipboard.writeText(JSON.stringify(windowsSnapshots[idx]));
}