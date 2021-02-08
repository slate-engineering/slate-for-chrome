//When the Slate icon is clicked, execute the App script
chrome.browserAction.onClicked.addListener(function(tabs) {
  console.log(tabs)
  //inject all scripts needed
  chrome.tabs.executeScript({file: "./app/core/jquery.min.js"});
  chrome.tabs.executeScript({file: "./app/index.js"});
  chrome.tabs.executeScript({file: "./app/core/app.js"});
  chrome.tabs.executeScript({file: "./app/core/scripts.js"});
  chrome.tabs.executeScript({file: "./app/core/page-data.js"});
  //send message to backgorund that button was clicked
  chrome.tabs.query({active: true, currentWindow:true},
    function(tabs) {
     var activeTab = tabs[0];
     chrome.tabs.sendMessage(activeTab.id,
         {"message": "clicked_browser_action"}
     );
   });
});
