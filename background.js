function InsertJquery(resultsArray) {
  console.log('jquery:', resultsArray)
  alert('done jquery')
}

function InsertHtml(resultsArray) {
  console.log(resultsArray)
  alert('sending html message')
  chrome.tabs.query({active: true, currentWindow:true},
    function(tabs) {
       var activeTab = tabs[0];
       chrome.tabs.sendMessage(activeTab.id,
           {"message": "clicked_browser_action"}
       );
   });
   alert('done html message')
}


//Wait for Slate Extension icon to be clicked
chrome.browserAction.onClicked.addListener(function(tabs) {
  console.log(tabs)
  //inject all Slate scripts needed into the current tab
  var activeTab = tabs[0];
  chrome.tabs.executeScript(activeTab, {file: "app/core/jquery.min.js"}, InsertJquery());
  chrome.tabs.executeScript(activeTab, {file: "content-script.js"}, InsertHtml());

  //chrome.tabs.executeScript({file: "./app/index.js"}, InsertHtml);
  //send message to backgorund that the Slate button was clicked
});
