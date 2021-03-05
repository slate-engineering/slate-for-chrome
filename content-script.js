//
//
//App functions
var SlateApp = (function () {
  //set default variables
  this.uploadQueue = [];
  this.uploadQueueSlates = [];

  this.pageData = {
    title: "none",
    source: "none",
  };

  function SlateApp() {
    //Create app
  }

  SlateApp.prototype.init = async () => {
    try {
      $.get(chrome.extension.getURL("./app/pages/app.html"), function (data) {
        $(data).prependTo("body");
      })
        .done(function () {
          //
          //
          //Initilize app event listeners
          document.getElementById("slate-upload-btn").addEventListener("click", function () {
            chrome.runtime.sendMessage({ uploadData: "slate" });
          });
          document.getElementById("slate-close-icon").addEventListener("click", function () {
            location.reload();
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
      const id = position;
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
    console.log("Page data:", this.pageData);
  };

  SlateApp.prototype.listFiles = async (props) => {
    try {
      $.getScript(chrome.extension.getURL("./app/index.js"), function (data) {
        $(data).append("body");
      })
        .done(function () {
          console.log("index added");
          props.forEach(function (file) {
            let div = document.createElement("div");
            div.className = "slate-img-container slate-masonry-item";
            let img = document.createElement("img");
            img.className = "slate-list_img";
            img.id = "img-" + file.id;
            if (file.type == "img") {
              img.src = file.src;
            }

            let checkbox = document.createElement("input");
            checkbox.setAttribute("type", "checkbox");
            checkbox.value = file.src;
            checkbox.id = "check-" + file.id;
            checkbox.className = "slate-img-checkbox";

            let customCheckbox = document.createElement("div");
            customCheckbox.className = "slate-custom-checkbox";
            customCheckbox.innerHTML =
              '<svg class="slate-custom-checkbox-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';

            div.onclick = async () => {
              this.uploadQueue.push({ file });
              console.log("Img added: ", this.uploadQueue);
              let customCheckIcon = customCheckbox.childNodes[0];
              if (!checkbox.checked) {
                checkbox.checked = true;
                customCheckbox.className = "slate-custom-checkbox checked";
                customCheckIcon.classList.add("checked");
                img.classList.add("selected");
                div.classList.add("selected");
              } else {
                checkbox.checked = false;
                customCheckbox.className = "slate-custom-checkbox";
                customCheckIcon.classList.remove("checked");
                img.classList.remove("selected");
                div.classList.remove("selected");
              }
              //await SelectFile(item);
            };

            div.appendChild(checkbox);
            div.appendChild(img);
            div.appendChild(customCheckbox);
            document.getElementById("slate-image-grid").appendChild(div);
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

  SlateApp.prototype.getApiKeys = async (props) => {
    //add local storage to get all api keys
    let keys = [];
    chrome.storage.local.get(["apis"], (result) => {
      for (let api of result.apis) keys.push(api);
    });
    return keys;
  };

  SlateApp.prototype.listApiKeys = async (props) => {
    //TODO: (@jason) add ui functions to list slates
    console.log(props);
    return true;
  };

  return SlateApp;
})();

//
//
//App event listeners
var app = new SlateApp();
chrome.runtime.onMessage.addListener(async function (request, callback) {
  if (request.message == "openSlateApp") {
    //required order
    await app.init();
    await app.getPageData();
    let allPageFiles = await app.getPageFiles();
    await app.listFiles(allPageFiles);
    //Add below:
  }
});
