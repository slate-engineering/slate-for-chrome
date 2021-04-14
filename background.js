//Background functions
var SlateBackground = (function () {
  function SlateBackground() {
    //Create background
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
        chrome.storage.local.set({ currentUploads: final }, function () {
          //console.log("saved locally");
        });
      });
      return true;
    };

    removeDataUploadNumber = async () => {
      chrome.storage.local.get(["currentUploads"], (result) => {
        let num = parseInt(result.currentUploads);
        num--;
        chrome.storage.local.set({ currentUploads: num }, function () {
          //console.log("removed upload num");
        });
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
            break; //Stop this loop
          }
        }
        chrome.storage.local.set({ uploads: uploads }, function () {
          //console.log("saved locally");
        });
      });
      return true;
    };

    uploadToSlate = async (fileData, apiData, pageData) => {
      //console.log("file data:", apiData);
      let date = Date.now();
      let uploadData = {
        name: apiData.data.file.file.altTitle || pageData.title,
        type: "image/jpeg",
        source: pageData.source,
        sourceTitle: pageData.title,
        originalFile: apiData.data.file.file.src,
        cid: "",
        date: date,
        url: "",
        uploading: true,
        id: apiData.data.file.file.id,
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
        url = "https://uploads.slate.host/api/public/" + apiData.data.slate.id;
      } else {
        url = "https://uploads.slate.host/api/public";
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
      //Only update metadata if a slate was provided
      if (apiData.data.slate.id) {
        const slateAPIResponseData = {
          data: {
            id: json.slate.id,
            slatename: json.slate.slatename,
            data: {
              ...json.slate.data,
              name: json.slate.slatename,
              public: true,
              objects: [...json.slate.data.objects],
              ownerId: json.slate.data.ownerId,
            },
          },
        };

        const slate = slateAPIResponseData.data;
        let arrPosition = slate.data.objects.length - 1;

        slate.data.objects[arrPosition].source = pageData.source;

        const responseChange = await fetch(
          "https://slate.host/api/v1/update-slate",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Basic " + apiData.data.api,
            },
            body: JSON.stringify({ data: slate }),
          }
        );
        try {
          const jsonChange = await responseChange.json();
        } catch (err) {}
      }
      await removeDataUploadNumber();
      await updateDataUpload(json, uploadData.id);
    };

    getSlateData = async (fileData) => {
      const response = await fetch("https://slate.host/api/v1/get-slate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // NOTE: your API key
          Authorization: "Basic " + fileData.data.api,
        },
        body: JSON.stringify({
          data: {
            id: fileData.data.slate.id,
          },
        }),
      });
      const json = await response.json();
      return json;
    };

    processArray = async (array, pageData) => {
      for (const file of array) {
        let data = await convertToData(file.data.file);
        await uploadToSlate(data, file, pageData);
        //let slateData = await getSlateData(file);
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

chrome.contextMenus.create({
  title: "Slate",
  id: "parent",
  contexts: ["all"],
});

chrome.contextMenus.create({
  title: "Upload to a slate",
  contexts: ["image"],
  parentId: "parent",
  id: "image_slate",
  onclick: onClickHandlerImage,
});

chrome.contextMenus.create({
  title: "Direct upload",
  contexts: ["image"],
  parentId: "parent",
  id: "image_direct",
  onclick: onClickHandlerDirectImage,
});

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
