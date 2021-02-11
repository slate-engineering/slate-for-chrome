const InsertJquery = () => {
  console.log('jquery inserted');
}

const LoadApp = () => {
  console.log('sending message')
  //Send message to app/index.js that Slate is loaded
  chrome.tabs.query({ active: true, currentWindow:true },
    function(tabs) {
       var activeTab = tabs[0];
       chrome.tabs.sendMessage(activeTab.id,
           {"message": "clicked_browser_action"}
       );
   });
   console.log('message sent')
}

chrome.runtime.onInstalled.addListener(function (tab) {
  //on new install, open the settings page
  chrome.tabs.create({url: chrome.extension.getURL('app/pages/settings.html')});
});

//Wait for Slate Extension icon to be clicked
chrome.browserAction.onClicked.addListener(function(tabs) {
  console.log(tabs)
  //inject all Slate scripts needed into the current tab
  var activeTab = tabs[0];
  chrome.tabs.executeScript(activeTab, {file: "app/scripts/jquery.min.js"}, InsertJquery());
  chrome.tabs.executeScript(activeTab, {file: "content-script.js"}, LoadApp());
});
