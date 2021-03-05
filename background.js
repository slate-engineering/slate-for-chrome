//
//
//Background functions
var SlateBackground = (function () {
  function SlateBackground() {
    //Create app
  }

  SlateBackground.prototype.init = async () => {
    console.log("Initilize slate");
  };

  SlateBackground.prototype.loadApp = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      let activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, {
        message: "openSlateApp",
      });
    });
  };

  SlateBackground.prototype.addUpload = (props) => {
    // add data from upload to history
    console.log(props);
    // TODO: (@jason) props should look like this:
    // {
    //   name: "jim-dark-secrets.png",
    //   type: "image/jpeg",
    //   source: "https://www.criterion.com/shop/collection/169-wes-anderson",
    //   cid: "a238149phsdfaklsjdfhlqw48rlfsad",
    //   date: "2020-10-13T19:49:41.036Z",
    //   url: "https://slate.textile.io/ipfs/bafkreiepfcul4ortkdvxkqe4hfbulggzvlcijkr3mgzfhnbbrcgwlykvxu",
    //   uploading: false,
    //   id: "jasonwillfigureouthowtodotheids"
    // };
    chrome.storage.local.get(["uploads"], (result) => {
      let uploads = result.uploads;
      uploads.push(props);
      chrome.storage.local.set({ uploads });
    });
    return true;
  };

  return SlateBackground;
})();
//
//
//Background event listeners
chrome.runtime.onInstalled.addListener(function (tab) {
  //on new install, open the welcome page
  chrome.tabs.create({
    url: chrome.extension.getURL("app/pages/welcome.html"),
  });
});

//Wait for Slate Extension icon to be clicked
chrome.browserAction.onClicked.addListener(async function (tabs) {
  let slateBg = new SlateBackground();
  await slateBg.init();
  //inject all Slate scripts needed into the current tab
  let activeTab = tabs[0];
  chrome.tabs.executeScript(activeTab, { file: "app/scripts/jquery.min.js" });
  chrome.tabs.executeScript(activeTab, { file: "content-script.js" }, slateBg.loadApp());
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request.uploadData);
  if (request.uploadData == "slate") {
    alert("im in the background");
  }
});
