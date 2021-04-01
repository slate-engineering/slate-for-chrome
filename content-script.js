//App functions
var SlateApp = (function () {
  //set default variables
  this.uploadQueue = [];
  this.uploadQueueNum = 0;
  this.uploadQueueSlates = [];
  this.searchQuery = "tree";
  this.origFiles = [];
  this.currentUploadNum = 0;

  this.pageData = {
    title: document.title,
    source: window.location.href,
  };

  function SlateApp() {
    //Create app
  }

  SlateApp.prototype.init = async () => {
    checkUploadStatus = async (id) => {
      //console.log(id);
      chrome.storage.local.get(["uploads"], (result) => {
        let find = result.uploads.find((x) => x.id === id);
        if (find) {
          if (!find.uploading) {
            return;
          } else {
            console.log("done from id: ", id);
            let spinner = document.getElementById(id + "-spinner");
            spinner.classList.remove("slate-loaderspinner");
            spinner.classList.add("slate-success");
            spinner.innerHTML =
              '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg>';
            return;
          }
        }
        /*
        if (result.uploads == null) {
          let uploads = [];
          chrome.storage.local.set({ uploads: uploads });
        }
        */
      });
    };

    loadUploads = async (files) => {
      files.map((item) => {
        let div = document.createElement("div");
        div.className = "slate-upload-file-module";
        let container = document.createElement("div");
        container.className = "slate-upload-file";
        let spinner = document.createElement("div");
        spinner.className = "slate-loaderspinner";
        spinner.id = item.file.id + "-spinner";
        let fileName = document.createElement("div");
        fileName.className = "slate-upload-file-name";
        fileName.innerHTML = item.file.altTitle || "No title";

        div.appendChild(container);
        container.appendChild(spinner);
        container.appendChild(fileName);
        document.getElementById("slate-upload-file-modules").appendChild(div);
      });

      setInterval(function () {
        let result = uploadQueue.map((a) => a.file.id);
        for (let i = 0; i < result.length; i++) {
          let id = result[i];
          checkUploadStatus(id);
        }
      }, 3000);

      //console.log('All page files: ', files);
    };

    async function insertAppMain() {
      try {
        document.head.parentNode.removeChild(document.head);

        $.get(chrome.extension.getURL("./app/pages/app.html"), function (data) {
          $(data).prependTo("body");
        })
          .done(function () {
            //Initilize app event listeners
            document
              .getElementById("slate-close-icon")
              .addEventListener("click", function () {
                location.reload();
              });
            //Listen for settings icon click
            document
              .getElementById("slate-settings-icon")
              .addEventListener("click", function () {
                chrome.runtime.sendMessage({
                  message: "settings",
                });
              });
            //Listen for uploads icon click
            document
              .getElementById("slate-uploads-icon")
              .addEventListener("click", function () {
                chrome.runtime.sendMessage({
                  message: "uploadsHistory",
                });
              });
            //Listen for select all click
            document
              .getElementById("select-all-check")
              .addEventListener("click", function () {
                uploadQueue = origFiles;
                uploadQueueNum = origFiles.length;
                document
                  .getElementById("actual-select-all-check")
                  .classList.toggle("checked");
                for (let i = 0; i < uploadQueue.length; i++) {
                  //console.log(uploadQueue[i].file.id);
                  let checkbox = document.getElementById(
                    "check-" + uploadQueue[i].file.id
                  );
                  let customCheck = document.getElementById(
                    "customCheck-" + uploadQueue[i].file.id
                  );

                  let img = document.getElementById(
                    "img-item-" + uploadQueue[i].file.id
                  );
                  let customCheckIcon = customCheck.childNodes[0];
                  checkbox.checked = true;
                  customCheck.className = "slate-custom-checkbox checked";
                  customCheckIcon.classList.add("checked");
                  img.classList.add("selected");
                }

                document
                  .getElementById("slate-upload-btn")
                  .classList.remove("disabled");

                if (this.uploadQueueNum == 1) {
                  document.getElementById("slate-popup-title-name").innerHTML =
                    "Upload 1 file to Slate";
                } else {
                  document.getElementById("slate-popup-title-name").innerHTML =
                    "Upload " + uploadQueueNum + " files to Slate";
                }
                //console.log("queue:", uploadQueue);
              });

            document
              .getElementById("slate-uploads-back-icon")
              .addEventListener("click", function () {
                document
                  .getElementById("slate-drawer-upload")
                  .classList.toggle("active");
                document
                  .getElementById("slate-drawer-upload-progress")
                  .classList.toggle("active");
              });

            document
              .getElementById("slate-upload-btn")
              .addEventListener("click", function () {
                //console.log("Upload queue:", uploadQueue);
                var isUploadQueue = JSON.stringify(uploadQueue);
                var isPageTitle = JSON.stringify(pageData);
                var isApiData = JSON.stringify(uploadQueueSlates);

                //console.log("Page data:", isPageTitle);

                chrome.runtime.sendMessage({
                  uploadData: "slate",
                  data: isUploadQueue,
                  page: isPageTitle,
                  api: isApiData,
                });

                document
                  .getElementById("slate-drawer-upload")
                  .classList.toggle("active");
                document.getElementById(
                  "slate-uploads-back-icon"
                ).style.display = "inline";
                document
                  .getElementById("slate-drawer-upload-progress")
                  .classList.toggle("active");

                loadUploads(uploadQueue);
              });

            return true;
            //
            //
            //End app listeners
          })
          .fail(function () {
            return false;
          });
        return true;
      } catch (error) {
        console.error(error);
      }
    }

    insertAppMain();
  };

  SlateApp.prototype.getPageFiles = async () => {
    let allFiles = [];
    let filesArray = [];
    let fetchImages = $("body")
      .find("img")
      .map(function () {
        return this;
      })
      .get();
    Array.prototype.map.call(fetchImages, function (i) {
      allFiles.push(i);
    });
    let position = 0;
    for (let i = 0; i < allFiles.length; i++) {
      position++;
      const id = Math.random().toString(36).substr(2, 9);
      const type = "img";
      if (allFiles[i].naturalWidth > 100) {
        filesArray.push({
          id: id,
          src: allFiles[i].src,
          altTitle: allFiles[i].alt || null,
          type: type,
          page_position: position,
          width: allFiles[i].naturalwidth,
          height: allFiles[i].naturalHeight,
        });
      }
    }
    return filesArray;
  };

  SlateApp.prototype.getPageData = async () => {
    this.pageData.title = document.title;
    this.pageData.source = window.location.href;
    return pageData;
  };

  SlateApp.prototype.listFiles = async (
    props,
    apiKeys,
    isUploading,
    uploadType
  ) => {
    try {
      $.getScript(chrome.extension.getURL("./app/index.js"), function (data) {
        $(data).append("body");
      })
        .done(function () {
          if (uploadType == "single") {
            uploadQueue.push({ file: props });
            console.log("props!", props);
            console.log("Upload queue if its a single:", uploadQueue);
            let singleImg = (document.getElementById("slate-single-image").src =
              props.src);
            document.getElementById("slate-action-bar").style.display = "none";
            document.getElementById("slate-page-images").style.display = "none";
            document
              .getElementById("slate-upload-btn")
              .classList.remove("disabled");

            document.getElementById("slate-popup-title-name").innerHTML =
              "Upload file to Slate";
          } else {
            props.forEach(function (file) {
              document.getElementById(
                "slate-single-image-container"
              ).style.display = "none";
              let div = document.createElement("div");
              div.className = "slate-img-container slate-masonry-item";
              div.id = "img-item-" + file.id;
              let img = document.createElement("img");
              img.className = "slate-list_img";
              img.id = "img-" + file.id;
              if (file.type == "img") {
                img.src = file.src;
              }

              let checkbox = document.createElement("input");
              checkbox.setAttribute("type", "checkbox");
              checkbox.value = file.src;
              checkbox.className = "slate-img-checkbox";
              checkbox.id = "check-" + file.id;

              let customCheckbox = document.createElement("div");
              customCheckbox.className = "slate-custom-checkbox";
              customCheckbox.id = "customCheck-" + file.id;

              customCheckbox.innerHTML =
                '<svg class="slate-custom-checkbox-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';

              div.onclick = async () => {
                console.log("File added to queue: ", this.uploadQueue);
                let customCheckIcon = customCheckbox.childNodes[0];
                if (!checkbox.checked) {
                  checkbox.checked = true;
                  customCheckbox.className = "slate-custom-checkbox checked";
                  customCheckIcon.classList.add("checked");
                  img.classList.add("selected");
                  div.classList.add("selected");
                  this.uploadQueue.push({ file });
                  this.uploadQueueNum++;
                } else {
                  checkbox.checked = false;
                  customCheckbox.className = "slate-custom-checkbox";
                  customCheckIcon.classList.remove("checked");
                  img.classList.remove("selected");
                  div.classList.remove("selected");
                  //console.log(file.id);
                  var objIndex = this.uploadQueue.findIndex(
                    (obj) => obj.file.id === file.id
                  );

                  //console.log("objIndex", objIndex);
                  const updatedQueue = this.uploadQueue.splice(objIndex, 1);
                  this.uploadQueueNum--;
                  //this.uploadQueue = updatedQueue;
                  //console.log("final upload queue", this.uploadQueue);
                }
                if (this.uploadQueueNum > 0) {
                  document
                    .getElementById("slate-upload-btn")
                    .classList.remove("disabled");

                  if (this.uploadQueueNum == 1) {
                    document.getElementById(
                      "slate-popup-title-name"
                    ).innerHTML = "Upload 1 file to Slate";
                  } else {
                    document.getElementById(
                      "slate-popup-title-name"
                    ).innerHTML =
                      "Upload " + this.uploadQueueNum + " files to Slate";
                  }
                }
                //await SelectFile(item);
              };

              div.appendChild(checkbox);
              div.appendChild(img);
              div.appendChild(customCheckbox);
              document.getElementById("slate-image-grid").appendChild(div);
            });
          }
          //
          //
          //UPLOAD ALERT BOX
          //ONLY DISPLAY WHEN THERE IS AN ACTIVE UPLOAD
          if (isUploading.currentUploads > 0) {
            document.getElementById("slate-upload-alert").style.display =
              "inline-block";
            document.getElementById("slate-upload-alert-text").innerHTML =
              "Uploading";
            setInterval(async function () {
              document.getElementById("slate-upload-alert-text").innerHTML =
                "Uploading " + currentUploadNum.currentUploads + " files";

              if (currentUploadNum.currentUploads == 1) {
                document.getElementById("slate-upload-alert-text").innerHTML =
                  "Uploading 1 file";
              } else if (currentUploadNum.currentUploads == 0) {
                document.getElementById("slate-upload-alert-text").innerHTML =
                  "Done!";
                document.getElementById("slate-upload-alert").style.background =
                  "#C0DACD";
                document.getElementById("slate-upload-alert").style.color =
                  "#006837";
                document.getElementById("slate-uploading-icon").style.display =
                  "none";
              } else {
                document.getElementById("slate-upload-alert-text").innerHTML =
                  "Uploading " + currentUploadNum.currentUploads + " files";
              }
            }, 3000);
          }
          //
          //
          //CREATE API KEY UI
          //console.log("Slates from api keys: ", apiKeys);
          apiKeys.forEach(function (slate) {
            //console.log("Slate info: ", slate);

            var slateApiContainer = document.createElement("div");
            slateApiContainer.className = "slate-api";
            slateApiContainer.id = "slate-" + slate.data.name;
            slateApiDisplay = document.createElement("div");
            slateApiDisplay.className = "slate-item-display";

            slateApiContainer.onclick = () => {
              slateApiDisplay.classList.toggle("slate-item-display");
            };

            var slateDropdownButton = document.createElement("div");
            slateDropdownButton.className = "slate-dropdown-button";

            var slateName = document.createElement("div");
            slateName.className = "slate-name";

            var slateProfile = document.createElement("div");
            slateProfile.className = "slate-profile a";
            slateProfile.setAttribute(
              "style",
              "background-image: url('" + slate.data.photo + "') !important;"
            );

            var slateNameText = document.createElement("div");
            slateNameText.innerHTML = slate.data.name;

            slateName.appendChild(slateProfile);
            slateName.appendChild(slateNameText);
            slateDropdownButton.appendChild(slateName);
            slateApiContainer.appendChild(slateDropdownButton);
            document
              .getElementById("list-slates")
              .appendChild(slateApiContainer);

            //let mySlates = await getSlates(slate.data.key)
            //console.log('my slates:::::', mySlates)
            slate.slates.forEach((item, i) => {
              let slateContainer = document.createElement("div");
              slateContainer.className = "slate-item";
              //slateContainer.setAttribute("data-slateId", slate.id);
              slateContainer.onclick = async () => {
                let slateArray = uploadQueue.map((fileData) => {
                  //console.log("slate: ", slate);
                  let data = {
                    api: slate.data.key,
                    slate: item,
                    file: fileData,
                  };
                  this.uploadQueueSlates.push({ data });
                  return data;
                });

                //this.uploadQueueSlates.push({ slateData });
                //console.log("Slate added to queue: ", this.uploadQueueSlates);
                slateContainer.classList.toggle("slate-selected");
              };

              let slateIcon = document.createElement("div");
              slateIcon.innerHTML =
                '<svg id="not-selected" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>';
              let slateName = document.createElement("div");
              slateName.innerHTML = item.slatename;
              slateContainer.appendChild(slateIcon);
              slateContainer.appendChild(slateName);
              document
                .getElementById("slate-" + slate.data.name)
                .appendChild(slateContainer);
            });
          });

          return true;
        })
        .fail(function () {
          return false;
        });
      return true;
    } catch (error) {
      console.error(error);
    }
  };

  SlateApp.prototype.getSlates = async (props) => {
    const response = await fetch("https://slate.host/api/v1/get", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // NOTE: your API key
        Authorization: "Basic " + props,
      },
      body: JSON.stringify({
        data: {
          // NOTE: optional, if you want your private slates too.
          private: true,
        },
      }),
    });
    const data = await response.json();
    //console.log("Response data: ", data);

    return data;
  };

  SlateApp.prototype.getApiKeys = async () => {
    async function getKey(key) {
      const response = await fetch("https://slate.host/api/v1/get", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // NOTE: your API key
          Authorization: "Basic " + key,
        },
        body: JSON.stringify({
          data: {
            // NOTE: optional, if you want your private slates too.
            private: true,
          },
        }),
      });
      const data = await response.json();
      let slates = [];
      //for (let item of data.slates) {
      //await getKey();
      //slates.push({ id: item.id, name: item.slatename });
      //}
      return data;
    }

    var storage = new Promise(function (resolve, reject) {
      chrome.storage.local.get(["apis"], function (result) {
        resolve(result);
      });
    });

    const getAPIKeys = await storage;
    //console.log("getAPIKeys", getAPIKeys.apis);
    var finalApiArray = [];

    if (getAPIKeys.apis) {
      for (let item of getAPIKeys.apis) {
        //console.log("item 123", item);
        let keyData = await getKey(item.data.key);

        finalApiArray.push({ data: item.data, slates: keyData.slates });
        //console.log("keyData", keyData);
        //slates.push({ id: item.id, name: item.slatename });
      }
    }

    return finalApiArray;
  };

  SlateApp.prototype.getUploadNum = async () => {
    var storage = new Promise(function (resolve, reject) {
      chrome.storage.local.get(["currentUploads"], function (result) {
        resolve(result);
      });
    });
    let getData = await storage;
    return getData;
  };

  SlateApp.prototype.getUploads = async () => {
    var storage = new Promise(function (resolve, reject) {
      chrome.storage.local.get(["uploads"], function (result) {
        resolve(result);
      });
    });

    let getData = await storage;
    const result = getData.uploads.filter((file) => file.uploading == true);
    return result;
  };

  return SlateApp;
})();

//
//
//App event listeners
var app = new SlateApp();
chrome.runtime.onMessage.addListener(async function (
  request,
  changeInfo,
  callback
) {
  if (request.message == "openSlateApp") {
    //required order
    //console.log("type:", request.uploadType);
    await app.init();
    var isUploading = await app.getUploadNum();
    //console.log("isUploading: ", isUploading.currentUploads);
    if (isUploading.currentUploads > 0) {
      const isCheckUploads = setInterval(async function () {
        currentUploadNum = await app.getUploadNum();
        if (currentUploadNum == 0) {
          clearInterval(isCheckUploads);
        }
      }, 3000);
    }
    let apiKeys = await app.getApiKeys();
    await app.getPageData();

    var allPageFiles = [];
    var type = request.uploadType;
    if (type == "single") {
      allPageFiles = {
        src: request.singleImageUrl,
        altTitle: null,
        height: "656",
        id: "yvrzkmxnb",
        page_position: 17,
        type: "img",
        width: 12,
      };
    } else {
      allPageFiles = await app.getPageFiles();
      for (let i = 0; i < allPageFiles.length; i++) {
        origFiles.push({ file: allPageFiles[i] });
      }
    }
    //console.log("allPageFiles::", allPageFiles);

    //let slates = "await app.getSlates(apiKeys);";
    await app.listFiles(allPageFiles, apiKeys, isUploading, type);
    //Add below:
  }
});
