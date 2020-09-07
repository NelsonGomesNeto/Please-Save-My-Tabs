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
    lines += "<td><button id='cp" + i + "'>Copy</button></td>";
    lines += "<td><button id='prv" + i + "'>Preview</button></td>";
    lines += "</tr>";
  }

  windowsSnapshotsTable.innerHTML += lines;

  for (var i = 0; i < windowsSnapshots.length; i++) {
    let openWindowsButton = document.getElementById("ws" + i);
    let copyButton = document.getElementById("cp" + i);
    let previewButton = document.getElementById("prv" + i);

    function lol(idx, obtn, cbtn, prvbtn) {
      obtn.addEventListener('click', () => {
        openWindows(idx);
      });
      cbtn.addEventListener('click', () => {
        addTextToClipboard(idx);
      });
      prvbtn.addEventListener('click', () => {
        previewSnapshot(idx);
      });
    };
    lol(i, openWindowsButton, copyButton, previewButton);
  }
});

function openWindows(idx) {
  for (var i = 0; i < windowsSnapshots[idx].length; i++) {
    chrome.extension.getBackgroundPage().createWindow(windowsSnapshots[idx][i]);
  }
}
function addTextToClipboard(idx) {
  navigator.clipboard.writeText(JSON.stringify(windowsSnapshots[idx], null, '  '));
}
function previewSnapshot(idx) {
  alert(JSON.stringify(windowsSnapshots[idx], null, '  '));
}