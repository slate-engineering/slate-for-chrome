InsertJquery = () => {
  console.log("jquery inserted");
};

LoadApp = () => {
  //Send message to app/index.js that Slate is loaded
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {
      message: "clicked_browser_action",
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
  console.log(tabs);
  //inject all Slate scripts needed into the current tab
  let activeTab = tabs[0];
  chrome.tabs.executeScript(activeTab, { file: "app/scripts/jquery.min.js" }, InsertJquery());
  chrome.tabs.executeScript(activeTab, { file: "content-script.js" }, LoadApp());
});

//Upload in to Slate in the backgrouind
const Upload = async () => {
  console.log("message recieved in upload");
};

chrome.runtime.onMessage.addListener(async function (request, callback) {
  if (request.message == "upload_to_slate") {
    console.log("in background upload");
  }
});
