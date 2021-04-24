//App functions
var SlateApp = (function () {
  //set default variables
  this.uploadQueue = [];
  this.uploadQueueNum = 0;
  this.uploadQueueSlates = [];
  this.origFiles = [];
  this.currentUploadNum = 0;

  //timeouts
  this.isCheckUploads = null;
  this.isCheckUploadsQueue = null;
  this.isSuccessfulUploads = 0;

  this.loaded = false;

  this.pageData = {
    title: document.title,
    source: window.location.href,
  };

  function SlateApp() {
    //Create app
  }

  SlateApp.prototype.init = async () => {
    checkUploadStatus = async (id) => {
      chrome.storage.local.get(["uploads"], (result) => {
        var isIdUploading;
        if (result.uploads.length > 0) {
          isIdUploading = result.uploads.find((x) => x.id === id);
        }
        if (isIdUploading) {
          if (isIdUploading.uploading == "error") {
            let spinner = document.getElementById(id + "-spinner");
            spinner.classList.remove("slate-loaderspinner");
            spinner.classList.add("slate-error");
            spinner.innerHTML =
              '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
            const hi = "1";
            return;
          } else if (isIdUploading.uploading) {
            return;
          } else {
            //console.log("done: ", isIdUploading);
            this.isSuccessfulUploads++;
            let spinner = document.getElementById(id + "-spinner");
            spinner.classList.remove("slate-loaderspinner");
            spinner.classList.add("slate-success");
            spinner.innerHTML =
              '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg>';

            let divClick = document.getElementById(
              "slate-upload-contatiner-" + id
            );
            divClick.classList.add("slate-add-link");
            divClick.onclick = function () {
              let pathname =
                isIdUploading.slateUrl + "/cid:" + isIdUploading.cid;
              let win = window.open(pathname, "_blank");
              win.focus();
            };
            return;
          }
        }
      });
    };

    loadUploads = async (files) => {
      files.map((item) => {
        let div = document.createElement("div");
        div.className = "slate-upload-file-module";
        div.id = "slate-upload-contatiner-" + item.file.id;
        let container = document.createElement("div");
        container.className = "slate-upload-file";
        let spinner = document.createElement("div");
        spinner.className = "slate-loaderspinner";
        spinner.id = item.file.id + "-spinner";
        let fileName = document.createElement("div");
        fileName.className = "slate-upload-file-name";
        fileName.innerHTML =
          item.file.altTitle || this.pageData.title || "No title";

        div.appendChild(container);
        container.appendChild(spinner);
        container.appendChild(fileName);
        document.getElementById("slate-upload-file-modules").appendChild(div);
      });

      this.isCheckUploadsQueue = setInterval(async () => {
        let isUploadIds = uploadQueue.map((x) => x.file.id);
        for (let i = 0; i < isUploadIds.length; i++) {
          let id = isUploadIds[i];
          await checkUploadStatus(id);
        }
      }, 1000);
    };

    insertAppMain = async () => {
      try {
        //document.head.parentNode.removeChild(document.head);
        $.get(chrome.extension.getURL("./app/pages/app.html"), (data) => {
          $(data).prependTo("body");
        })
          .done(() => {
            //Initilize app event listeners
            document.getElementById("slate-app").style.display = "inline";

            document
              .getElementById("slate-close-icon")
              .addEventListener("click", () => {
                location.reload();
                document.getElementById("slate-app").style.display = "none";
              });

            document.onkeydown = function (evt) {
              evt = evt || window.event;
              var isEscape = false;
              if ("key" in evt) {
                isEscape = evt.key === "Escape" || evt.key === "Esc";
              } else {
                isEscape = evt.keyCode === 27;
              }
              if (isEscape) {
                location.reload();
              }
            };
            //Listen for settings icon click
            document
              .getElementById("slate-settings-icon")
              .addEventListener("click", () => {
                chrome.runtime.sendMessage({
                  message: "settings",
                });
              });
            //Listen for uploads icon click
            document
              .getElementById("slate-uploads-icon")
              .addEventListener("click", () => {
                chrome.runtime.sendMessage({
                  message: "uploadsHistory",
                });
              });
            //Listen for select all click
            document
              .getElementById("select-all-check")
              .addEventListener("click", () => {
                uploadQueue = origFiles;
                uploadQueueNum = origFiles.length;
                let isChecked = document
                  .getElementById("actual-select-all-check")
                  .classList.contains("checked");
                if (isChecked) {
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
                    checkbox.checked = false;
                    customCheck.className = "slate-custom-checkbox";
                    customCheckIcon.classList.remove("checked");
                    img.classList.remove("selected");
                  }
                  document
                    .getElementById("slate-upload-btn")
                    .classList.add("disabled");
                  uploadQueue = [];
                  uploadQueueNum = 0;
                  document.getElementById("slate-popup-title-name").innerHTML =
                    "Select a file to upload";
                  console.log(uploadQueue);
                } else {
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
                  /*
                  document
                    .getElementById("slate-upload-btn")
                    .classList.remove("disabled");
                  */
                  if (this.uploadQueueNum == 1) {
                    document.getElementById(
                      "slate-popup-title-name"
                    ).innerHTML = "Upload 1 file to Slate";
                  } else {
                    document.getElementById(
                      "slate-popup-title-name"
                    ).innerHTML =
                      "Upload " + uploadQueueNum + " files to Slate";
                  }
                  console.log(uploadQueue);
                }
                //console.log("queue:", uploadQueue);
              });

            document
              .getElementById("slate-uploads-back-icon")
              .addEventListener("click", () => {
                document
                  .getElementById("slate-drawer-upload")
                  .classList.toggle("active");
                document
                  .getElementById("slate-drawer-upload-progress")
                  .classList.toggle("active");
              });

            document
              .getElementById("slate-upload-btn")
              .addEventListener("click", () => {
                let isDisabled = document
                  .getElementById("slate-upload-btn")
                  .classList.contains("disabled");

                if (isDisabled || uploadQueueSlates.length == 0) {
                  console.log("do nothing");
                } else {
                  var uploadArray = [];
                  uploadQueue.forEach((item) => {
                    console.log("upload slates btn: ", uploadQueueSlates);
                    uploadQueueSlates.forEach((slate, i) => {
                      //console.log(item);
                      let isUploadData = {
                        file: item,
                        slate: slate.slate,
                        api: slate.api,
                      };
                      uploadArray.push({ data: isUploadData });
                      console.log("data main: ", isUploadData);
                    });
                  });

                  console.log("Final upload array: ", uploadArray);

                  //console.log("Upload queue:", uploadQueue);
                  var isUploadQueue = JSON.stringify(uploadQueue);
                  var isPageTitle = JSON.stringify(pageData);
                  var isApiData = JSON.stringify(uploadArray);

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
                  document.getElementById("slate-upload-alert").style.display =
                    "none";

                  document
                    .getElementById("slate-drawer-upload-progress")
                    .classList.toggle("active");

                  loadUploads(uploadQueue);
                }
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
    Array.prototype.map.call(fetchImages, (i) => {
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
      $.getScript(chrome.extension.getURL("./app/index.js"), (data) => {
        $(data).append("body");
      })
        .done(() => {
          document.getElementById("slate-app").style.display = "inline";
          if (uploadType == "single") {
            uploadQueue.push({ file: props });
            f;
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
            props.forEach((file) => {
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
                  //img.classList.add("selected");
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
                  if (this.uploadQueueNum == 0) {
                    document
                      .getElementById("slate-upload-btn")
                      .classList.add("disabled");
                  }
                  //this.uploadQueue = updatedQueue;
                  //console.log("final upload queue", this.uploadQueue);
                }
                if (this.uploadQueueNum > 0) {
                  if (uploadQueueSlates.length > 0) {
                    document
                      .getElementById("slate-upload-btn")
                      .classList.remove("disabled");
                  }

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
            setInterval(async () => {
              document.getElementById("slate-upload-alert-text").innerHTML =
                "Uploading " + currentUploadNum.currentUploads + " files";

              if (currentUploadNum.currentUploads == 1) {
                document.getElementById("slate-upload-alert-text").innerHTML =
                  "Uploading 1 file";
              } else if (currentUploadNum.currentUploads == 0) {
                document.getElementById("slate-upload-alert-text").innerHTML =
                  "Done!";
                document
                  .getElementById("slate-upload-alert")
                  .classList.add("slate-success-alert");
                document.getElementById("slate-uploading-icon").style.display =
                  "none";
              } else {
                document.getElementById("slate-upload-alert-text").innerHTML =
                  "Uploading " + currentUploadNum.currentUploads + " files";
              }
            }, 1000);
          }
          //
          //
          //CREATE API KEY UI
          if (apiKeys.length == 0) {
            document.getElementById("slate-nokeys-error").style.display =
              "inline-block";
          } else {
            document.getElementById("slate-nokeys-error").style.display =
              "none";
          }

          apiKeys.forEach((slate) => {
            //console.log("Slate info: ", slate);
            var slateApiContainer = document.createElement("div");
            slateApiContainer.className = "slate-api";
            slateApiContainer.id = "slate-" + slate.data.name;
            slateApiDisplay = document.createElement("div");
            //slateApiDisplay.className = "slate-item-display-hide";

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
            //console.log('my slates:', mySlates)
            if (slate.slates.length == 0) {
              console.log("no slates");
              let slateContainer = document.createElement("div");
              slateContainer.className = "slate-item";
              let slateIcon = document.createElement("div");
              slateIcon.classList.add("slate-icon-position");
              slateIcon.innerHTML =
                '<svg id="not-selected" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>';
              let slateName = document.createElement("div");
              slateName.innerHTML = "Create a slate";
              slateContainer.appendChild(slateIcon);
              slateContainer.appendChild(slateName);
              document
                .getElementById("slate-" + slate.data.name)
                .appendChild(slateContainer);
              slateContainer.onclick = async () => {
                window
                  .open("https://slate.host/_?scene=NAV_SLATES", "_blank")
                  .focus();
              };
            }
            slate.slates.forEach((item, i) => {
              var slateContainer = document.createElement("div");
              slateContainer.className = "slate-item";
              //slateContainer.setAttribute("data-slateId", slate.id);
              slateContainer.onclick = async () => {
                let isSelected = slateContainer.classList.contains(
                  "slate-selected"
                );
                console.log(isSelected);

                console.log("slates: ", this.uploadQueueSlates);

                var isFinalUpload = {
                  api: slate.data.key,
                  slate: item,
                };
                if (isSelected) {
                  console.log("selected", isFinalUpload);
                  for (let i = 0; i < this.uploadQueueSlates.length; i++) {
                    console.log(i);
                    if (
                      this.uploadQueueSlates[i].slate.slatename ==
                      isFinalUpload.slate.slatename
                    ) {
                      this.uploadQueueSlates.splice(i, 1);
                    }
                  }
                  console.log("after remove final: ", this.uploadQueueSlates);
                } else {
                  console.log("not selected");
                  this.uploadQueueSlates.push(isFinalUpload);
                  console.log("inside after: ", this.uploadQueueSlates);
                }

                if (uploadQueueNum > 0) {
                  document
                    .getElementById("slate-upload-btn")
                    .classList.remove("disabled");
                }

                if (uploadQueueNum > 0) {
                  document
                    .getElementById("slate-upload-btn")
                    .classList.remove("disabled");
                }
                slateContainer.classList.toggle("slate-selected");
              };

              let slateIcon = document.createElement("div");
              slateIcon.classList.add("slate-icon-position");
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

  SlateApp.prototype.getApiKeys = async () => {
    getKey = async (key) => {
      const response = await fetch("https://slate.host/api/v2/get", {
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
      console.log("getApiKeys", data);
      let slates = [];
      return data;
    };

    var storage = new Promise((resolve, reject) => {
      chrome.storage.local.get(["apis"], (result) => {
        resolve(result);
      });
    });

    const getAPIKeys = await storage;
    var finalApiArray = [];

    if (getAPIKeys.apis) {
      for (let item of getAPIKeys.apis) {
        let keyData = await getKey(item.data.key);
        finalApiArray.push({ data: item.data, slates: keyData.collections });
      }
    }
    return finalApiArray;
  };

  SlateApp.prototype.getUploadNum = async () => {
    var storage = new Promise((resolve, reject) => {
      chrome.storage.local.get(["currentUploads"], (result) => {
        resolve(result);
      });
    });
    let getData = await storage;
    return getData;
  };

  SlateApp.prototype.getUploads = async () => {
    var storage = new Promise((resolve, reject) => {
      chrome.storage.local.get(["uploads"], (result) => {
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
chrome.runtime.onMessage.addListener(async (request, changeInfo, callback) => {
  if (request.message == "openSlateApp") {
    //checking to see if the window has loaded
    //stops duplicate app loads
    if (window.hasRun === true) return true;
    window.hasRun = true;

    //required order
    await app.getPageData();
    await app.init();
    var isUploading = await app.getUploadNum();
    if (isUploading.currentUploads > 0) {
      this.isCheckUploads = setInterval(async () => {
        currentUploadNum = await app.getUploadNum();
        if (currentUploadNum.currentUploads === 0) {
          clearInterval(this.isCheckUploads);
        }
      }, 1000);
    }
    let apiKeys = await app.getApiKeys();

    var allPageFiles = [];
    var type = request.uploadType;
    if (type == "single") {
      let isSingleId = Math.random().toString(36).substr(2, 9);
      allPageFiles = {
        src: request.singleImageUrl,
        id: isSingleId,
        page_position: null,
        type: "img",
        altTitle: this.pageData.title,
        height: null,
        width: null,
      };
    } else {
      allPageFiles = await app.getPageFiles();
      for (let i = 0; i < allPageFiles.length; i++) {
        origFiles.push({ file: allPageFiles[i] });
      }
    }
    await app.listFiles(allPageFiles, apiKeys, isUploading, type);
  }
});
