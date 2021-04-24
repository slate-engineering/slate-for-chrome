//Background functions
var SlateBackground = (function () {
  function SlateBackground() {
    //Create background
    this.isLoaded = false;
  }

  SlateBackground.prototype.init = async () => {
    console.log("Initilize slate");
  };

  SlateBackground.prototype.loadApp = (type, singleImageUrl = "") => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      let activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, {
        message: "openSlateApp",
        uploadType: type,
        singleImageUrl: singleImageUrl,
      });
    });
  };

  SlateBackground.prototype.addUpload = (props) => {
    chrome.storage.local.get(["uploads"], (result) => {
      let uploads = [];
      if (result.uploads) {
        uploads.push(props);
      } else {
        uploads = props;
      }

      chrome.storage.local.set({ uploads: uploads });
    });
    return true;
  };

  return SlateBackground;
})();

//Background functions
var SlateUpload = (function () {
  function SlateUpload() {
    //Create background
  }

  SlateUpload.prototype.start = async (props, pageData, numFiles) => {
    convertToData = async (props) => {
      return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
          var reader = new FileReader();
          reader.onloadend = function () {
            resolve(reader.result);
          };
          reader.readAsDataURL(xhr.response);
        };
        xhr.open("GET", props.file.src);
        xhr.responseType = "blob";
        //console.log("done convert");
        xhr.send();
      });
    };

    addDataUpload = (props) => {
      //console.log("upload prop structure", props);
      chrome.storage.local.get(["uploads"], (result) => {
        let uploads = [];
        if (result["uploads"]) {
          uploads = result["uploads"];
          uploads.push(props);
        } else {
          uploads = props;
        }

        chrome.storage.local.set({ uploads: uploads });
      });
      //console.log("done");
      return true;
    };

    addDataUploadNumber = async (props) => {
      chrome.storage.local.get(["currentUploads"], (result) => {
        let num = parseInt(result.currentUploads);
        let curr = parseInt(props);
        let final = num + curr;
        chrome.storage.local.set({ currentUploads: final });
      });
      return true;
    };

    removeDataUploadNumber = async () => {
      chrome.storage.local.get(["currentUploads"], (result) => {
        let num = parseInt(result.currentUploads);
        if (num == 0 || num < 0) {
          num = 0;
        } else {
          num--;
        }
        chrome.storage.local.set({ currentUploads: num });
      });
      return true;
    };

    updateDataUpload = async (props, uploadId) => {
      //console.log("look at props", props);
      chrome.storage.local.get(["uploads"], (result) => {
        let uploads = result.uploads;

        for (var i in uploads) {
          if (uploads[i].id == uploadId) {
            uploads[i].uploading = false;
            uploads[i].cid = props.data.cid;
            uploads[i].url = props.url;
          }
        }
        chrome.storage.local.set({ uploads: uploads });
      });
      return true;
    };

    updateDataError = async (uploadId) => {
      //console.log("look at props", props);
      chrome.storage.local.get(["uploads"], (result) => {
        let uploads = result.uploads;

        for (var i in uploads) {
          if (uploads[i].id == uploadId) {
            uploads[i].uploading = "error";
          }
        }
        chrome.storage.local.set({ uploads: uploads });
      });
      return true;
    };

    uploadToSlate = async (fileData, apiData, pageData) => {
      //console.log("file data:", apiData);
      let date = Date.now();
      let isSlateUpload;
      //console.log("apidata", apiData);
      if (!apiData.data.slate.id) {
        isSlateUpload = "https://slate.host/_?scene=NAV_DATA";
      } else {
        isSlateUpload = apiData.data.slate.data.url;
      }
      //console.log("isSlateUpload", isSlateUpload);

      let checkPageData = pageData.title;
      if (!pageData.title) {
        checkPageData = "No title found";
      }

      let uploadData = {
        name: apiData.data.file.file.altTitle || checkPageData,
        type: "image/jpeg",
        source: pageData.source,
        sourceTitle: checkPageData,
        originalFile: apiData.data.file.file.src,
        cid: "",
        date: date,
        url: "",
        uploading: true,
        id: apiData.data.file.file.id,
        slateUrl: isSlateUpload,
      };

      await addDataUpload(uploadData);

      var arr = fileData.split(","),
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      var mime = fileData.split(",")[0].split(":")[1].split(";")[0];

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      var url;
      if (apiData.data.slate.id) {
        url =
          "https://uploads.slate.host/api/v2/public/" + apiData.data.slate.id;
      } else {
        url = "https://uploads.slate.host/api/v2/public";
      }

      let fileBlob = new Blob([u8arr], { mime });
      let source = "";
      let file = new File([fileBlob], uploadData.name, { type: "image/png" });
      let data = new FormData();
      data.append("data", file);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: "Basic " + apiData.data.api,
        },
        body: data,
      });

      const json = await response.json();
      //
      //
      //UPDATE METADATA
      const fileMeta = json.data;
      fileMeta.data.name = uploadData.name;
      fileMeta.data.source = pageData.source;
      //console.log(fileMeta);

      const responseMeta = await fetch(
        "https://slate.host/api/v2/update-file",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Basic " + apiData.data.api,
          },
          body: JSON.stringify({ data: fileMeta }),
        }
      );
      console.log("done upload");
      await removeDataUploadNumber();
      await updateDataUpload(json, uploadData.id);
    };

    const delay = async (ms) => new Promise((res) => setTimeout(res, ms));

    processArray = async (array, pageData) => {
      var pos = 0;
      for (const file of array) {
        pos++;
        //console.log("pos: ", pos);
        if (pos == 3) {
          await delay(10000);
          console.log("delay done");
          pos = 0;
        }
        //console.log("array: ", array[0].data.file.file.id);
        let data = await convertToData(file.data.file);
        await uploadToSlate(data, file, pageData);

        console.log("Next file");
      }
      console.log("All files uploaded");
    };

    addDataUploadNumber(numFiles);
    processArray(props, pageData);
  };
  return SlateUpload;
})();

//Background event listeners
chrome.runtime.onInstalled.addListener((tab) => {
  //on new install, open the welcome page
  chrome.tabs.create({
    url: chrome.extension.getURL("app/pages/welcome.html"),
  });
});

onClickHandlerAll = async (tab) => {
  let slateBg = new SlateBackground();
  await slateBg.init();
  //inject all Slate scripts needed into the current tab
  //let activeTab = tabs[0];

  let type = "multi";
  chrome.tabs.executeScript(tab, { file: "app/scripts/jquery.min.js" });
  chrome.tabs.executeScript(
    tab,
    { file: "content-script.js" },
    slateBg.loadApp(type)
  );
  this.isLoaded = true;
};

onClickHandlerImage = async (info, tabs) => {
  url = info.srcUrl;
  let slateBg = new SlateBackground();
  await slateBg.init();
  let activeTab = tabs[0];

  //inject all Slate scripts needed into the current tab
  let type = "single";
  chrome.tabs.executeScript(activeTab, { file: "app/scripts/jquery.min.js" });
  chrome.tabs.executeScript(
    activeTab,
    { file: "content-script.js" },
    slateBg.loadApp(type, url)
  );
};

onClickHandlerDirectImage = async (info, tabs) => {
  url = info.srcUrl;

  var storage = new Promise((resolve, reject) => {
    chrome.storage.local.get(["apis"], (result) => {
      resolve(result);
    });
  });

  const getAPIKeys = await storage;

  let id = Math.random().toString(36).substr(2, 9);
  let apiData = [
    {
      data: {
        api: getAPIKeys.apis[0].data.key,
        file: {
          file: {
            id: id,
            src: url,
            page_position: null,
            altTitle: null,
            height: null,
            width: null,
            type: "img",
          },
        },
        slate: {
          id: null,
        },
      },
    },
  ];

  pageData = {
    title: tabs.title,
    source: info.pageUrl,
  };

  let upload = new SlateUpload();
  upload.start(apiData, pageData, 1);
};

onClickHandlerScreenshot = async (info, tabs) => {};

chrome.contextMenus.create({
  title: "Slate",
  id: "parent",
  contexts: ["all"],
  onclick: onClickHandlerAll,
});

chrome.contextMenus.create({
  title: "Upload to a slate",
  contexts: ["image"],
  parentId: "parent",
  id: "image_slate",
  onclick: onClickHandlerImage,
});

chrome.contextMenus.create({
  title: "Upload",
  contexts: ["image"],
  parentId: "parent",
  id: "image_direct",
  onclick: onClickHandlerDirectImage,
});

/*
chrome.contextMenus.create({
  title: "Take screenshot",
  contexts: ["all"],
  parentId: "parent",
  id: "screenshot",
  onclick: onClickHandlerDirectImage,
});
*/

chrome.commands.onCommand.addListener(function (command) {
  if (command === "openSlate") {
    onClickHandlerAll();
  }
});

//Wait for Slate Extension icon to be clicked
chrome.browserAction.onClicked.addListener(async (tabs) => {
  onClickHandlerAll();
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.message == "settings") {
    chrome.tabs.create({
      url: chrome.extension.getURL("app/pages/settings.html"),
    });
  }

  if (request.message == "uploadsHistory") {
    chrome.tabs.create({
      url: chrome.extension.getURL("app/pages/uploads.html"),
    });
  }

  if (request.uploadData == "slate") {
    let upload = new SlateUpload();
    let files = JSON.parse(request.data);
    let pageData = JSON.parse(request.page);
    let apiData = JSON.parse(request.api);
    upload.start(apiData, pageData, files.length);
  }
});
