LoadApp = () => {
  //Send message to app/index.js that Slate is loaded
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {
      message: "openSlateApp",
    });
  });
};

chrome.runtime.onInstalled.addListener(function (tab) {
  //on new install, open the welcome page
  chrome.tabs.create({
    url: chrome.extension.getURL("app/pages/welcome.html"),
  });
});

//Wait for Slate Extension icon to be clicked
chrome.browserAction.onClicked.addListener(function (tabs) {
  //inject all Slate scripts needed into the current tab
  let activeTab = tabs[0];
  chrome.tabs.executeScript(activeTab, { file: "app/scripts/jquery.min.js" });
  chrome.tabs.executeScript(
    activeTab,
    { file: "content-script.js" },
    LoadApp()
  );
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.uploadData == "slate") {
    alert("im in the script");
  }
});
